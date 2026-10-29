// Every class tree, node and number (D86, docs/archive/design/class-rework.md). One rule per class builds each tree, so a
// rebalance changes a rule here, not a table of cells. Powers are full-turn units (a Brawler's Attack = 1.0) before the
// class's hand (rules.ts) scales them. Every tree is one line of five depths: a core skill and two side skills (A, B)
// at each. Each kind keeps one shape in every class: Greatsword and Fire hit one foe hard, Axe and Ice every foe, Lance
// and Lightning random foes, Bow and Light one foe many times, Katana and Dark twice.
// Engine v16 (the Tier rework's fight, H65) reads every tree as a trunk and two lines (`node-identity.ts`'s branch
// tables) and plays new data on 32 ids, kept apart in `skill16` so older fights replay: the Spell Blade's B line is
// Pierce, and the Paladin's revive moves to her Light tree; R1's balance (H71) adds a B line's tuned power where it set
// one (`RPG_LINE_B_POWER_V16`). Names and summaries are presentation: they follow the live
// generation at module load, so an old fight may show a new name.
// Classes v3 (engine v19, D240; H126) adds 210 nodes on new ids, so no older def moves: the Tome Spellblade's and the Arms
// Summoner's ten trees of eight line nodes each (`addLineTree`), and the five Tier 0 classes' ten trees of one node each
// (`addTier0Tree`). 960 in all; the live list stays 750 until H134.
// Engine v19's weapon shapes (CV12–CV14; H128) play new data on old ids, kept apart in `skill19` as v16 did: Katana and
// Light are a double and Bow and Dark a volley (`RPG_VOLLEY`), on the Brawler's Bow, the Sorcerer's Light and Dark, the
// Spell Blade's Light and Dark cores and the Summoner's Bow, Dark and Light summons; the Brawler's Bow B becomes Barrage, the
// Sorcerer's Light B Pierce and her Dark B Barrage (`RPG_LINE_B_POWER_V19`). The two new hybrids' trees play v19's shapes
// in their `skill`: they have no older generation.
import {
  isRpgTome, RPG_CLASSES, RPG_TIER0_CLASSES, RPG_TOMES, RPG_WEAPON_KINDS, RPG_WEAPONS, rpgWeaponKind,
  type RpgClass, type RpgDamageKind, type RpgElement, type RpgStatusKind, type RpgTier0Class, type RpgTreeId, type RpgWeapon, type RpgWeaponKind,
} from './kinds'
import { RPG_TIER0_MP, RPG_TIER0_SKILL } from './class-tree'
import { RPG_BRANCH_B, RPG_SKILL_MP, RPG_SKILL_POWER, rpgTreeOf } from './node-identity'
import { BATTLE_ENGINE_VERSION, BATTLE_REGEN_ROUNDS, rpgRework, rpgV2 } from './battle/caps'
export { rpgTreeOf, rpgSideNodeLevel } from './node-identity'
// The depth tables live with the node identities (H62): the world's foes read them without building this catalog.
export { RPG_SKILL_MP, RPG_SKILL_POWER } from './node-identity'
/** Every-foe skills deal this share of single-target power to each foe; random multi-hits get a small bonus. */
export const RPG_AOE_SHARE = 0.55
export const RPG_RANDOM_BONUS = 1.05
/** v19's volley (CV12; H128): the tapped foe takes `target` of the depth's power in her hits, then one splash hit at `splash`
 * of it strikes every other living foe, plain (no rider or special). The Bow and Dark trees and Halls v2's volley seats
 * (H129) read it, so the balance (H131, S6) tunes one place: the splash within 0.30–0.40, then the target. */
export const RPG_VOLLEY = { target: 0.8, splash: 0.35 } as const
/** v19: a volley costs this much more MP than its depth's base. */
export const RPG_VOLLEY_MP = 2
/** v16 (CP42): Pierce's one hit at this × the depth's power, through the unbroken halving (`special: 'pierce'`), +2 MP: the
 * Spell Blade's branch B (on v15's Flurry ids, depths 3–5; on an Arms tree her extra hit still lands, and pierces), and from
 * v19 the Tome Spellblade's and the Sorcerer's Light B (CV14). */
export const RPG_PIERCE_SCALE = 1.15
/** v12 (D141): a mend's or a Barrier's share of the target's max HP by depth, before her Heal; on every Uma it is ×0.4. */
export const RPG_SUPPORT_SHARE = [0.14, 0.16, 0.18, 0.2, 0.22] as const
export const RPG_SUPPORT_ALL = 0.4
/** v15 (classes v2 §3.3, C8): one healer a party, so her shares double; before her ATK or M.ATK, ×0.4 on every Uma. */
export const RPG_SUPPORT_SHARE_V15 = [0.28, 0.32, 0.36, 0.4, 0.44] as const
export interface RpgPart { kind: RpgDamageKind; share: number }
/** `follow` (Halls v2, HV-A; H129): a random double's second hit, which from v19 strikes the foe the hit before it aimed at
 * while she stands. Only Halls v2's Limit Breaks carry it (`heroLimitSkills`); a `one` or `all` cast never reads it. */
export interface RpgHit { power: number; parts: RpgPart[]; follow?: true }
export type RpgSkillTarget = 'one' | 'all' | 'random'
/** A Cleric skill's status (D86): an Arms blow debuffs the foe, a Tome spell buffs every ally. */
export type RpgStatusKey = 'armor-break' | 'mind-break' | 'enfeeble' | 'shatter' | 'hex' | 'brave' | 'faith' | 'aegis' | 'breaker' | 'clarity'
export interface RpgSkillDef {
  target: RpgSkillTarget
  /** `all`: every foe takes each hit. `one`: every hit on the tapped foe. `random`: each hit on a random living foe. */
  hits: RpgHit[]
  /** Extra hits on the tapped foe after an every-foe skill (Reap). */
  focus?: RpgHit[]
  /** After the last hit, one hit on every other living foe (Spread). */
  splash?: RpgHit
  /** Hits on one other living foe, picked by the fight's seed (Cross). */
  other?: RpgHit[]
  /** Full-turn MP at Tier 1, before the hand factor. */
  mp: number
  /** The kind the skill is known by. */
  primary: RpgDamageKind
  rider?: { status: RpgStatusKind; stacks: number; per: 'foe' | 'hit' }
  /** Every living ally gains this (Heaven's Legion). */
  allies?: { status: 'barrier'; stacks: number }
  special?: 'pierce' | 'vs-broken' | 'vs-wounded'
  /** The Cleric's status: on the foe hit, on every foe, or on every ally. */
  status?: { key: RpgStatusKey; stacks: number; turns: number; to: 'foe' | 'foes' | 'allies' }
  /** A summon: it stays on the field and acts again at this share when its Summoner next summons (D86). */
  summon?: { linger: number }
  /** v12 (D141): what it does for the party besides its hits. Older engines ignore it, so old fights replay unchanged. */
  support?: RpgSupport
  /** v15 (classes v2 §3.3, §4): the healers' support, read from v15 instead of `support` (which v15 never reads). Only
   * Cleric and Paladin nodes and the halls' healing Limit Breaks have one: from v15 the Summoner only strikes. */
  support15?: RpgSupport
}
/**
 * A skill's support (combat-balance.md §6.2). `share` is of the target's max HP, raised by her Heal (from v15 by her ATK
 * or M.ATK). A mend heals the most-hurt Uma or every Uma; a Barrier shields the Uma the shown moves threaten most, or
 * every Uma. To v14 a lingering summon that mends mends again at each round's end, at its linger share.
 */
