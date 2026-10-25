// Legacy migrations are needed only for old saves, not every current-save boot (H16).
import { FACILITY_SLOTS, grantProfessionExp, PROFESSION_MAX_LEVEL, professionExpToNext } from '../economy/pacing'
import { facilitySpec } from '../economy/jobs'
import { ITEM_IDENTITIES as ITEM_FAMILIES, isItemId } from '../items/identity'
import { gearById } from '../economy/gear'

/** Class ranks topped out at 5 from v13 to v17 (D77). */
const CLASS_MAX_RANK = 5
/** Token ids as they were before v18 removed every token (D105). */
const gradeBand = (grade: number): number => Math.ceil(grade / 2)
const masteryTokenId = (band: number): string => `token-mastery-${band}`

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v)
const RETIRED_TOKEN = /^token-class-[a-z]+-5$/
const dropRetired = (items: unknown) => {
  if (isRecord(items)) for (const id of Object.keys(items)) if (RETIRED_TOKEN.test(id)) delete items[id]
}

/**
 * v12 → v13 (D77): class ranks top out at 5, rank r opens depths 1–r behind the Uma-level gates, and band 5 drops no
 * Promotion Tokens. Clamps ranks, forgets skills the gates now close (their points come back) and drops band-5
 * Promotion Tokens. Anything malformed is left for the strict parse to reject.
 */
function toV13(world: Record<string, unknown>): Record<string, unknown> {
  const w = JSON.parse(JSON.stringify(world)) as Record<string, unknown>
  dropRetired(w.items)
  if (isRecord(w.facilities)) {
    for (const f of Object.values(w.facilities)) {
      if (!isRecord(f) || !Array.isArray(f.jobs)) continue
      for (const job of f.jobs) {
        if (!isRecord(job)) continue
        dropRetired(job.inputs)
        if (Array.isArray(job.queue)) for (const q of job.queue) if (isRecord(q)) dropRetired(q.inputs)
      }
    }
  }
  if (isRecord(w.umas)) {
    for (const uma of Object.values(w.umas)) {
      if (!isRecord(uma) || !isRecord(uma.ranks) || !isRecord(uma.ranks.classes) || !isRecord(uma.builds) || typeof uma.level !== 'number') continue
      const classes = uma.ranks.classes
      const level = uma.level
      for (const c of Object.keys(classes)) {
        const r = classes[c]
        if (typeof r === 'number' && r > CLASS_MAX_RANK) classes[c] = CLASS_MAX_RANK
      }
    }
  }
  return w
}

/** Gear types D86 renamed, and the ones it retired with the families their old recipes took (main, then the accent's). */
const RENAMED_GEAR: Readonly<Record<string, string>> = { spear: 'lance', 'short-sword': 'katana' }
const RETIRED_GEAR: Readonly<Record<string, string>> = { 'mage-staff': 'woods', 'arcane-staff': 'woods', 'cleric-staff': 'woods', 'summoner-tome': 'fibers' }
const ACCENT_FAMILY: Readonly<Record<string, string>> = {
  hp: 'hides-scales', mp: 'essences', atk: 'ores', matk: 'crystals', def: 'stones', mdef: 'fibers', speed: 'woods', limit: 'bones-horns',
}
const OLD_GEAR = /^([a-z-]+)-g(\d{1,2})-([a-z]+)$/
/** A v13 gear id as v14 reads it: renamed, or null when retired. */
function v14Gear(id: unknown): string | null | undefined {
  const m = typeof id === 'string' ? OLD_GEAR.exec(id) : null
  if (!m) return undefined
  if (m[1]! in RETIRED_GEAR) return null
  return RENAMED_GEAR[m[1]!] ? `${RENAMED_GEAR[m[1]!]}-g${m[2]}-${m[3]}` : (id as string)
}
/** What a retired piece gives back: its old recipe's main and accent refined items and its Crafting Token. */
function refundOf(id: string): Record<string, number> {
  const [, type, g, accent] = OLD_GEAR.exec(id)!
  const grade = Number(g)
  const refined = (family: string) => ITEM_FAMILIES.find((f) => f.id === family)?.refined[grade - 1]
  const out: Record<string, number> = {}
  for (const family of [RETIRED_GEAR[type!]!, ACCENT_FAMILY[accent!]]) { const r = family ? refined(family) : undefined; if (r) out[r] = (out[r] ?? 0) + 1 }
  // The Crafting Token as it was; v15 turns it into a Mastery Token like every other.
  const token = `token-craft-${accent}-${gradeBand(grade)}`
  out[token] = (out[token] ?? 0) + 1
  return out
}

/**
 * v13 → v14 (D86): Spear pieces become Lance pieces and Short Swords Katanas; Mage, Arcane and Cleric Staves and
 * Summoner Tomes are taken back and their materials and Crafting Token returned (a Forge job making one is cancelled the
 * same way); an open fight closes with no loss. Builds become classes in parseUmas.
 */
