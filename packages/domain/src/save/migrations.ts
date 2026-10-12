// Legacy migrations are needed only for old saves, not every current-save boot (H16).
import { CLASS_MAX_RANK, PROFESSION_MAX_LEVEL, professionExpToNext } from '../economy/pacing'
import { gradeBand, masteryTokenId } from '../economy/tokens'
import { ITEM_IDENTITIES as ITEM_FAMILIES } from '../items/identity'

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
 * v15 → v16 (D96): the profession curve is ten times longer. Jobs still pay the same EXP per minute of work, so every Farm
 * and Craft Level carries its EXP over whole and lands at the level that work earns on the new curve.
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
  return version < 16 && isRecord(v15) ? toV16(v15) : v15
}