export interface RpgSupport {
  share: number
  mend?: 'hurt' | 'all'
  shield?: 'threatened' | 'all'
  /** Removes one foe-made status (Burn, Mark, Weaken, Slow) from each Uma it reaches. */
  cleanse?: boolean
  /** Raises the first fallen Uma at a quarter of her HP, once per Uma per fight. */
  revive?: boolean
  /** This share of the damage its hits deal heals the most-hurt Uma. */
  drain?: number
  /** A status on every Uma, or on every foe it hits. */
  bless?: { status: 'aegis'; stacks: number }
  curse?: { status: 'enfeeble'; stacks: number }
  /** v15: the Barrier's own share, when it isn't the mend's (the Paladin's Blizzard: 0.35 of it, on every Uma). */
  shieldShare?: number
  /** v15: Aegis stacks on each Uma the Barrier reaches (the Paladin's Greatsword). */
  aegis?: number
  /** v15: the mend lingers as Regen (the Cleric's Light): `BATTLE_REGEN_SHARE` of it at the next two round ends. */
  regen?: boolean
}
export interface RpgNode {
  id: string
  tree: RpgTreeId
  classId: RpgClass
  weapon: RpgWeapon
  depth: number
  variant: 'a' | 'b' | null
  name: string
  /** Side skills cost their depth in points; core skills come free as their depth opens (D86). */
  cost: number
  /** The def engines v6–v15 play, kept as it was so their fights replay. */
  skill: RpgSkillDef
  /** The def engine v16 plays where it differs (H65): Pierce on the Spell Blade's B line, the Paladin's revive on her Light
   * tree. A fight reads a node's def through `rpgNodeSkill(node, version)`, never `skill` directly. */
  skill16?: RpgSkillDef
  /** The def engine v19 plays where it differs from v16–v18's (H128): the weapon shapes (CV12) and the moved B lines (CV14).
   * The two new hybrids' nodes have none: their `skill` is v19's. */
  skill19?: RpgSkillDef
  /** One line for the tree screen: the live generation's def. */
  summary: string
}

const power = (d: number) => RPG_SKILL_POWER[d - 1]!
const mp = (d: number) => RPG_SKILL_MP[d - 1]!
const at = <T>(list: readonly T[], d: number) => list[d - 1]!
const round = (n: number) => Math.round(n * 1000) / 1000
/** `n` hits of one kind sharing `total`. */
const pure = (n: number, total: number, kind: RpgDamageKind): RpgHit[] =>
  Array.from({ length: n }, () => ({ power: round(total / n), parts: [{ kind, share: 1 }] }))
const plus = (def: RpgSkillDef, more: Partial<RpgSkillDef>): RpgSkillDef => ({ ...def, ...more })
/** v19's volley (CV12): one foe takes `n` hits sharing `RPG_VOLLEY.target` × `p`, then one splash hit at `RPG_VOLLEY.splash`
 * × `p` strikes every other living foe; `RPG_VOLLEY_MP` over `baseMp`. A capstone rides on top. */
const volley = (n: number, p: number, kind: RpgDamageKind, baseMp: number): RpgSkillDef =>
  ({ target: 'one', hits: pure(n, RPG_VOLLEY.target * p, kind), splash: pure(1, RPG_VOLLEY.splash * p, kind)[0]!, mp: baseMp + RPG_VOLLEY_MP, primary: kind })
const sameDef = (a: RpgSkillDef, b: RpgSkillDef): boolean => JSON.stringify(a) === JSON.stringify(b)

const STATUS_TEXT: Readonly<Record<RpgStatusKey, string>> = {
  'armor-break': 'Armor Break', 'mind-break': 'Mind Break', enfeeble: 'Enfeeble', shatter: 'Shatter', hex: 'Hex',
  brave: 'Brave', faith: 'Faith', aegis: 'Aegis', breaker: 'Breaker', clarity: 'Clarity',
}
function describe(skill: RpgSkillDef): string {
  const per = skill.target === 'all' ? 'every foe' : skill.target === 'random' ? 'random foes' : 'one foe'
  const n = skill.hits.length
  const total = skill.hits.reduce((s, h) => s + h.power, 0)
  const parts = [`${per} · ${n} hit${n === 1 ? '' : 's'} · ${round(total)}`]
  // From v19 (H128) a volley's splash is half its shape, so the live summary names it; older summaries stay as they were.
  if (skill.splash && LIVE19) parts.push(`${round(skill.splash.power)} on every other foe`)
  if (skill.status) parts.push(`${STATUS_TEXT[skill.status.key]} ${skill.status.stacks} ${skill.status.to === 'allies' ? 'on every ally' : skill.status.to === 'foes' ? 'on every foe' : 'on the foe'}`)
  if (skill.summon) parts.push(`lingers at ${skill.summon.linger}`)
  // The live generation's support (D179): the summaries move at the switch.
  const sup = rpgV2() ? skill.support15 : skill.support
  if (sup) {
    const pct = (n: number) => `${Math.round(n * 100)}%`
    if (sup.mend) parts.push(sup.mend === 'all' ? `heals every ally ${pct(sup.share)}` : `heals the most hurt ${pct(sup.share)}`)
    if (sup.regen) parts.push(`Regen ${BATTLE_REGEN_ROUNDS} rounds`)
    const shield = pct(sup.shieldShare ?? sup.share)
    if (sup.shield) parts.push(sup.shield === 'all' ? `Barrier ${shield} on every ally` : `Barrier ${shield} on the most threatened`)
    if (sup.aegis) parts.push(`Aegis ${sup.aegis} on the Barriered`)
    if (sup.cleanse) parts.push('cleanses')
    if (sup.revive) parts.push('revives the fallen')
    if (sup.drain) parts.push(`heals ${Math.round(sup.drain * 100)}% of its damage`)
    if (sup.bless) parts.push(`${STATUS_TEXT[sup.bless.status]} ${sup.bless.stacks} on every ally`)
    if (sup.curse) parts.push(`${STATUS_TEXT[sup.curse.status]} ${sup.curse.stacks} on every foe hit`)
  }
  return parts.join(' · ')
}

/** Whether the live generation is the Tier rework's fight (v16): the names and summaries it shows. */
const LIVE16 = rpgRework('fight')
/** Whether the live generation is Classes v3's (v19, H128): the weapon shapes' names and summaries. */
const LIVE19 = rpgRework('classes')
const NODES: RpgNode[] = []
interface TreeSpec {
  classId: RpgClass
  weapon: RpgWeapon
  names: readonly string[]
  a: readonly string[]
  b: readonly string[]
  core: (d: number) => RpgSkillDef
  sideA: (d: number) => RpgSkillDef
  sideB: (d: number) => RpgSkillDef
  /** Engine v16's def for a side B node where it differs (H65), and its name, shown while v16 is live. */
  sideB16?: (d: number) => { skill: RpgSkillDef; name: string } | undefined
  /** Engine v19's def for a core (CV12, H128), and its name where it changes, shown while v19 is live. A node keeps it
   * (`skill19`) only where it differs from v16–v18's. */
  core19?: (d: number) => Gen19
  /** Engine v19's def for a line B node (`RPG_BRANCH_B`'s side, depths 3–5; CV12, CV14), before `RPG_LINE_B_POWER_V19`. */
  lineB19?: (d: number) => Gen19
}
/** A generation's def and name for a node. */
interface Gen { skill: RpgSkillDef; name: string }
/** v19's def, and its name where it changes. */
interface Gen19 { skill: RpgSkillDef; name?: string }
/**
 * v16 (H71): a B line's power factor where R1's fight simulation tuned it (CP15: a B line 10–20% ahead of A in its
 * context; ±0.05 a step): from v16 its depth 3–5 nodes play their def × this on every hit's power and a healer's mend and
 * Barrier shares (`rpgRankedSkill`'s scaling), their MP, hits, targets and statuses unchanged. By class and kind; the B
 * line is `RPG_BRANCH_B`'s side. Pierce's own scale is `RPG_PIERCE_SCALE`. v6–v15 never read it.
 */