function toV14(world: Record<string, unknown>): Record<string, unknown> {
  const w = JSON.parse(JSON.stringify(world)) as Record<string, unknown>
  const items = (isRecord(w.items) ? w.items : (w.items = {})) as Record<string, number>
  const refund = (id: string, times = 1) => { for (const [k, n] of Object.entries(refundOf(id))) items[k] = (items[k] ?? 0) + n * times }
  if (isRecord(w.gear)) {
    const next: Record<string, unknown> = {}
    for (const [id, n] of Object.entries(w.gear)) {
      const to = v14Gear(id)
      if (to === null) { refund(id, typeof n === 'number' ? n : 0); continue }
      next[to ?? id] = n
    }
    w.gear = next
  }
  if (isRecord(w.umas)) {
    for (const uma of Object.values(w.umas)) {
      if (!isRecord(uma) || !isRecord(uma.gear)) continue
      const gear = uma.gear
      if (Array.isArray(gear.locker)) {
        gear.locker = gear.locker.flatMap((id: unknown) => {
          const to = v14Gear(id)
          if (to === null) { refund(id as string); return [] }
          return [to ?? id]
        })
      }
      if (isRecord(gear.equipped)) {
        const next: Record<string, unknown> = {}
        for (const [slot, id] of Object.entries(gear.equipped)) {
          const to = v14Gear(id)
          if (to === null || slot in RETIRED_GEAR) continue
          next[RENAMED_GEAR[slot] ?? slot] = to ?? id
        }
        gear.equipped = next
      }
    }
  }
  if (isRecord(w.facilities)) {
    for (const f of Object.values(w.facilities)) {
      if (!isRecord(f) || !Array.isArray(f.jobs)) continue
      f.jobs = f.jobs.map((job: unknown) => {
        if (!isRecord(job) || job.kind !== 'craft') return job
        if (Array.isArray(job.queue)) job.queue = job.queue.filter((q: unknown) => !(isRecord(q) && v14Gear(q.output) === null))
          .map((q: unknown) => (isRecord(q) && v14Gear(q.output) ? { ...q, output: v14Gear(q.output) } : q))
        const to = v14Gear(job.output)
        if (to === null) {
          // The pieces still to make give their inputs back.
          const left = Math.max(0, Number(job.count) - Number(job.collected))
          if (isRecord(job.inputs)) for (const [k, n] of Object.entries(job.inputs)) if (typeof n === 'number') items[k] = (items[k] ?? 0) + n * left
          return null
        }
        return to ? { ...job, output: to } : job
      })
    }
  }
  if (isRecord(w.world) && isRecord(w.world.run)) w.world.run = { ...w.world.run, battle: null }
  return w
}

/** A Crafting Token's id before v15 (`token-craft-<stat>-<band>`), or null. */
const OLD_CRAFT_TOKEN = /^token-craft-[a-z]+-(\d)$/
/**
 * v14 → v15 (D94): Crafting Tokens become Mastery Tokens of the same band, one for one; gear recipes take no token now.
 * A Forge job's reserved tokens come back as Mastery Tokens and leave its inputs, and queued Forge jobs drop theirs.
 */
function toV15(world: Record<string, unknown>): Record<string, unknown> {
  const w = JSON.parse(JSON.stringify(world)) as Record<string, unknown>
  const items = (isRecord(w.items) ? w.items : (w.items = {})) as Record<string, number>
  const add = (id: string, n: number) => { if (n > 0) items[id] = (items[id] ?? 0) + n }
  for (const [id, n] of Object.entries(items)) {
    const m = OLD_CRAFT_TOKEN.exec(id)
    if (!m) continue
    delete items[id]
    add(masteryTokenId(Number(m[1])), typeof n === 'number' ? n : 0)
  }
  const strip = (inputs: unknown, times: number): Record<string, unknown> => {
    const out: Record<string, unknown> = {}
    if (!isRecord(inputs)) return out
    for (const [id, n] of Object.entries(inputs)) {
      const m = OLD_CRAFT_TOKEN.exec(id)
      if (m) add(masteryTokenId(Number(m[1])), typeof n === 'number' ? n * times : 0)
      else out[id] = n
    }
    return out
  }
  if (isRecord(w.facilities)) {
    for (const f of Object.values(w.facilities)) {
      if (!isRecord(f) || !Array.isArray(f.jobs)) continue
      for (const job of f.jobs) {
        if (!isRecord(job)) continue
        job.inputs = strip(job.inputs, Math.max(0, Number(job.count) - Number(job.collected)))
        if (Array.isArray(job.queue)) for (const q of job.queue) if (isRecord(q)) q.inputs = strip(q.inputs, 0)
      }
    }
  }
  return w
}

/** EXP from level L to L+1 before D96, kept to carry levels over. */
const OLD_PROFESSION_EXP = (level: number): number => 20 + 6 * level
/**
 * v15 → v16 (D96): the profession curve is ten times longer. Jobs still pay the same EXP per minute of work, so every
 * profession level carries its EXP over whole and lands at the level that work earns on the new curve.
 */
function toV16(world: Record<string, unknown>): Record<string, unknown> {
  const w = JSON.parse(JSON.stringify(world)) as Record<string, unknown>
  if (!isRecord(w.umas)) return w
  for (const uma of Object.values(w.umas)) {
    if (!isRecord(uma) || !isRecord(uma.professions)) continue
    for (const p of Object.values(uma.professions)) {
      if (!isRecord(p) || !Number.isInteger(p.level) || !Number.isInteger(p.exp)) continue
      let bank = Number(p.exp)
      for (let l = 1; l < Math.min(Number(p.level), PROFESSION_MAX_LEVEL); l++) bank += OLD_PROFESSION_EXP(l)
      let level = 1
      while (level < PROFESSION_MAX_LEVEL && bank >= professionExpToNext(level)) bank -= professionExpToNext(level++)
      p.level = level
      p.exp = bank
    }
  }
  return w
}

export function migrateWorld(raw: unknown, version: number): unknown {
  const v13 = version < 13 && isRecord(raw) ? toV13(raw) : raw
  const v14 = version < 14 && isRecord(v13) ? toV14(v13) : v13
  const v15 = version < 15 && isRecord(v14) ? toV15(v14) : v14
  const v16 = version < 16 && isRecord(v15) ? toV16(v15) : v15
  const v18 = version < 18 && isRecord(v16) ? toV18(v16, version) : v16
  const v19 = version < 19 && isRecord(v18) ? toV19(v18) : v18
  const v20 = version < 20 && isRecord(v19) ? toV20(v19) : v19
  const v21 = version < 21 && isRecord(v20) ? toV21(v20) : v20
  const v22 = version < 22 && isRecord(v21) ? toV22(v21) : v21
  const v23 = version < 23 && isRecord(v22) ? toV23(v22) : v22
  const v24 = version < 24 && isRecord(v23) ? toV24(v23) : v23
  const v25 = version < 25 && isRecord(v24) ? toV25(v24) : v24
  return version < 26 && isRecord(v25) ? toV26(v25) : v25
}

// --- v26 → v27 (D205): R1, the Tier rework's fight. Written dark in H69, chained by H72 with SAVE_SCHEMA_VERSION 27 -----