export const RPG_LINE_B_POWER_V16: Readonly<Partial<Record<RpgClass, Readonly<Partial<Record<RpgWeapon, number>>>>>> = {
  // Measured on the sub-bosses and bosses (her damage a turn there, B ÷ A, Lv 30 · 50; H71): Impale 1.24 · 1.15, Draw
  // 1.24 · 1.21 (and ahead everywhere), the Mage's Pierce 1.30 · 1.19, Spike 0.94 · 1.08.
  brawler: { lance: 0.95, katana: 0.9 },
  mage: { 'tome-dark': 0.9, 'tome-ice': 1.1 },
}
/**
 * v19 (CV14, H128): the B lines' power factor, read from v19 as `RPG_LINE_B_POWER_V16` is v16–v18. The Sorcerer's Pierce
 * moves from her Dark tree to her Light tree with its measured 0.9; the three moved lines (the Brawler's Bow Barrage, the
 * Sorcerer's Light Pierce and Dark Barrage) are the balance's knobs (H131, within 0.85–1.15), the Barrages starting at 1.
 * H131 (D249) measured each alone on B against line A (H71's Target 4 at v19, 32 seeds; her damage a turn B ÷ A on the
 * sub-bosses and bosses, or on the shielded sub-bosses, then elsewhere; Lv 30 · 50). Her Light Pierce 0.9 → 0.85: at 0.875
 * (and 0.9) Auto casts it three times as often as A and it leads everywhere (1.09 · 1.17 in context, 1.10 · 1.10 elsewhere)
 * while the party's sub-boss fights run 0.3–0.5 rounds longer; at the band's floor it ties A (0.96 · 0.99 in context, 1.02 ·
 * 1.02 elsewhere), the closest to both bounds. The Barrages stay 1: the Sorcerer's Dark meets both (1.03 · 1.05 in context,
 * 0.98 · 0.95 elsewhere); the Brawler's Bow ties its volley on the bosses (1.03 · 0.98) and leads elsewhere (1.06 · 1.05), and
 * at 1.05 it still ties on Lv 50's (1.06 · 1.00) and leads further elsewhere (1.08 · 1.07).
 */
export const RPG_LINE_B_POWER_V19: Readonly<Partial<Record<RpgClass, Readonly<Partial<Record<RpgWeapon, number>>>>>> = {
  brawler: { lance: 0.95, katana: 0.9, bow: 1 },
  mage: { 'tome-light': 0.85, 'tome-ice': 1.1, 'tome-dark': 1 },
}
/** A node of three generations: `skill` (v6–v15), `skill16` where v16–v18 play another def, `skill19` where v19 plays
 * another than v16–v18; its name and summary the live generation's. */
function pushNode(base: Omit<RpgNode, 'id' | 'variant' | 'name' | 'skill' | 'summary'>, id: string, variant: RpgNode['variant'], own: Gen,
  v16?: Gen, v19?: Gen19): void {
  const played16 = v16?.skill ?? own.skill
  const skill19 = v19 && !sameDef(v19.skill, played16) ? v19.skill : undefined
  const live16 = LIVE16 && v16 ? v16 : own
  const live = LIVE19 && v19 ? { skill: v19.skill, name: v19.name ?? live16.name } : live16
  NODES.push({ ...base, id, variant, name: live.name, skill: own.skill, ...(v16 ? { skill16: v16.skill } : {}), ...(skill19 ? { skill19 } : {}),
    summary: describe(live.skill) })
}
function addTree(spec: TreeSpec): void {
  const tree = rpgTreeOf(spec.classId, spec.weapon)
  const lineB = RPG_BRANCH_B[spec.classId][spec.weapon]
  for (let d = 1; d <= 5; d += 1) {
    const base = { tree, classId: spec.classId, weapon: spec.weapon, depth: d, cost: d }
    pushNode(base, `${tree}.${d}`, null, { skill: spec.core(d), name: at(spec.names, d) }, undefined, spec.core19?.(d))
    for (const side of ['a', 'b'] as const) {
      const skill = side === 'a' ? spec.sideA(d) : spec.sideB(d)
      const name = at(side === 'a' ? spec.a : spec.b, d)
      const own = side === 'b' ? spec.sideB16?.(d) : undefined
      const onB = side === lineB && d >= 3
      const factor = onB ? RPG_LINE_B_POWER_V16[spec.classId]?.[spec.weapon] ?? 1 : 1
      const v16 = factor === 1 ? own : { skill: rpgRankedSkill(own?.skill ?? skill, factor), name: own?.name ?? name }
      // v19 (H128): line B's own def where the tree's B changes, at v19's factor; else v16's def where the factor moved.
      const factor19 = onB ? RPG_LINE_B_POWER_V19[spec.classId]?.[spec.weapon] ?? 1 : 1
      const own19 = onB ? spec.lineB19?.(d) : undefined
      const v19 = own19 || factor19 !== factor ? { skill: rpgRankedSkill(own19?.skill ?? own?.skill ?? skill, factor19), name: own19?.name } : undefined
      pushNode(base, `${tree}.${d}${side}`, side, { skill, name }, v16, v19)
    }
  }
}

const GH = [1, 1, 2, 2, 3], SH = [2, 2, 4, 4, 6], LH = [2, 2, 3, 3, 4]
const half = (d: number) => Math.max(1, at(SH, d) / 2)
/** A Barrage (the Bow's core to v18; from v19 the Brawler's Bow B and the Sorcerer's Dark B, CV14): one foe, 2 · 2 · 4 · 4 · 6
 * hits at the depth's power, base MP; at depth 5 her kind's own, Armor Break 2 on the Bow, ×1.3 below half HP on Dark. */
const barrage = (d: number, kind: 'bow' | 'dark'): RpgSkillDef => ({ target: 'one', hits: pure(at(SH, d), power(d), kind), mp: mp(d), primary: kind,
  ...(d === 5 ? (kind === 'bow' ? { rider: { status: 'armor-break', stacks: 2, per: 'foe' } } : { special: 'vs-wounded' }) : {}) })
/** v19's line A volley on the Bow and Dark (CV12): 1 · 1 · 2 · 2 · 3 hits on the tapped foe, the splash on the rest; at
 * depth 5, on the tapped foe, Armor Break 2 on the Bow, ×1.3 below half HP on Dark. */
const volleyCore = (d: number, kind: 'bow' | 'dark'): RpgSkillDef => ({ ...volley(at(GH, d), power(d), kind, mp(d)),
  ...(d === 5 ? (kind === 'bow' ? { rider: { status: 'armor-break', stacks: 2, per: 'foe' } } : { special: 'vs-wounded' }) : {}) })
/** v19's double on Light (CV12), the Katana's: one foe, two hits at the depth's power at every depth, ×1.3 on a Broken foe
 * at depth 5. */
const doubleCore = (d: number, kind: 'katana' | 'light'): RpgSkillDef =>
  ({ target: 'one', hits: pure(2, power(d), kind), mp: mp(d), primary: kind, ...(d === 5 ? { special: 'vs-broken' } : {}) })
/** v19's Pierce on the Sorcerer's Light B (CV14), the Brawler's Katana Draw on Light: one hit at `RPG_PIERCE_SCALE` × the
 * depth's power through the unbroken halving, +2 MP. */
const pierce = (d: number, kind: RpgDamageKind): RpgSkillDef =>
  ({ target: 'one', hits: pure(1, RPG_PIERCE_SCALE * power(d), kind), mp: mp(d) + 2, primary: kind, special: 'pierce' })

// --- Brawler: the five Arms at full power -----------------------------------------------------------------------------

const BRAWLER: Readonly<Record<RpgWeaponKind, Omit<TreeSpec, 'classId' | 'weapon'>>> = {
  greatsword: {
    names: ['Heavy Slash', 'Cleave', 'Sunder', 'Rend', 'Meteor Strike'],
    a: ['Crush', 'Bone Crush', 'Rampart Breaker', 'Cataclysm', 'Worldbreaker'],
    b: ['Twin Slash', 'Double Cleave', 'Triple Sunder', 'Rending Combo', 'Meteor Combo'],
    core: (d) => ({ target: 'one', hits: pure(at(GH, d), power(d), 'greatsword'), mp: mp(d), primary: 'greatsword',
      ...(d === 5 ? { rider: { status: 'armor-break', stacks: 2, per: 'foe' } } : {}) }),
    sideA: (d) => ({ target: 'one', hits: pure(1, 1.15 * power(d), 'greatsword'), mp: mp(d) + 2, primary: 'greatsword' }),
    sideB: (d) => ({ target: 'one', hits: pure(at(GH, d) + 1, 0.92 * power(d), 'greatsword'), mp: mp(d), primary: 'greatsword' }),
  },
  axe: {
    names: ['Sweep', 'Whirl', 'Cyclone', 'Quake', 'Maelstrom'],
    a: ['Wide Sweep', 'Twin Whirl', 'Grand Cyclone', 'Aftershock', 'Tempest'],
    b: ['Hewing Sweep', 'Reaping Whirl', "Headsman's Cyclone", 'Guillotine Quake', "Executioner's Storm"],
    core: (d) => ({ target: 'all', hits: pure(at(GH, d), RPG_AOE_SHARE * power(d), 'axe'), mp: mp(d) + 4, primary: 'axe',
      ...(d === 5 ? { rider: { status: 'armor-break', stacks: 1, per: 'foe' } } : {}) }),
    sideA: (d) => ({ target: 'all', hits: pure(at(GH, d) + 1, 0.5 * power(d), 'axe'), mp: mp(d) + 6, primary: 'axe' }),
    sideB: (d) => ({ target: 'all', hits: pure(at(GH, d), 0.45 * power(d), 'axe'), focus: pure(1, 0.5 * power(d), 'axe'), mp: mp(d) + 6, primary: 'axe' }),
  },
  lance: {
    names: ['Thrust Flurry', 'Lance Barrage', 'Spiral Barrage', 'Dragon Dive', "Heaven's Rain"],
    a: ['Piercing Thrust', 'Impaler', 'Skewer', 'Dragon Fang', 'Gungnir'],
    b: ['Scatter Thrust', 'Wild Barrage', 'Storm of Spears', 'Dragon Swarm', 'Thousand Spears'],
    core: (d) => ({ target: 'random', hits: pure(at(SH, d), RPG_RANDOM_BONUS * power(d), 'lance'), mp: mp(d), primary: 'lance',
      ...(d === 5 ? { rider: { status: 'armor-break', stacks: 1, per: 'foe' } } : {}) }),
    sideA: (d) => ({ target: 'one', hits: pure(half(d), 1.15 * power(d), 'lance'), mp: mp(d) + 2, primary: 'lance' }),
    sideB: (d) => ({ target: 'random', hits: [...pure(at(SH, d), RPG_RANDOM_BONUS * power(d), 'lance'), ...pure(2, 0.3 * power(d), 'lance')],
      mp: mp(d) + 4, primary: 'lance' }),
  },
  bow: {
    names: ['Twin Arrows', 'Triple Shot', 'Quiver Volley', 'Arrow Storm', 'Starfall Barrage'],
    a: ['Power Shot', 'Piercing Arrow', 'Ballista Shot', 'Comet Arrow', 'Sunpiercer'],
    b: ['Spread Shot', 'Scatter Volley', 'Rain of Arrows', 'Arrow Hail', 'Starfall Rain'],
    core: (d) => barrage(d, 'bow'),
    sideA: (d) => ({ target: 'one', hits: pure(half(d), 1.15 * power(d), 'bow'), mp: mp(d) + 2, primary: 'bow' }),
    sideB: (d) => ({ target: 'one', hits: pure(at(SH, d), power(d), 'bow'), splash: pure(1, 0.2 * power(d), 'bow')[0], mp: mp(d) + 4, primary: 'bow' }),
    // v19 (CV12, CV14): line A a volley, its capstone Starfall Volley; line B Barrage, the old core (was Rain).
    core19: (d) => ({ skill: volleyCore(d, 'bow'), ...(d === 5 ? { name: 'Starfall Volley' } : {}) }),
    lineB19: (d) => ({ skill: barrage(d, 'bow'), name: at(['', '', 'Quiver Barrage', 'Storm Barrage', 'Starfall Barrage'], d) }),
  },
  katana: {
    names: ['Double Slash', 'Crossing Cut', 'Twin Moon', 'Iai Storm', 'Moonfall'],
    a: ['Quick Draw', 'Iaido', 'Flash Draw', 'Moonlit Draw', 'Final Draw'],
    b: ['Cross Cut', 'X-Slash', 'Twin Cross', 'Scattering Petals', 'Thousand Petals'],
    core: (d) => ({ target: 'one', hits: pure(2, power(d), 'katana'), mp: mp(d), primary: 'katana', ...(d === 5 ? { special: 'vs-broken' } : {}) }),
    sideA: (d) => ({ target: 'one', hits: pure(1, 1.15 * power(d), 'katana'), mp: mp(d) + 2, primary: 'katana', special: 'pierce' }),
    sideB: (d) => ({ target: 'one', hits: pure(2, 0.7 * power(d), 'katana'), other: pure(2, 0.42 * power(d), 'katana'), mp: mp(d) + 4, primary: 'katana' }),
  },
}
for (const weapon of RPG_WEAPON_KINDS) addTree({ classId: 'brawler', weapon, ...BRAWLER[weapon] })

// --- Mage: the five Tomes at full power --------------------------------------------------------------------------------