/** The owner's three weapons a class (CP3, D200), in slot order, as literals: a migration step is frozen history. */
const V27_DEFAULTS: Readonly<Record<string, readonly string[]>> = {
  brawler: ['greatsword', 'axe', 'lance'],
  mage: ['tome-fire', 'tome-ice', 'tome-lightning'],
  spellblade: ['katana', 'lance', 'tome-lightning'],
  summoner: ['tome-dark', 'tome-light', 'bow'],
  paladin: ['greatsword', 'axe', 'tome-light'],
  cleric: ['tome-light', 'tome-ice', 'bow'],
}
/** Branch B's catalog side letter by class and kind (H65's `RPG_BRANCH_B`, D201, copied): a class's keys are its kinds. */
const V27_BRANCH_B: Readonly<Record<string, Readonly<Record<string, 'a' | 'b'>>>> = {
  brawler: { greatsword: 'b', axe: 'b', lance: 'a', bow: 'b', katana: 'a' },
  mage: { 'tome-fire': 'a', 'tome-ice': 'a', 'tome-lightning': 'a', 'tome-light': 'b', 'tome-dark': 'a' },
  spellblade: { greatsword: 'b', axe: 'b', lance: 'b', bow: 'b', katana: 'b', 'tome-fire': 'b', 'tome-ice': 'b', 'tome-lightning': 'b', 'tome-light': 'b', 'tome-dark': 'b' },
  summoner: { greatsword: 'a', axe: 'a', lance: 'a', bow: 'a', katana: 'a', 'tome-fire': 'b', 'tome-ice': 'b', 'tome-lightning': 'b', 'tome-light': 'b', 'tome-dark': 'b' },
  paladin: { greatsword: 'b', axe: 'b', lance: 'b', bow: 'b', katana: 'b', 'tome-fire': 'b', 'tome-ice': 'b', 'tome-lightning': 'b', 'tome-light': 'b', 'tome-dark': 'b' },
  cleric: { greatsword: 'b', axe: 'b', lance: 'b', bow: 'b', katana: 'b', 'tome-fire': 'b', 'tome-ice': 'b', 'tome-lightning': 'b', 'tome-light': 'b', 'tome-dark': 'b' },
}
/** v16's equipped slots: three, and one more at Uma Lv 10, 20, 30 and 40 (CP22). */
const V27_SLOT_GATES = [10, 20, 30, 40]
const V27_NODE = /^([a-z]+)-([a-z-]+)\.([1-5])([ab])?$/
const isStrings = (v: unknown): v is string[] => Array.isArray(v) && v.every((s) => typeof s === 'string')

/** One class's steps 1–3 of `toV27`; a class that isn't a v26 one (no `tree` list of strings, or `lines` already) is left. */
function v27Class(classId: string, raw: unknown, level: unknown): unknown {
  const weapons = V27_DEFAULTS[classId], sides = V27_BRANCH_B[classId]
  if (!weapons || !sides || !isRecord(raw) || 'lines' in raw || !isStrings(raw.tree)) return raw
  const tree = raw.tree
  const node = (id: string) => {
    const m = V27_NODE.exec(id)
    return m && m[1] === classId && m[2]! in sides ? { weapon: m[2]!, depth: Number(m[3]), side: m[4] ?? null } : null
  }
  // 2. B on a tree where she learned any node of its B line, at any depth; A (absent) everywhere else.
  const lines: Record<string, 'B'> = {}
  for (const w of Object.keys(sides)) {
    if (tree.some((id) => { const n = node(id); return n?.weapon === w && n.side === sides[w] })) lines[w] = 'B'
  }
  // 3. What she still holds, in her order and once each, within v16's slots at her level; nothing left is auto.
  const holds = (id: string): boolean => {
    const n = node(id)
    if (!n || !weapons.includes(n.weapon)) return false
    return n.depth <= 2 || lines[n.weapon] !== 'B' ? n.side === null : n.side === sides[n.weapon]
  }
  let loadout: unknown = raw.loadout
  if (isStrings(raw.loadout)) {
    const slots = 3 + V27_SLOT_GATES.filter((gate) => typeof level === 'number' && level >= gate).length
    const kept = [...new Set(raw.loadout.filter(holds))].slice(0, slots)
    loadout = kept.length ? kept : null
  }
  const { weapons: _weapons, tree: _tree, loadout: _loadout, ...rest } = raw
  // 1. The class's new defaults.
  return { weapons: [...weapons], lines, loadout, ...rest }
}

/** One Uma of `toV27`: each class she has set up, and her calling. */
function v27Uma(raw: unknown): unknown {
  if (!isRecord(raw)) return raw
  const classes = raw.classes
  return {
    ...raw,
    ...(isRecord(classes) ? { classes: Object.fromEntries(Object.entries(classes).map(([classId, setup]) => [classId, v27Class(classId, setup, raw.level)])) } : {}),
    ...('calling' in raw ? {} : { calling: { pick: null, confirmed: false } }),
  }
}

/**
 * v26 → v27 (D205; class-progression.md §14, CP31's v27 part): R1's three weapons, branch picks for side skills, the
 * loadout pruned and the calling pick stored, and nobody loses progress. Written dark in H69 and **chained by H72** with
 * `SAVE_SCHEMA_VERSION` 27, in the switch's commit (until then the parse reads v27's shape only with the switch at 16).
 * Per Uma, per class in `classes` that still has `tree` and no `lines`:
 * 1. `weapons` become the class's new defaults (CP3); her per-tree picks stay, so slotting an old kind back restores its
 *    line, and her crafted weapons stay equipped on their kinds;
 * 2. `lines[w]` is B for each of her class's kinds `w` where `tree` holds a node of that tree's B line
 *    (`<class>-<w>.<1–5><B's letter>`, H65's table), at any depth; `tree` is removed, and every other side with it;
 * 3. `loadout` (when not null) keeps, in her order and once each, the ids she holds in v27: her three new weapons' trees,
 *    depths 1–2 the cores, depths 3–5 the core (A) or her B line's node (B), at most her v16 slot count at her Uma level
 *    (three, plus one each at Lv 10, 20, 30, 40); none left goes back to auto (`null`).
 * And per Uma, `calling` becomes `{ pick: null, confirmed: false }` when absent: the pre-selection, unconfirmed (UT17).
 * Nothing else moves: class ids, Class Ranks, Hero seats, Bonds, Class Marks, gear, ranks and wallets, active classes,
 * parties, the open world-map and Rift fights (v15 inputs replay on v15). Literals only, like every step; idempotent (a
 * class with `lines` is v27 already); anything malformed (a class that isn't an object, a `tree` that isn't a list of
 * strings, a loadout that isn't one) is left for the strict parse.
 */
export function toV27(world: Record<string, unknown>): Record<string, unknown> {
  return isRecord(world.umas) ? { ...world, umas: Object.fromEntries(Object.entries(world.umas).map(([id, uma]) => [id, v27Uma(uma)])) } : world
}

// --- v25 → v26 (D190): an independent party lead ---------------------------------------------------------------

/**
 * A party's lead stops being encoded by slot 1. Existing saves keep the face they showed before the change by naming
 * their first occupied slot. Empty parties and malformed rows are left for the strict parser. The step is idempotent.
 */
export function toV26(world: Record<string, unknown>): Record<string, unknown> {
  if (!Array.isArray(world.parties)) return world
  return { ...world, parties: world.parties.map((party) => {
    if (!isRecord(party) || 'lead' in party || !Array.isArray(party.slots)) return party
    return { ...party, lead: party.slots.find((id): id is string => typeof id === 'string') ?? null }
  }) }
}

// --- v24 → v25 (D180): classes v2's Paladin. Written in H58, chained by H61 with SAVE_SCHEMA_VERSION 25 (D188) ----------

/** Classes v2's Arms and its two healers' default spreads (D179), as literals: a migration step is frozen history. */
const V25_ARMS = ['greatsword', 'axe', 'lance', 'bow', 'katana']
const V25_CLERIC = { tome: ['tome-light', 'tome-dark', 'tome-lightning'], arms: ['katana', 'bow'] }
const V25_PALADIN = { arms: ['greatsword', 'axe', 'lance'], tome: ['tome-ice', 'tome-fire'] }
/** The Cleric Chapel's seats 3 and 4 (Archangel's Verdict, Archdemon's Pact) become the Paladin Bastion's 1 and 2. */
const V25_SEATS = [['cleric-3', 'paladin-1'], ['cleric-4', 'paladin-2']] as const
const V25_PALADIN_NODE = /^paladin-([a-z-]+)\.[1-5][ab]?$/

/** `want` of her weapons of one kind, in her order, then the spread's of that kind in its order, skipping ones she has. */
function v25Pick(hers: readonly string[], want: number, spread: readonly string[]): string[] {
  const out = hers.slice(0, want)
  for (const w of spread) if (out.length < want && !out.includes(w)) out.push(w)
  return out
}
/** A Cleric's "any five" as classes v2's slots: the Cleric's Tome ×3 + Arms ×2, or the Paladin's Arms ×3 + Tome ×2. */
function v25Weapons(weapons: readonly string[], lead: 'tome' | 'arms'): string[] {
  const tomes = weapons.filter((w) => TOMES.includes(w)), arms = weapons.filter((w) => V25_ARMS.includes(w))
  return lead === 'tome'
    ? [...v25Pick(tomes, 3, V25_CLERIC.tome), ...v25Pick(arms, 2, V25_CLERIC.arms)]
    : [...v25Pick(arms, 3, V25_PALADIN.arms), ...v25Pick(tomes, 2, V25_PALADIN.tome)]
}
const toPaladin = (id: unknown): unknown => (typeof id === 'string' && id.startsWith('cleric-') ? `paladin-${id.slice('cleric-'.length)}` : id)
const paladinWeaponOf = (id: unknown): string => (typeof id === 'string' ? V25_PALADIN_NODE.exec(id)?.[1] ?? '' : '')
/** A seat's or Bond's key moves from the Chapel to the Bastion when the Bastion's is free. */
function v25Seats(byId: Record<string, unknown>): Record<string, unknown> {
  const out = { ...byId }
  for (const [from, to] of V25_SEATS) if (from in out && !(to in out)) { out[to] = out[from]; delete out[from] }
  return out
}
const isOrbId = (id: unknown): boolean => typeof id === 'string' && id.startsWith('orb-')
const isSupportId = (id: unknown): boolean => typeof id === 'string' && (id.startsWith('talisman-') || id.startsWith('amulet-'))
/** Accessory 1 becomes the Damage slot (an Orb) and accessory 2 the Support slot (a Talisman or an Amulet): each takes
 * its own slot's piece first, else the other slot's. A second piece of one group stays in her locker, unworn. */
function v25Accessories(equipped: Record<string, unknown>): Record<string, unknown> {
  const a1 = equipped['accessory-1'], a2 = equipped['accessory-2']
  if ([a1, a2].some((id) => id !== undefined && !isOrbId(id) && !isSupportId(id))) return equipped
  const damage = isOrbId(a1) ? a1 : isOrbId(a2) ? a2 : undefined
  const support = isSupportId(a2) ? a2 : isSupportId(a1) ? a1 : undefined
  const out = { ...equipped }
  delete out['accessory-1']
  delete out['accessory-2']
  return { ...out, ...(damage === undefined ? {} : { 'accessory-1': damage }), ...(support === undefined ? {} : { 'accessory-2': support }) }
}