const series = (stem: string[], tail: string) => stem.map((s) => `${s} ${tail}`)
const MAGE: Readonly<Record<string, Omit<TreeSpec, 'classId' | 'weapon'>>> = {
  'tome-fire': {
    names: ['Fire', 'Fira', 'Firaga', 'Firaja', 'Flare Star'],
    a: series(['Fire', 'Fira', 'Firaga', 'Firaja', 'Flare'], 'Wave'), b: series(['Fire', 'Fira', 'Firaga', 'Firaja', 'Flare'], 'Chain'),
    core: (d) => ({ target: 'one', hits: pure(1, power(d), 'fire'), mp: mp(d), primary: 'fire',
      ...(d === 5 ? { rider: { status: 'burn', stacks: 2, per: 'foe' } } : {}) }),
    sideA: (d) => ({ target: 'all', hits: pure(1, RPG_AOE_SHARE * power(d), 'fire'), mp: mp(d) + 4, primary: 'fire' }),
    sideB: (d) => ({ target: 'random', hits: pure(at(LH, d), RPG_RANDOM_BONUS * power(d), 'fire'), mp: mp(d), primary: 'fire' }),
  },
  'tome-ice': {
    names: ['Blizzard', 'Blizzara', 'Blizzaga', 'Blizzaja', 'Absolute Zero'],
    a: series(['Blizzard', 'Blizzara', 'Blizzaga', 'Blizzaja', 'Zero'], 'Spike'), b: series(['Blizzard', 'Blizzara', 'Blizzaga', 'Blizzaja', 'Zero'], 'Shards'),
    core: (d) => d < 5 ? { target: 'all', hits: pure(1, RPG_AOE_SHARE * power(d), 'ice'), mp: mp(d) + 4, primary: 'ice' }
      : { target: 'all', hits: pure(2, RPG_AOE_SHARE * power(5), 'ice'), mp: mp(5) + 4, primary: 'ice', rider: { status: 'enfeeble', stacks: 1, per: 'foe' } },
    sideA: (d) => ({ target: 'one', hits: pure(1, power(d), 'ice'), mp: mp(d), primary: 'ice' }),
    sideB: (d) => ({ target: 'random', hits: pure(at(LH, d), RPG_RANDOM_BONUS * power(d), 'ice'), mp: mp(d), primary: 'ice' }),
  },
  'tome-lightning': {
    names: ['Thunder', 'Thundara', 'Thundaga', 'Thundaja', 'Judgment Storm'],
    a: ['Thunder Bolt', 'Thundara Bolt', 'Thundaga Bolt', 'Thundaja Bolt', 'Judgment Bolt'],
    b: ['Thunder Squall', 'Thundara Storm', 'Thundaga Storm', 'Thundaja Storm', 'Judgment Tempest'],
    core: (d) => ({ target: 'random', hits: pure(at(LH, d), RPG_RANDOM_BONUS * power(d), 'lightning'), mp: mp(d), primary: 'lightning',
      ...(d === 5 ? { rider: { status: 'shock', stacks: 1, per: 'hit' } } : {}) }),
    sideA: (d) => ({ target: 'one', hits: pure(1, power(d), 'lightning'), mp: mp(d), primary: 'lightning' }),
    sideB: (d) => ({ target: 'all', hits: pure(1, RPG_AOE_SHARE * power(d), 'lightning'), mp: mp(d) + 4, primary: 'lightning' }),
  },
  'tome-light': {
    names: ['Lux', 'Luxra', 'Luxaga', 'Luxaja', 'Holy'],
    a: ['Lux Lance', 'Luxra Lance', 'Luxaga Lance', 'Luxaja Lance', 'Holy Lance'],
    b: ['Lux Cascade', 'Luxra Cascade', 'Luxaga Cascade', 'Luxaja Cascade', 'Holy Cascade'],
    core: (d) => ({ target: 'one', hits: pure(at(SH, d), power(d), 'light'), mp: mp(d), primary: 'light', ...(d === 5 ? { special: 'vs-broken' } : {}) }),
    sideA: (d) => ({ target: 'one', hits: pure(half(d), 1.15 * power(d), 'light'), mp: mp(d) + 2, primary: 'light' }),
    sideB: (d) => ({ target: 'all', hits: pure(2, 0.5 * power(d), 'light'), mp: mp(d) + 6, primary: 'light' }),
    // v19 (CV12, CV14): a double, the Katana's twin; line B Pierce (was Cascade), the Brawler's Draw on Light.
    core19: (d) => ({ skill: doubleCore(d, 'light') }),
    lineB19: (d) => ({ skill: pierce(d, 'light'), name: at(['', '', 'Luxaga Pierce', 'Luxaja Pierce', 'Holy Pierce'], d) }),
  },
  'tome-dark': {
    names: ['Nox', 'Noxra', 'Noxaga', 'Noxaja', 'Black Hole'],
    a: ['Nox Pierce', 'Noxra Pierce', 'Noxaga Pierce', 'Noxaja Pierce', 'Void Pierce'],
    b: ['Nox Cascade', 'Noxra Cascade', 'Noxaga Cascade', 'Noxaja Cascade', 'Void Cascade'],
    core: (d) => ({ target: 'one', hits: pure(2, power(d), 'dark'), mp: mp(d), primary: 'dark', ...(d === 5 ? { special: 'vs-wounded' } : {}) }),
    sideA: (d) => ({ target: 'one', hits: pure(1, 1.15 * power(d), 'dark'), mp: mp(d) + 2, primary: 'dark', special: 'pierce' }),
    sideB: (d) => ({ target: 'all', hits: pure(2, 0.5 * power(d), 'dark'), mp: mp(d) + 6, primary: 'dark' }),
    // v19 (CV12, CV14): a volley, the Bow's twin; line B (her `a`) Barrage (was Pierce).
    core19: (d) => ({ skill: volleyCore(d, 'dark') }),
    lineB19: (d) => ({ skill: barrage(d, 'dark'), name: at(['', '', 'Noxaga Barrage', 'Noxaja Barrage', 'Void Barrage'], d) }),
  },
}
for (const weapon of RPG_TOMES) addTree({ classId: 'mage', weapon, ...MAGE[weapon]! })

// --- Summoner: one summon per weapon, growing every depth, lingering after (D86) ---------------------------------------

const LINGER = 0.3
/** Each summon line's job (D141): Fire, Lightning, Bow and Katana strike; Light mends, Ice shields, Dark drains, the
 * Greatsword's knights guard (Aegis), the Axe's brutes intimidate (Enfeeble) and the Lance's Valkyries raise the fallen. */
const SUMMONS: Readonly<Record<RpgWeapon, readonly string[]>> = {
  'tome-fire': ['Ember Sprites', 'Salamander', 'Fire Drake', 'Infernal Wyrm', 'Phoenix'],
  'tome-ice': ['Frost Sprites', 'Snow Sentinel', 'Ice Golem', 'Frost Titan', 'Winter Queen'],
  'tome-lightning': ['Spark Sprites', 'Thunderbird', 'Storm Roc', 'Thunder Kirin', 'Raijin'],
  'tome-light': ['Cherub', 'Mending Angel', 'Seraph Choir', 'Dominion Host', "Heaven's Legion"],
  'tome-dark': ['Leech Imp', 'Night Bat', 'Vampire Knight', 'Blood Countess', 'Abyssal Overlord'],
  // From v15 "Paladin" is a class, so her depth-3 knight is the Knight Captain (tier2-classes §5.7, D183): the live
  // generation's name, as names are presentation; the id stays `summoner-greatsword.3`.
  greatsword: ['Squire', 'Shield Knight', rpgV2() ? 'Knight Captain' : 'Paladin', 'Aegis Champion', 'Sword Saint'],
  // From v16 the depth-2 and depth-5 brutes are the Marauder and the Jotun King (CP21: "Berserker" and "Warlord" name the
  // Brawler's Tier 2 class branches), live names on the same ids, as the Knight Captain's; their sides follow.
  axe: ['Brigand', LIVE16 ? 'Marauder' : 'Berserker', 'Axe Ogre', 'Minotaur Chief', LIVE16 ? 'Jotun King' : 'Jotun Warlord'],
  lance: ['Pikeman', 'Dragoon', 'Lance Knight', 'Valkyrie', 'Valkyrie Queen'],
  bow: ['Slinger', 'Archer', 'Ranger', 'Sylph Archer', 'Sagittarius'],
  katana: ['Ronin', 'Samurai', 'Kensei', 'Blade Shogun', 'Sword Spirit'],
}
/** A summon line's support (D141), by depth, on every Uma: Light mends at half a Cleric's share, Ice shields at 35%. */
function summonSupport(kind: RpgDamageKind, d: number): RpgSupport | undefined {
  const share = (k: number) => Math.round(k * at(RPG_SUPPORT_SHARE, d) * 1000) / 1000
  switch (kind) {
    case 'light': return { share: share(0.5), mend: 'all' }
    case 'ice': return { share: share(0.35), shield: 'all' }
    case 'dark': return { share: 0, drain: 0.3 }
    case 'greatsword': return { share: 0, bless: { status: 'aegis', stacks: d === 5 ? 2 : 1 } }
    case 'axe': return { share: 0, curse: { status: 'enfeeble', stacks: d === 5 ? 2 : 1 } }
    case 'lance': return d >= 4 ? { share: 0, revive: true } : undefined
    default: return undefined
  }
}
/** A summon by its kind's shape, `extra` hits more and `scale` times the power, with its depth-5 capstone. `v19` (CV12, H128):
 * the weapon shapes, the Bow's and Dark's summons volleys (the extra hit on the tapped foe, never the splash; the capstone
 * on her) and Light's a double. */