/** One Uma's steps 1–5 of `toV25`. */
function v25Uma(raw: unknown): unknown {
  if (!isRecord(raw)) return raw
  const uma: Record<string, unknown> = { ...raw }
  const ranks = isRecord(uma.ranks) ? uma.ranks : undefined
  const tracks = ranks && isRecord(ranks.classes) ? ranks.classes : undefined
  const classes = isRecord(uma.classes) ? uma.classes : undefined
  const cleric = classes && isRecord(classes.cleric) ? classes.cleric : undefined
  // 1. The Paladin from the Cleric, once: her Class Rank, and her trees, weapons and loadout as below.
  const paladinFresh = tracks?.paladin === undefined && classes?.paladin === undefined
  if (paladinFresh && tracks?.cleric !== undefined) uma.ranks = { ...ranks, classes: { ...tracks, paladin: isRecord(tracks.cleric) ? { ...tracks.cleric } : tracks.cleric } }
  const weapons = Array.isArray(cleric?.weapons) && cleric.weapons.every((w) => TOMES.includes(w as string) || V25_ARMS.includes(w as string))
    ? (cleric.weapons as string[]) : undefined
  if (classes && cleric && weapons) {
    // 2. The Cleric's slots; 3. the Paladin's, from the Cleric's weapons before 2.
    const next: Record<string, unknown> = { ...classes, cleric: { ...cleric, weapons: v25Weapons(weapons, 'tome') } }
    if (paladinFresh) {
      const held = v25Weapons(weapons, 'arms')
      const kept = Array.isArray(cleric.loadout) ? cleric.loadout.map(toPaladin).filter((id) => held.includes(paladinWeaponOf(id))) : null
      next.paladin = {
        weapons: held, tree: Array.isArray(cleric.tree) ? cleric.tree.map(toPaladin) : cleric.tree,
        loadout: kept && [...kept.filter((id) => V25_ARMS.includes(paladinWeaponOf(id))), ...kept.filter((id) => TOMES.includes(paladinWeaponOf(id)))],
      }
    }
    uma.classes = next
  }
  // 4. Her Bonds with the moving seats; 5. her accessories in their typed slots.
  if (isRecord(uma.bonds)) uma.bonds = v25Seats(uma.bonds)
  if (isRecord(uma.gear) && isRecord(uma.gear.equipped)) uma.gear = { ...uma.gear, equipped: v25Accessories(uma.gear.equipped) }
  return uma
}

/**
 * v24 → v25 (D180, classes-v2.md §5, §6.1, §8): the Paladin joins and nobody loses progress. Written dark in H58 and
 * chained by H61 (D188) with `SAVE_SCHEMA_VERSION` 25, in the switch's commit. Per Uma:
 * 1. with Cleric progress and no Paladin entry yet, her Cleric Class Rank is copied to the Paladin, and her Cleric setup
 *    becomes the Paladin's: the tree renamed `cleric-` → `paladin-` (same depths, sides and costs: Rebirth becomes Heavy
 *    Devotion, Heavy Transfix Valkyrie's Oath), the weapons of 3, and her loadout renamed (null stays null) keeping her
 *    Paladin weapons' skills, Arms first, then Tomes, each in her order;
 * 2. the Cleric's "any five" become Tome ×3 + Arms ×2: her Tomes (first three), then her Arms (first two), in her order,
 *    gaps filled from v2's Cleric spread (Light, Dark, Thunder; Katana, Bow), skipping ones she has;
 * 3. the Paladin's, the other way round from her old Cleric weapons: Arms ×3, then Tome ×2, from v2's Paladin spread
 *    (Greatsword, Axe, Lance; Blizzard, Fire);
 * 4. her Bonds with `cleric-3` and `cleric-4` move to `paladin-1` and `paladin-2` when those are empty;
 * 5. accessory 1 holds an Orb (hers in 1, else in 2) and accessory 2 a Talisman or Amulet (hers in 2, else in 1); a
 *    second piece of one group stays bound in her locker, unworn.
 * Per world, seats `cleric-3` and `cleric-4` move with their Hero and Learners to `paladin-1` and `paladin-2` when those
 * are empty. Nothing else moves: active classes, parties, the open world-map and Rift fights (v14 inputs replay on v14),
 * Rift runs and attempts, wallets and other ranks. Literals only, like every step; idempotent, so a v25 save relabelled
 * older still parses; anything malformed is left for the strict parse.
 */
export function toV25(world: Record<string, unknown>): Record<string, unknown> {
  return {
    ...world,
    ...(isRecord(world.umas) ? { umas: Object.fromEntries(Object.entries(world.umas).map(([id, uma]) => [id, v25Uma(uma)])) } : {}),
    ...(isRecord(world.heroes) ? { heroes: v25Seats(world.heroes) } : {}),
  }
}

// --- v23 → v24 (D171) ------------------------------------------------------------------------------------------------

/**
 * Each world's Rift gains no open fight and a fight count of 0, and each run gains no traces and no open Convergence
 * attempt, keeping its attempts. Written as literals, not from `rift/state.ts`: a migration step is frozen history. It
 * overwrites, so a current save relabelled as an older one still parses; anything malformed (a Rift or run that isn't an
 * object, unknown keys) is left for the strict parse. The account's `defeated` is added in `parseSaveChecked`.
 */
function toV24(world: Record<string, unknown>): Record<string, unknown> {
  const rift = world.rift
  if (!isRecord(rift)) return world
  const runs = Array.isArray(rift.runs)
    ? rift.runs.map((run: unknown) => (isRecord(run) ? { ...run, traces: {}, convergence: isRecord(run.convergence) ? { ...run.convergence, open: null } : run.convergence } : run))
    : rift.runs
  return { ...world, rift: { ...rift, runs, battle: null, battles: 0 } }
}

// --- v22 → v23 (D163) ------------------------------------------------------------------------------------------------

/**
 * Each tier world gains its Rift (D161), with no runs and no Echo wins. Written as a literal, not `newRiftState()`: a
 * migration step is frozen history, and this file never imports `save.ts`. It overwrites, so a current save relabelled
 * as an older one still parses. The account's new fields are added in `parseSaveChecked`.
 */
function toV23(world: Record<string, unknown>): Record<string, unknown> {
  return { ...world, rift: { runs: [], echoes: {} } }
}

// --- v21 → v22 (SC3) -------------------------------------------------------------------------------------------------

/**
 * Work moves to the shared engine's per-Uma rows (SC3). Each facility's level moves to `buildings` (above level 1).
 * Every job finishes into the Warehouse: what it hadn't handed over yet goes to its shelf (items, the gear stock or the
 * Star Gems) and pays its Craft EXP, as if collected now. Queued jobs are dropped; they had taken nothing. Every Uma
 * starts Free, with no last job. The owner accepted losing in-flight time (SC3). Anything malformed is left for the strict
 * parse to reject.
 */
function toV22(world: Record<string, unknown>): Record<string, unknown> {
  const { facilities, ...rest } = world
  const w: Record<string, unknown> = { ...rest, buildings: {}, work: {} }
  if (!isRecord(facilities)) return w
  const buildings: Record<string, { level: number }> = {}
  const shelves: Record<string, Record<string, unknown>> = {
    items: isRecord(w.items) ? { ...w.items } : {}, gear: isRecord(w.gear) ? { ...w.gear } : {}, gems: isRecord(w.gems) ? { ...w.gems } : {},
  }
  const umas = isRecord(w.umas) ? { ...w.umas } : {}
  for (const [place, raw] of Object.entries(facilities)) {
    if (!isRecord(raw)) continue
    if (typeof raw.level === 'number' && raw.level > 1) buildings[place] = { level: raw.level }
    if (!Array.isArray(raw.jobs)) continue
    for (const job of raw.jobs) {
      if (!isRecord(job) || typeof job.output !== 'string' || typeof job.count !== 'number' || typeof job.collected !== 'number') continue
      const left = Math.max(0, job.count - job.collected)
      if (left === 0) continue
      const shelf = shelves[job.kind === 'craft' ? 'gear' : job.kind === 'cut' ? 'gems' : 'items']!
      shelf[job.output] = (typeof shelf[job.output] === 'number' ? (shelf[job.output] as number) : 0) + left
      const uma = typeof job.outfitId === 'string' ? umas[job.outfitId] : undefined
      if (isRecord(uma) && isRecord(uma.craft) && typeof uma.craft.level === 'number' && typeof uma.craft.exp === 'number' && typeof job.expEach === 'number') {
        umas[job.outfitId as string] = { ...uma, craft: grantProfessionExp({ level: uma.craft.level, exp: uma.craft.exp }, left * job.expEach) }
      }
    }
  }
  return { ...w, ...shelves, umas, buildings }
}

// --- v20 → v21 (D144) -------------------------------------------------------------------------------------------------

/** A v21 tier world's keys, apart from the new Star Gem shelf. */
const V21_KEYS = ['createdAt', 'wallet', 'umas', 'parties', 'world', 'items', 'facilities', 'gear', 'targets', 'heroes']
/** Only ids the item catalog still knows; anything malformed is left for the strict parse to reject. */
const knownItems = (items: unknown): unknown => (isRecord(items) ? Object.fromEntries(Object.entries(items).filter(([id]) => isItemId(id))) : items)
/**
 * One profession and Star Gems (D144). Each Uma's Craft Level is the higher of her two profession levels, with its EXP.
 * Only items the catalog still knows and places that are still facilities stay, with their levels and jobs, and each
 * facility gains the slots its level now has; any other shelf goes and the Star Gem shelf starts empty. Opened Extra
 * Stats nodes stay. Nothing here names what was dropped.
 */
function toV21(world: Record<string, unknown>): Record<string, unknown> {
  const w: Record<string, unknown> = { ...Object.fromEntries(V21_KEYS.filter((k) => k in world).map((k) => [k, world[k]])), items: knownItems(world.items), gems: {} }
  if (isRecord(w.umas)) {
    w.umas = Object.fromEntries(Object.entries(w.umas).map(([id, raw]) => {
      if (!isRecord(raw) || !('professions' in raw)) return [id, raw]
      const { professions, ...uma } = raw
      const levels = (isRecord(professions) ? Object.values(professions) : [])
        .filter((p): p is { level: number; exp: number } => isRecord(p) && typeof p.level === 'number' && typeof p.exp === 'number')
      const craft = levels.reduce<{ level: number; exp: number } | undefined>((best, p) => (!best || p.level > best.level || (p.level === best.level && p.exp > best.exp) ? p : best), undefined)
      return [id, craft ? { ...uma, craft: { level: craft.level, exp: craft.exp } } : uma]
    }))
  }
  if (isRecord(w.facilities)) {
    w.facilities = Object.fromEntries(Object.entries(w.facilities).filter(([place]) => facilitySpec(place)).map(([place, raw]) => {
      if (!isRecord(raw) || !Array.isArray(raw.jobs) || typeof raw.level !== 'number') return [place, raw]
      const jobs = raw.jobs.map((job: unknown) => (isRecord(job)
        ? { ...job, inputs: knownItems(job.inputs), queue: Array.isArray(job.queue) ? job.queue.map((q: unknown) => (isRecord(q) ? { ...q, inputs: knownItems(q.inputs) } : q)) : job.queue }
        : job))
      const slots = FACILITY_SLOTS[raw.level - 1] ?? jobs.length
      return [place, { ...raw, jobs: [...jobs, ...Array.from({ length: Math.max(0, slots - jobs.length) }, () => null)] }]
    }))
  }
  return w
}

// --- v18 → v19 (D106) --------------------------------------------------------------------------------------------------

/** The Halls of Heroes open empty and nobody has a Bond yet; the owner's five Uma Tickets for them (D106). */
export const V19_UNLOCK_TICKETS = 5
function toV19(world: Record<string, unknown>): Record<string, unknown> {
  const umas = isRecord(world.umas) ? Object.fromEntries(Object.entries(world.umas).map(([id, u]) => [id, isRecord(u) ? { ...u, bonds: {} } : u])) : world.umas
  const wallet = isRecord(world.wallet) && typeof world.wallet.unlockTickets === 'number'
    ? { ...world.wallet, unlockTickets: world.wallet.unlockTickets + V19_UNLOCK_TICKETS } : world.wallet
  return { ...world, umas, wallet, heroes: {} }
}

// --- v17 → v18 (D102–D105) ---------------------------------------------------------------------------------------------

/** The class each v13-and-older build belonged to (D86). */
const OLD_BUILD_CLASS: Readonly<Record<string, string>> = {
  'greatsword-spear': 'brawler', 'axe-bow': 'brawler', mage: 'mage', spellblade: 'spellblade', cleric: 'cleric', summoner: 'summoner',
}
/** The Learning District's training halls, which stop being facilities. */
const TRAINING_HALLS = ['brawler-dojo', 'mage-tower', 'spell-blade-salle', 'cleric-chapel', 'summoner-circle', 'armory', 'jeweler']
const TOMES = ['tome-fire', 'tome-ice', 'tome-lightning', 'tome-light', 'tome-dark']
const ELEMENTS = ['fire', 'ice', 'lightning', 'light', 'dark']
const ARMS_FAMILIES = ['ores', 'stones', 'woods', 'hides-scales']
const ARCANA_FAMILIES = ['crystals', 'fibers', 'essences', 'bones-horns']
const OLD_RECIPES: Readonly<Record<string, readonly string[]>> = {
  ring: ['crystals', 'essences', 'ores', 'stones'], charm: ['bones-horns', 'fibers', 'hides-scales', 'woods'],
}
const OLD_PIECE = /^([a-z-]+?)-g(\d{1,2})-([a-z]+)$/
/** A v17 gear id as v18 names it: weapons and Orbs lose their accent; Mail and Plate become Cuirasses, Garb and Leather
 * Robes; null for Rings and Charms, which retire. */