function summon(weapon: RpgWeapon, d: number, extra = 0, scale = 1, v19 = false): RpgSkillDef {
  const kind = rpgWeaponKind(weapon)
  const p = scale * power(d)
  const capstone = d === 5
  const support = summonSupport(kind, d)
  const base: Omit<RpgSkillDef, 'target' | 'hits'> = { mp: mp(d), primary: kind, summon: { linger: LINGER }, ...(support ? { support } : {}) }
  if (v19 && (kind === 'bow' || kind === 'dark')) {
    const { hits, splash, mp: cost } = volley(at(GH, d) + extra, p, kind, mp(d))
    return { ...base, target: 'one', hits, splash, mp: cost,
      ...(capstone ? { rider: { status: kind === 'bow' ? 'armor-break' : 'enfeeble', stacks: 2, per: 'foe' } } : {}) }
  }
  if (v19 && kind === 'light') {
    return { ...base, target: 'one', hits: pure(2 + extra, p, kind), ...(capstone ? { allies: { status: 'barrier', stacks: 1 } } : {}) }
  }
  switch (kind) {
    case 'fire': case 'greatsword':
      return { ...base, target: 'one', hits: pure(at(GH, d) + extra, p, kind),
        ...(capstone ? { rider: { status: kind === 'fire' ? 'burn' : 'armor-break', stacks: 2, per: 'foe' } } : {}) }
    case 'ice': case 'axe':
      return { ...base, target: 'all', hits: pure((kind === 'ice' ? [1, 2, 2, 3, 3] : GH)[d - 1]! + extra, RPG_AOE_SHARE * p, kind), mp: mp(d) + 4,
        ...(capstone ? { rider: { status: kind === 'ice' ? 'enfeeble' : 'armor-break', stacks: 1, per: 'foe' } } : {}) }
    case 'lightning': case 'lance':
      return { ...base, target: 'random', hits: pure(at(LH, d) + extra, RPG_RANDOM_BONUS * p, kind),
        ...(capstone ? { rider: { status: kind === 'lightning' ? 'shock' : 'armor-break', stacks: 1, per: 'hit' } } : {}) }
    case 'light': case 'bow':
      return { ...base, target: 'one', hits: pure(at(LH, d) + extra, p, kind),
        ...(capstone ? (kind === 'light' ? { allies: { status: 'barrier', stacks: 1 } } : { rider: { status: 'armor-break', stacks: 2, per: 'foe' } }) : {}) }
    default:
      return { ...base, target: 'one', hits: pure(2 + extra, p, kind),
        ...(capstone ? (kind === 'dark' ? { rider: { status: 'enfeeble', stacks: 2, per: 'foe' } } : { special: 'vs-broken' }) : {}) }
  }
}
/** Bonded: the summon lingers at 0.4, for 2 MP more. */
const bonded = (def: RpgSkillDef): RpgSkillDef => plus(def, { summon: { linger: 0.4 }, mp: def.mp + 2 })
for (const weapon of RPG_WEAPONS) {
  const names = SUMMONS[weapon]
  // v19 (CV12): her Bow and Dark summons volley, her Light summons double, on her core and her line B (Pack on her Arms,
  // Bonded on her Tomes); a node keeps v19's def only where it differs.
  addTree({ classId: 'summoner', weapon, names, a: names.map((n) => `${n} Pack`), b: names.map((n) => `Bonded ${n}`),
    core: (d) => summon(weapon, d),
    sideA: (d) => summon(weapon, d, 1, 0.95),
    sideB: (d) => bonded(summon(weapon, d)),
    core19: (d) => ({ skill: summon(weapon, d, 0, 1, true) }),
    lineB19: (d) => ({ skill: isRpgTome(weapon) ? bonded(summon(weapon, d, 0, 1, true)) : summon(weapon, d, 1, 0.95, true) }) })
}

// --- Spell Blade: single-target halves, an Arm and a Tome every act (D86) ----------------------------------------------

const BLADE_HITS: Readonly<Record<RpgDamageKind, readonly number[]>> = {
  greatsword: [1, 1, 1, 2, 2], fire: [1, 1, 1, 2, 2], axe: [1, 1, 2, 2, 2], ice: [1, 1, 2, 2, 2],
  lance: [2, 2, 2, 3, 3], lightning: [2, 2, 2, 3, 3], bow: [2, 2, 3, 3, 4], light: [2, 2, 3, 3, 4], katana: [2, 2, 2, 2, 2], dark: [2, 2, 2, 2, 2],
}
/** v19 (CV12, §4.2; H128): the twins re-paired, so Light lands the Katana's 2 hits and Dark the Bow's 2 · 2 · 3 · 3 · 4. */
const BLADE_HITS_V19: Readonly<Record<RpgDamageKind, readonly number[]>> = { ...BLADE_HITS, light: BLADE_HITS.katana, dark: BLADE_HITS.bow }
const BLADE_NOUN: Readonly<Record<RpgDamageKind, string>> = {
  greatsword: 'Cleave', axe: 'Hew', lance: 'Thrust', bow: 'Shot', katana: 'Draw', fire: 'Brand', ice: 'Rime', lightning: 'Bolt', light: 'Ray', dark: 'Shade',
}
const TIERS = ['Rune', 'Arcane', 'Mystic', 'Astral', 'Celestial']
function bladeCapstone(kind: RpgDamageKind): Partial<RpgSkillDef> {
  if (kind === 'katana' || kind === 'light') return { special: 'vs-broken' }
  if (kind === 'dark') return { special: 'vs-wounded' }
  const status: RpgStatusKind = kind === 'fire' ? 'burn' : kind === 'ice' ? 'enfeeble' : kind === 'lightning' ? 'shock' : 'armor-break'
  return { rider: { status, stacks: 1, per: 'foe' } }
}
for (const weapon of RPG_WEAPONS) {
  const kind = rpgWeaponKind(weapon)
  const names = TIERS.map((t) => `${t} ${BLADE_NOUN[kind]}`)
  const one = (d: number, n: number, scale: number, extraMp = 0): RpgSkillDef =>
    ({ target: 'one', hits: pure(n, scale * power(d), kind), mp: mp(d) + extraMp, primary: kind })
  addTree({ classId: 'spellblade', weapon, names, a: names.map((n) => `Focused ${n}`), b: names.map((n) => `${n} Flurry`),
    core: (d) => ({ ...one(d, at(BLADE_HITS[kind], d), 1), ...(d === 5 ? bladeCapstone(kind) : {}) }),
    core19: (d) => ({ skill: { ...one(d, at(BLADE_HITS_V19[kind], d), 1), ...(d === 5 ? bladeCapstone(kind) : {}) } }),
    sideA: (d) => one(d, Math.max(1, at(BLADE_HITS[kind], d) - 1), 1.1, 2),
    sideB: (d) => one(d, at(BLADE_HITS[kind], d) + 1, 0.95, 2),
    sideB16: (d) => (d >= 3 ? { skill: { ...one(d, 1, RPG_PIERCE_SCALE, 2), special: 'pierce' }, name: `Piercing ${at(names, d)}` } : undefined) })
}

// --- Cleric: a blow that weakens, a spell that blesses (D86) -----------------------------------------------------------

/** Each Arm's debuff and its mirror Tome's buff. */
export const RPG_CLERIC_STATUS: Readonly<Record<RpgWeapon, RpgStatusKey>> = {
  greatsword: 'armor-break', 'tome-fire': 'brave', lance: 'mind-break', 'tome-light': 'faith', axe: 'enfeeble', 'tome-ice': 'aegis',
  bow: 'shatter', 'tome-lightning': 'breaker', katana: 'hex', 'tome-dark': 'clarity',
}
const CLERIC_NAMES: Readonly<Record<RpgWeapon, readonly string[]>> = {
  greatsword: ['Breach', 'Sunder Armor', 'Rupture', 'Ravage', 'Ruin'],
  lance: ['Pierce Mind', 'Puncture', 'Impale', 'Transfix', 'Mindspike'],
  axe: ['Hack', 'Hamstring', 'Maim', 'Cripple', 'Unmake'],
  bow: ['Chip', 'Crack', 'Fracture', 'Splinter', 'Shatterstorm'],
  katana: ['Mark', 'Curse', 'Hex', 'Doom', 'Anathema'],
  'tome-fire': ['Valor', 'Courage', 'Bravery', 'Heroism', 'Exaltation'],
  'tome-light': ['Grace', 'Faith', 'Devotion', 'Piety', 'Benediction'],
  'tome-ice': ['Ward', 'Guard', 'Bulwark', 'Fortress', 'Sanctum'],
  'tome-lightning': ['Spark', 'Charge', 'Surge', 'Overcharge', 'Breakstorm'],
  'tome-dark': ['Calm', 'Focus', 'Clarity', 'Insight', 'Enlightenment'],
}
const CLERIC_STACKS = [1, 1, 2, 2, 3]
/** Her spells mend and cleanse, her blows put up a Barrier (D141): on the one who needs it, on everyone at depth 5. The
 * Light tree's depth-3 side B is Rebirth: it also raises the fallen. `shares`: v12–v14's, or v15's doubled ones. */
function clericSupport(weapon: RpgWeapon, d: number, revive = false, shares: readonly number[] = RPG_SUPPORT_SHARE): RpgSupport {
  const sup: RpgSupport = isRpgTome(weapon) ? { share: at(shares, d), mend: d === 5 ? 'all' : 'hurt', cleanse: true }
    : { share: at(shares, d), shield: d === 5 ? 'all' : 'threatened' }
  if (revive) sup.revive = true
  return sup
}
/** v15 (classes v2 §4): the Paladin's Blizzard spells also shield every Uma at this share of their share (H60, D186: 0.5,
 * was 0.35), and her Greatsword blows give each Uma they shield Aegis this many stacks at every depth (H60: 1, was 2 at
 * depth 5). Healing and Barriers per round then sit within 10% of the Cleric's. */
export const RPG_PALADIN_SHIELD_SHARE = 0.5
export const RPG_PALADIN_AEGIS = 1
/** v15 (classes v2 §3.3, §4): both healers' kit at the doubled shares, and each one's half of the Summoner's old support.
 * The Paladin's Blizzard spells also shield every Uma (`RPG_PALADIN_SHIELD_SHARE` of their share), and her Greatsword
 * blows give Aegis to each Uma they shield (`RPG_PALADIN_AEGIS`); the Cleric's Light spells leave Regen and her Dark
 * spells drain 30%. `revive`: the Cleric's Rebirth, or the Paladin's Valkyrie's Oath. */
function healerSupport(weapon: RpgWeapon, d: number, revive: boolean, paladin: boolean): RpgSupport {
  const sup = clericSupport(weapon, d, revive, RPG_SUPPORT_SHARE_V15)
  if (paladin && weapon === 'tome-ice') Object.assign(sup, { shield: 'all', shieldShare: round(RPG_PALADIN_SHIELD_SHARE * sup.share) })
  if (paladin && weapon === 'greatsword') sup.aegis = RPG_PALADIN_AEGIS
  if (!paladin && weapon === 'tome-light') sup.regen = true
  if (!paladin && weapon === 'tome-dark') sup.drain = 0.3
  return sup
}
/** A Cleric's skill, or with `paladin` the Paladin's (D179): the same hits, status, stacks, turns and MP, her Axe's status
 * on every foe from depth 4, and no `support` (v12–v14's field: the Paladin has only v15's, `support15`). */
function cleric(weapon: RpgWeapon, d: number, turns = 2, more = 0, extraMp = 0, revive = false, paladin = false): RpgSkillDef {
  const kind = rpgWeaponKind(weapon)
  const to = isRpgTome(weapon) ? 'allies' : d === 5 || (paladin && weapon === 'axe' && d >= 4) ? 'foes' : 'foe'
  return { target: 'one', hits: pure(1, power(d), kind), mp: mp(d) + extraMp, primary: kind,
    status: { key: RPG_CLERIC_STATUS[weapon], stacks: at(CLERIC_STACKS, d) + more, turns, to },
    ...(paladin ? {} : { support: clericSupport(weapon, d, revive) }), support15: healerSupport(weapon, d, revive, paladin) }
}
/** The one side skill that isn't Lasting or Heavy: the Light tree's depth-3 B, Rebirth (D141). */
export const RPG_REBIRTH_NODE = 'cleric-tome-light.3b'
for (const weapon of RPG_WEAPONS) {
  const names = CLERIC_NAMES[weapon]
  const b = names.map((n, i) => (weapon === 'tome-light' && i === 2 ? 'Rebirth' : `Heavy ${n}`))
  addTree({ classId: 'cleric', weapon, names, a: names.map((n) => `Lasting ${n}`), b,
    core: (d) => cleric(weapon, d), sideA: (d) => cleric(weapon, d, 3, 0, 2),
    sideB: (d) => cleric(weapon, d, 2, 1, 4, weapon === 'tome-light' && d === 3) })
}

// --- Paladin (classes v2, engine v15, D179): the Cleric's kit and names, her other half ---------------------------------

/** The Paladin's one side skill not named Lasting or Heavy, Valkyrie's Oath: in the Heavy shape, whose support also
 * revives (§4). To v15 it is her Lance tree's depth-4 B, her Light 3B Heavy Devotion, since Rebirth stays the Cleric's;
 * from v16 (CP37) it moves to her Light tree's depth-3 B, on her default Light Tome where the Cleric's Rebirth sits, and
 * her Lance 4B is Heavy Transfix. Ids stay. */
export const rpgValkyrieOathNode = (engine: number = BATTLE_ENGINE_VERSION): string =>
  (rpgRework('fight', engine) ? 'paladin-tome-light.3b' : 'paladin-lance.4b')
for (const weapon of RPG_WEAPONS) {
  const names = CLERIC_NAMES[weapon]
  const b = names.map((n, i) => (weapon === 'lance' && i === 3 ? "Valkyrie's Oath" : `Heavy ${n}`))
  const moves = (d: number) => (weapon === 'tome-light' && d === 3) || (weapon === 'lance' && d === 4)
  addTree({ classId: 'paladin', weapon, names, a: names.map((n) => `Lasting ${n}`), b,
    core: (d) => cleric(weapon, d, 2, 0, 0, false, true), sideA: (d) => cleric(weapon, d, 3, 0, 2, false, true),
    sideB: (d) => cleric(weapon, d, 2, 1, 4, weapon === 'lance' && d === 4, true),
    sideB16: (d) => (moves(d) ? { skill: cleric(weapon, d, 2, 1, 4, weapon === 'tome-light', true),
      name: weapon === 'tome-light' ? "Valkyrie's Oath" : `Heavy ${at(names, d)}` } : undefined) })
}