function v18Gear(id: unknown): string | null | undefined {
  const m = typeof id === 'string' ? OLD_PIECE.exec(id) : null
  if (!m) return undefined
  const [, type, g, accent] = m
  if (type === 'ring' || type === 'charm') return null
  if (type === 'mail' || type === 'plate') return `cuirass-g${g}-${accent}`
  if (type === 'garb' || type === 'leather') return `robe-g${g}-${accent}`
  return `${type}-g${g}`
}
const gradeOf = (id: string): number => Number(/-g(\d{1,2})/.exec(id)?.[1] ?? 0)
/** The refined items a piece is made of: a retired Ring's or Charm's old recipe, or a v18 piece's. */
function materialsOf(oldOrNewId: string): string[] {
  const m = OLD_PIECE.exec(oldOrNewId) ?? /^([a-z-]+?)-g(\d{1,2})$/.exec(oldOrNewId)
  if (!m) return []
  const type = m[1]!, grade = Number(m[2])
  const magical = TOMES.includes(type) || type === 'robe' || ELEMENTS.some((e) => type === `orb-${e}`)
  const families = OLD_RECIPES[type] ?? (magical ? ARCANA_FAMILIES : ARMS_FAMILIES)
  return families.map((f) => ITEM_FAMILIES.find((x) => x.id === f)?.refined[grade - 1]).filter((r): r is string => !!r)
}
/** Which armor kind a v18 piece is, and its slot. */
function armorSlotOf(id: string): { slot: string; kind: string } | null {
  if (id.startsWith('cuirass-')) return { slot: 'body', kind: 'cuirass' }
  if (id.startsWith('robe-')) return { slot: 'body', kind: 'robe' }
  const orb = /^orb-([a-z]+)-g/.exec(id)
  if (orb) return { slot: 'accessory', kind: ELEMENTS.includes(orb[1]!) ? 'elemental-orb' : 'arms-orb' }
  return null
}

/**
 * v17 → v18 (D102–D105), and the owner's progress reset with it: every stage win, the open fight and Spring uses go;
 * every Uma is back to Lv 1 with every Class, Weapon and Armor Rank at 1, no learned side skills and skills chosen for
 * her. Kept: unlocked Umas and parties, each Uma's class and weapon slots, profession levels, opened Extra Stats nodes
 * (five active, Lv 1's slots), items and every shelf, facilities and their jobs, Laurels and tickets, targets. Tokens go; gear is
 * renamed (Rings and Charms give their materials back); training jobs end; Marks start at 0.
 */
function toV18(world: Record<string, unknown>, version: number): Record<string, unknown> {
  const w = JSON.parse(JSON.stringify(world)) as Record<string, unknown>
  const items = (isRecord(w.items) ? w.items : (w.items = {})) as Record<string, number>
  const give = (ids: readonly string[], times = 1) => { if (times > 0) for (const id of ids) items[id] = (items[id] ?? 0) + times }
  const stripTokens = (inputs: unknown): unknown => (isRecord(inputs) ? Object.fromEntries(Object.entries(inputs).filter(([id]) => !id.startsWith('token-'))) : inputs)
  for (const id of Object.keys(items)) if (id.startsWith('token-')) delete items[id]
  // The gear stock: renamed, merged, Rings and Charms taken back.
  if (isRecord(w.gear)) {
    const next: Record<string, number> = {}
    for (const [id, n] of Object.entries(w.gear)) {
      const to = v18Gear(id), count = typeof n === 'number' ? n : 0
      if (to === null) { give(materialsOf(id), count); continue }
      next[to ?? id] = (next[to ?? id] ?? 0) + count
    }
    w.gear = next
  }
  // Each Uma starts over; her collection-side choices stay.
  if (isRecord(w.umas)) {
    for (const [outfitId, raw] of Object.entries(w.umas)) {
      if (!isRecord(raw)) continue
      const u = raw
      const classId = version < 14 ? (typeof u.build === 'string' ? OLD_BUILD_CLASS[u.build] ?? null : null) : u.classId ?? null
      const classes: Record<string, unknown> = {}
      if (version >= 14 && isRecord(u.classes)) {
        for (const [c, l] of Object.entries(u.classes)) if (isRecord(l)) classes[c] = { weapons: l.weapons, tree: [], loadout: null }
      }
      const gear = isRecord(u.gear) ? u.gear : {}
      const locker: string[] = []
      for (const id of Array.isArray(gear.locker) ? gear.locker : []) {
        const to = v18Gear(id)
        if (to === null) { give(materialsOf(id as string)); continue }
        const piece = (to ?? id) as string
        if (locker.includes(piece)) give(materialsOf(piece))
        else locker.push(piece)
      }
      // Only grade-1 pieces stay on: every rank is back at 1.
      const equipped: Record<string, string> = {}
      const kinds: Record<string, string> = {}
      for (const [slot, id] of Object.entries(isRecord(gear.equipped) ? gear.equipped : {})) {
        const piece = v18Gear(id)
        if (!piece || gradeOf(piece) !== 1 || !locker.includes(piece)) continue
        if (slot === 'armor' || slot === 'accessory') {
          const at = armorSlotOf(piece)
          if (!at) continue
          equipped[at.slot] = piece
          kinds[at.slot] = at.kind
        } else equipped[slot] = piece
      }
      const stars = isRecord(u.stars) ? u.stars : {}
      w.umas[outfitId] = {
        unlockedAt: u.unlockedAt, level: 1, exp: 0, classId, classes, professions: u.professions,
        ranks: { classes: {}, weapons: {}, armors: {} },
        stars: { unlocked: stars.unlocked, active: Array.isArray(stars.active) ? stars.active.slice(0, 5) : stars.active },
        gear: { locker, equipped, kinds },
      }
    }
  }
  // Facilities: the training halls stop being facilities; Forge jobs make renamed pieces; no job takes a token.
  if (isRecord(w.facilities)) {
    for (const hall of TRAINING_HALLS) delete w.facilities[hall]
    for (const f of Object.values(w.facilities)) {
      if (!isRecord(f) || !Array.isArray(f.jobs)) continue
      f.jobs = f.jobs.map((job: unknown) => {
        if (!isRecord(job)) return job
        job.inputs = stripTokens(job.inputs)
        if (Array.isArray(job.queue)) {
          job.queue = job.queue.filter((q: unknown) => !(isRecord(q) && job.kind === 'craft' && v18Gear(q.output) === null))
            .map((q: unknown) => (isRecord(q) ? { ...q, inputs: stripTokens(q.inputs), ...(job.kind === 'craft' && v18Gear(q.output) ? { output: v18Gear(q.output) } : {}) } : q))
        }
        if (job.kind !== 'craft') return job
        const to = v18Gear(job.output)
        if (to === null) {
          const left = Math.max(0, Number(job.count) - Number(job.collected))
          if (isRecord(job.inputs)) for (const [k, n] of Object.entries(job.inputs)) if (typeof n === 'number') items[k] = (items[k] ?? 0) + n * left
          return null
        }
        return to ? { ...job, output: to } : job
      })
    }
  }
  // The world map starts over.
  const createdAt = typeof w.createdAt === 'string' ? w.createdAt : new Date(0).toISOString()
  const ap = isRecord(w.world) ? w.world.activeParty : 0
  w.world = {
    activeParty: typeof ap === 'number' && Number.isInteger(ap) && ap >= 0 && ap < 20 ? ap : 0,
    run: { party: 0, chapterId: 'world', wins: {}, mp: {}, battle: null, battles: 0, clearedAt: null, updatedAt: createdAt },
    springs: {},
  }
  delete w.runs
  // Wallet: v11's Rush Tickets were two Speed Tickets each (D74); Marks start at 0.
  const wallet = (isRecord(w.wallet) ? w.wallet : (w.wallet = {})) as Record<string, unknown>
  if ('rushTickets' in wallet) { wallet.timeTickets = 2 * (typeof wallet.rushTickets === 'number' ? wallet.rushTickets : 0); delete wallet.rushTickets }
  wallet.gearMarks = 0
  wallet.classMarks = 0
  if (!Array.isArray(w.targets)) w.targets = []
  return w
}

// --- v19 → v20 (D124, D125) -------------------------------------------------------------------------------------------

/** An accented armor id (`helm-g3-atk`) without its accent; anything else as it was. */
const OLD_ARMOR = /^(helm|cuirass|greaves|gauntlets|circlet|robe|leggings|bracers)-g(\d{1,2})-[a-z]+$/
const v20Gear = (id: unknown): unknown => (typeof id === 'string' ? id.replace(OLD_ARMOR, '$1-g$2') : id)

/**
 * Armor loses its accent, so an Uma who held the same piece in two accents keeps one, and the stock adds them together.
 * Her accessory slot becomes her first of two; the Orbs' Armor Ranks become Accessory Ranks; Boots and Slippers start at
 * her Greaves and Leggings ranks. Forge jobs make the renamed pieces, and queued ones cost the new two-item recipe.
 */
function toV20(world: Record<string, unknown>): Record<string, unknown> {
  const w = { ...world }
  if (isRecord(w.umas)) {
    w.umas = Object.fromEntries(Object.entries(w.umas).map(([id, raw]) => {
      if (!isRecord(raw)) return [id, raw]
      const uma = { ...raw }
      if (isRecord(uma.gear)) {
        const gear = { ...uma.gear }
        if (Array.isArray(gear.locker)) gear.locker = [...new Set(gear.locker.map(v20Gear))]
        if (isRecord(gear.equipped)) {
          const equipped: Record<string, unknown> = {}
          for (const [slot, piece] of Object.entries(gear.equipped)) equipped[slot === 'accessory' ? 'accessory-1' : slot] = v20Gear(piece)
          gear.equipped = equipped
        }
        if (isRecord(gear.kinds)) { const kinds = { ...gear.kinds }; delete kinds.accessory; gear.kinds = kinds }
        uma.gear = gear
      }
      if (isRecord(uma.ranks)) {
        const ranks = { ...uma.ranks }
        const armors = isRecord(ranks.armors) ? { ...ranks.armors } : {}
        const accessories: Record<string, unknown> = {}
        for (const kind of ['arms-orb', 'elemental-orb']) if (armors[kind] !== undefined) { accessories[kind] = armors[kind]; delete armors[kind] }
        if (armors.greaves !== undefined) armors.boots = armors.greaves
        if (armors.leggings !== undefined) armors.slippers = armors.leggings
        uma.ranks = { ...ranks, armors, accessories }
      }
      return [id, uma]
    }))
  }
  if (isRecord(w.gear)) {
    const stock: Record<string, number> = {}
    for (const [id, n] of Object.entries(w.gear)) {
      const next = v20Gear(id) as string
      if (typeof n === 'number') stock[next] = (stock[next] ?? 0) + n
    }
    w.gear = stock
  }
  if (isRecord(w.facilities)) {
    const recost = (output: unknown, inputs: unknown) => {
      const piece = typeof output === 'string' ? gearById(output) : undefined
      return piece ? { ...piece.inputs } : inputs
    }
    w.facilities = Object.fromEntries(Object.entries(w.facilities).map(([place, raw]) => {
      if (!isRecord(raw) || !Array.isArray(raw.jobs)) return [place, raw]
      const jobs = raw.jobs.map((job: unknown) => {
        if (!isRecord(job)) return job
        const queue = Array.isArray(job.queue) ? job.queue.map((q: unknown) => {
          if (!isRecord(q)) return q
          const output = v20Gear(q.output)
          return { ...q, output, inputs: recost(output, q.inputs) }
        }) : job.queue
        return { ...job, output: v20Gear(job.output), queue }
      })
      return [place, { ...raw, jobs }]
    }))
  }
  return w
}