// --- Classes v3's new trees (engine v19, CV6, CV17; H126) ---------------------------------------------------------------

/** A tree of the lines only (the two new hybrids: no older generation, so no unused side node): depths 1–2 the trunk's
 * cores, 3–5 line A's cores and line B's side (`RPG_BRANCH_B`'s letter), eight nodes. Their `skill` is v19's def, in v19's
 * weapon shapes (H128). */
interface LineTreeSpec {
  classId: RpgClass
  weapon: RpgWeapon
  names: readonly string[]
  b: readonly string[]
  core: (d: number) => RpgSkillDef
  lineB: (d: number) => RpgSkillDef
}
function addLineTree(spec: LineTreeSpec): void {
  const tree = rpgTreeOf(spec.classId, spec.weapon)
  const letter = RPG_BRANCH_B[spec.classId][spec.weapon]!
  for (let d = 1; d <= 5; d += 1) {
    const base = { tree, classId: spec.classId, weapon: spec.weapon, depth: d, cost: d }
    const core = spec.core(d)
    NODES.push({ ...base, id: `${tree}.${d}`, variant: null, name: at(spec.names, d), skill: core, summary: describe(core) })
  }
  for (let d = 3; d <= 5; d += 1) {
    const skill = spec.lineB(d)
    NODES.push({ tree, classId: spec.classId, weapon: spec.weapon, depth: d, cost: d, id: `${tree}.${d}${letter}`, variant: letter,
      name: at(spec.b, d), skill, summary: describe(skill) })
  }
}

/** The Tome Spellblade's names (CV17): a blade word for each depth, and a spell word for each element on her Tome trees
 * (the Spell Blade's blade nouns on her Arms trees). None matches a master-data string. */
export const RPG_TOMEBLADE_DEPTHS = ['Edged', 'Honed', 'Whetted', 'Gleaming', 'Sovereign'] as const
export const RPG_TOMEBLADE_SPELLS: Readonly<Record<RpgElement, string>> = { fire: 'Pyre', ice: 'Frost', lightning: 'Volt', light: 'Lumen', dark: 'Umbra' }
// The Tome Spellblade (CV15, CV17): the Spell Blade's rule at v19 (one foe, hits by kind as `BLADE_HITS_V19`, the same depth
// riders; H128), her own names; line B Pierce on every tree (one hit at `RPG_PIERCE_SCALE` × the depth's power, +2 MP,
// through the unbroken halving).
for (const weapon of RPG_WEAPONS) {
  const kind = rpgWeaponKind(weapon)
  const word = isRpgTome(weapon) ? RPG_TOMEBLADE_SPELLS[kind as RpgElement] : BLADE_NOUN[kind]
  const names = RPG_TOMEBLADE_DEPTHS.map((t) => `${t} ${word}`)
  const one = (d: number, n: number, scale: number, extraMp = 0): RpgSkillDef =>
    ({ target: 'one', hits: pure(n, scale * power(d), kind), mp: mp(d) + extraMp, primary: kind })
  addLineTree({ classId: 'tomeblade', weapon, names, b: names.map((n) => `Piercing ${n}`),
    core: (d) => ({ ...one(d, at(BLADE_HITS_V19[kind], d), 1), ...(d === 5 ? bladeCapstone(kind) : {}) }),
    lineB: (d) => ({ ...one(d, 1, RPG_PIERCE_SCALE, 2), special: 'pierce' }) })
}
// The Arms Summoner (CV15, CV17): the Summoner's summons and riders on every kind in v19's shapes (H128), her lines
// mirrored: Bonded on her Arms trees (the lingering summon at 0.4, +2 MP), Pack on her Tome trees (one more hit at ×0.95).
for (const weapon of RPG_WEAPONS) {
  const names = SUMMONS[weapon]
  const tome = isRpgTome(weapon)
  addLineTree({ classId: 'armsummoner', weapon, names, b: names.map((n) => (tome ? `${n} Pack` : `Bonded ${n}`)),
    core: (d) => summon(weapon, d, 0, 1, true),
    lineB: (d) => (tome ? summon(weapon, d, 1, 0.95, true) : bonded(summon(weapon, d, 0, 1, true))) })
}

/** A Tier 0 tree (CV6): her class's one skill on one weapon, its one node at depth 1. One foe, one hit of the weapon's kind
 * at power 1 (the fight scales it to her Class Rank's power, `rpgSkillFactor`), 10 MP; no rider, special, status or
 * support. Named by the skill alone: a screen adds the weapon. */
function addTier0Tree(classId: RpgTier0Class, weapon: RpgWeapon): void {
  const tree = rpgTreeOf(classId, weapon)
  const kind = rpgWeaponKind(weapon)
  const skill: RpgSkillDef = { target: 'one', hits: [{ power: 1, parts: [{ kind, share: 1 }] }], mp: RPG_TIER0_MP, primary: kind }
  NODES.push({ id: `${tree}.1`, tree, classId, weapon, depth: 1, variant: null, name: RPG_TIER0_SKILL[classId], cost: 1, skill, summary: describe(skill) })
}
for (const classId of RPG_TIER0_CLASSES) for (const weapon of RPG_WEAPONS) addTier0Tree(classId, weapon)

/** Every node of every generation (960: 750 to v18, D179; Classes v3's 210 from v19, H126): `rpgNode` finds any of them. */
export const RPG_ALL_NODES: readonly RpgNode[] = NODES
/** The live generation's nodes: the five classes' 600 until the switch (H61), all 750 after; 960 from H134. */
export const RPG_NODES: readonly RpgNode[] = NODES.filter((n) => RPG_CLASSES.includes(n.classId))
const BY_ID = new Map(NODES.map((n) => [n.id, n]))
export const rpgNode = (id: string): RpgNode | undefined => BY_ID.get(id)
export const rpgTreeNodes = (tree: RpgTreeId): RpgNode[] => NODES.filter((n) => n.tree === tree)
/** The def a node plays in a fight of an engine's version (H65, H128): from v19 its `skill19` where it has one, then from
 * v16 its `skill16`, else `skill`. The engine, Limit Breaks, Auto and a summon's farewell read nodes through this, with the
 * fight's version. */
export const rpgNodeSkill = (node: RpgNode, version: number): RpgSkillDef =>
  (rpgRework('classes', version) && node.skill19 ? node.skill19
    : rpgRework('fight', version) && node.skill16 ? node.skill16 : node.skill)
/** A skill at a Skill Rank's multiplier (v16, CP32): every hit's power (`hits`, `focus`, `splash`, `other`) and its
 * support's mend and Barrier shares (`support15`'s `share` and `shieldShare`) × `factor`. Its MP, hit count, targets,
 * riders, statuses, drain and revive stay. */
export function rpgRankedSkill(def: RpgSkillDef, factor: number): RpgSkillDef {
  if (factor === 1) return def
  const scale = (hit: RpgHit): RpgHit => ({ ...hit, power: hit.power * factor })
  const sup = def.support15
  return { ...def, hits: def.hits.map(scale), ...(def.focus ? { focus: def.focus.map(scale) } : {}), ...(def.splash ? { splash: scale(def.splash) } : {}),
    ...(def.other ? { other: def.other.map(scale) } : {}),
    ...(sup ? { support15: { ...sup, share: sup.share * factor, ...(sup.shieldShare !== undefined ? { shieldShare: sup.shieldShare * factor } : {}) } } : {}) }
}
