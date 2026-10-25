// An Uma's battle profile: class, weapons, stats, EXP and skill trees (D86, docs/design/class-rework.md). Every class
// wields five weapons to v15, three from v16 (the Tier rework's fight), and has a tree per weapon; its Class Rank opens
// the depths and pays the points for side skills (D102), her Uma Level her stats and skill slots, and a hand per class
// scales power and MP.
// Class rules answer by generation (D179): classes v1 to engine v14, classes v2 (docs/design/classes-v2.md) from v15, and
// from v16 the Tier rework's fight (D200, docs/design/tier-rework/class-progression.md §3), a third row where it differs.
// Each takes `engine`, defaulting to the live BATTLE_ENGINE_VERSION (`battle/caps.ts`, the one switch), so the game
// follows the switch; the engine always passes the fight's own version. The `RPG_CLASS_*` tables are the live
// generation's.
import { STATS, type Stats } from '@luismlorenzana/uma-data'
import { BATTLE_ENGINE_VERSION, rpgRework, rpgV2 } from './battle/caps'
import { rpgClassWeapons, rpgNodeIdentity as rpgNode, rpgSideNodeLevel, rpgTreeOf, type RpgNodeIdentity as RpgNode } from './node-identity'
import {
  isRpgTome, isRpgWeapon, RPG_TOMES, RPG_WEAPON_KINDS, RPG_WEAPONS, type RpgClass, type RpgTreeId, type RpgWeapon,
} from './kinds'

export * from './kinds'
export { rpgClassWeapons } from './node-identity'

export const RPG_TIER_MAX_LEVEL = 50
/** Points buy side skills only (D86): one a Class Rank, per class (D102). Core skills cost nothing. */
export const RPG_SIDE_POINTS_PER_LEVEL = 1
/** Class Ranks that open depths 1–5 (D102; Uma levels before). */
export const RPG_DEPTH_GATES = [1, 10, 20, 30, 40] as const
/** Three skill slots at Lv1, one more at each gate: ten by Lv40. */
export const RPG_BASE_ACTIVE_SLOTS = 3
export const RPG_ACTIVE_SLOT_GATES = [10, 15, 20, 25, 30, 35, 40] as const
export const RPG_MAX_ACTIVE_SLOTS = RPG_BASE_ACTIVE_SLOTS + RPG_ACTIVE_SLOT_GATES.length
/** Skills carried from an earlier tier (S8); the engine still checks the cap. */
export const RPG_MAX_LEGACY_SLOTS = 2
/** Side skills one class may hold: one per depth in each of ten trees. */
export const RPG_MAX_TREE_NODES = 50
/** The weapons every class wields in an engine's generation: five to v15 (D86), three from v16 (CP2, D200). */
export const rpgWeaponSlots = (engine: number = BATTLE_ENGINE_VERSION): number => (rpgRework('fight', engine) ? 3 : 5)
/** The live generation's weapon slots: five until H72 turns on the Tier rework's fight. */
export const RPG_WEAPON_SLOTS = rpgWeaponSlots()

/** A learned node of one tier. */
export interface RpgNodeRef { tier: number; id: string }
export interface RpgProfile {
  outfitId: string
  /** The outfit's base stats at its starting stars, and growth rates as fractions (0.1 = +10%). */
  baseStats: Stats
  growthRates: Stats
  classId: RpgClass
  /** The weapons the class wields now, in slot order: five to v15 (D86), three from v16 (CP2). */
  weapons: RpgWeapon[]
  tier: number
  level: number
  exp: number
  /** The side skills she has learned in this class's trees. Core skills aren't listed: an open depth gives them. */
  tree: RpgNodeRef[]
  legacy: RpgNodeRef[]
  /** Her rank in this class (1–50): it opens the trees' depths and pays their side points (D102). */
  classRank: number
}
export interface RpgCoreStats extends Stats {
  atk: number
  matk: number
  initiative: number
  pdef: number
  mdef: number
  /** Her Heal (D141): Guts × her class's heal lean. Mends and Barriers grow ×(1 + Heal ÷ 300). Kept under its old name so
   * frozen fights still parse. From v15 (D179) it is 0: Heal retires, and a healer's mends scale from her ATK or M.ATK
   * (`BATTLE_HEAL_OFFENSE_SCALE`). */
  dexterity: number
  hp: number
  mp: number
}

// --- Classes and weapons (D86) -----------------------------------------------------------------------------------------

// Each class rule's generations are rows of data (D179). A Paladin row in a v1 table holds her v2 values: the type needs
// it, and no v1 fight or save has a Paladin.
const byGeneration = <T>(v1: T, v2: T) => (engine: number): T => (rpgV2(engine) ? v2 : v1)
/** A rule with a third row (D200): classes v1's and v2's as `byGeneration`, the Tier rework's fight's from v16. */
const byRework = <T>(v1: T, v2: T, v16: T) => {
  const older = byGeneration(v1, v2)
  return (engine: number): T => (rpgRework('fight', engine) ? v16 : older(engine))
}

/** What each of a class's slots holds, in order. To v15 the Brawler and the Mage wield all of their five and the others
 * choose; from v16 every class chooses (CP12), each slot a channel. */
export type RpgSlotKind = 'arms' | 'tome' | 'any'
const ARMS_LED: readonly RpgSlotKind[] = ['arms', 'arms', 'arms', 'tome', 'tome']
const TOME_LED: readonly RpgSlotKind[] = ['tome', 'tome', 'tome', 'arms', 'arms']
const SLOTS_V1: Readonly<Record<RpgClass, readonly RpgSlotKind[]>> = {
  brawler: ['arms', 'arms', 'arms', 'arms', 'arms'],
  mage: ['tome', 'tome', 'tome', 'tome', 'tome'],
  summoner: TOME_LED,
  spellblade: ARMS_LED,
  cleric: ['any', 'any', 'any', 'any', 'any'],
  paladin: ARMS_LED,
}
/** The Tier rework's fight (v16, CP2): three slots typed by channel, her lead channel first. The Brawler 3 Arms, the
 * Mage 3 Tomes, the Spell Blade and the Paladin 2 Arms + 1 Tome, the Summoner and the Cleric 2 Tomes + 1 Arm. */
const ARMS_PAIR: readonly RpgSlotKind[] = ['arms', 'arms', 'tome']
const TOME_PAIR: readonly RpgSlotKind[] = ['tome', 'tome', 'arms']
const SLOTS_V16: Readonly<Record<RpgClass, readonly RpgSlotKind[]>> = {
  brawler: ['arms', 'arms', 'arms'],
  mage: ['tome', 'tome', 'tome'],
  summoner: TOME_PAIR,
  spellblade: ARMS_PAIR,
  cleric: TOME_PAIR,
  paladin: ARMS_PAIR,
}
/** Classes v2 (§3): the Cleric 3 Tomes + 2 Arms, the Paladin her mirror. */
const slotsOf = byRework(SLOTS_V1, { ...SLOTS_V1, cleric: TOME_LED }, SLOTS_V16)
/** A class's slots in an engine's generation. */
export const rpgClassSlots = (classId: RpgClass, engine: number = BATTLE_ENGINE_VERSION): readonly RpgSlotKind[] => slotsOf(engine)[classId]
/** The live generation's slots. */
export const RPG_CLASS_SLOTS: Readonly<Record<RpgClass, readonly RpgSlotKind[]>> = slotsOf(BATTLE_ENGINE_VERSION)
/**
 * Which half of each armor slot a class starts in (classes v2 §7, D160): a new Uma's five slots all hold her starting
 * class's kind. Magical for the Tome-led classes, physical for the rest.
 */
export const RPG_CLASS_ARMOR: Readonly<Record<RpgClass, 'physical' | 'magical'>> = {
  brawler: 'physical',
  mage: 'magical',
  spellblade: 'physical',
  cleric: 'magical',
  summoner: 'magical',
  paladin: 'physical',
}
/** Whether a class picks its weapons in an engine's generation: to v15 the Summoner, Spell Blade, Cleric and Paladin
 * (the Brawler and the Mage wield a fixed five); from v16 every class, any kinds of her slots' channels (CP12). */
export const rpgPicksWeapons = (classId: RpgClass, engine: number = BATTLE_ENGINE_VERSION): boolean =>
  rpgRework('fight', engine) || (classId !== 'brawler' && classId !== 'mage')
const WEAPONS_V1: Readonly<Record<RpgClass, readonly RpgWeapon[]>> = {
  brawler: RPG_WEAPON_KINDS, mage: RPG_TOMES,
  summoner: ['tome-fire', 'tome-ice', 'tome-lightning', 'greatsword', 'lance'],
  spellblade: ['greatsword', 'lance', 'katana', 'tome-fire', 'tome-lightning'],
  cleric: ['greatsword', 'axe', 'bow', 'tome-fire', 'tome-light'],
  paladin: ['greatsword', 'axe', 'lance', 'tome-ice', 'tome-fire'],
}
/** The owner's defaults (v16, CP3), in slot order: the pure classes the ring (Fire, Ice and Lightning's twins in each
 * channel), the hybrids and the Cleric a twin set in both channels, the Paladin her Barriers and her Light. */
const WEAPONS_V16: Readonly<Record<RpgClass, readonly RpgWeapon[]>> = {
  brawler: ['greatsword', 'axe', 'lance'],
  mage: ['tome-fire', 'tome-ice', 'tome-lightning'],
  summoner: ['tome-dark', 'tome-light', 'bow'],
  spellblade: ['katana', 'lance', 'tome-lightning'],
  cleric: ['tome-light', 'tome-ice', 'bow'],
  paladin: ['greatsword', 'axe', 'tome-light'],
}
/** Classes v2 (D179): the Cleric's Light, Dark and Thunder Tomes with Katana and Bow serve the Arcane party's shields, as
 * the Paladin's Greatsword, Axe and Lance with Blizzard and Fire Tomes serve the physical one. */
const weaponsOf = byRework(WEAPONS_V1, { ...WEAPONS_V1, cleric: ['tome-light', 'tome-dark', 'tome-lightning', 'katana', 'bow'] }, WEAPONS_V16)
/** A class's weapons until she picks: to v15 Brawler and Mage their five, the others a spread (class-rework.md §10); from
 * v16 the owner's three (CP3). */
export function rpgDefaultWeapons(classId: RpgClass, engine: number = BATTLE_ENGINE_VERSION): RpgWeapon[] {
  return [...weaponsOf(engine)[classId]]
}
/** Different weapons of her class's trees, one a slot, in this engine's generation: to v15 five, as many Tomes and Arms as
 * the class's slots say; from v16 three, each in a slot of its channel by position (CP2: her first slot is always her
 * lead channel; swaps within a channel stay free). */
export function validRpgWeapons(classId: RpgClass, weapons: readonly RpgWeapon[], engine: number = BATTLE_ENGINE_VERSION): boolean {
  if (!Array.isArray(weapons) || weapons.length !== rpgWeaponSlots(engine) || new Set(weapons).size !== weapons.length) return false
  if (!weapons.every((w) => isRpgWeapon(w) && rpgClassWeapons(classId).includes(w))) return false
  const slots = rpgClassSlots(classId, engine)
  if (rpgRework('fight', engine)) return weapons.every((w, i) => (slots[i] === 'tome') === isRpgTome(w))
  const tomes = weapons.filter(isRpgTome).length
  const want = slots.filter((k) => k === 'tome').length
  return slots.includes('any') || tomes === want
}

/** The class an Uma starts in: her best running style's (front Brawler, pace Mage, late Cleric, end Summoner). Classes v2's
 * Paladin start, a Late surger whose Power beats her Wit, is the save's at unlock (H58). */
export function rpgDefaultClass(style: 'front' | 'pace' | 'late' | 'end'): RpgClass {
  return ({ front: 'brawler', pace: 'mage', late: 'cleric', end: 'summoner' } as const)[style]
}

/** How a class leans the shared projection. */
export interface RpgClassLean { hp: number; atk: number; matk: number; pdef: number; mdef: number; mp: number; heal: number }
const STATS_V1: Readonly<Record<RpgClass, RpgClassLean>> = {
  brawler: { hp: 1.15, atk: 1.1, matk: 0.9, pdef: 1.1, mdef: 0.9, mp: 0.8, heal: 0.8 },
  mage: { hp: 0.9, atk: 0.9, matk: 1.15, pdef: 0.9, mdef: 1.1, mp: 1.3, heal: 1 },
  spellblade: { hp: 1, atk: 1.05, matk: 1.05, pdef: 1, mdef: 1, mp: 1, heal: 0.9 },
  cleric: { hp: 1, atk: 0.8, matk: 1, pdef: 1, mdef: 1.15, mp: 1.3, heal: 1.3 },
  summoner: { hp: 1, atk: 1, matk: 1, pdef: 1, mdef: 1, mp: 1.1, heal: 1.2 },
  paladin: { hp: 1, atk: 1, matk: 0.8, pdef: 1.15, mdef: 1, mp: 1.3, heal: 0 },
}
/** Classes v2 (§3.1–§3.3): the hybrids' mirrored leans, the Paladin the Cleric's mirror, and Heal retired. */
const statsOf = byGeneration(STATS_V1, {
  brawler: { ...STATS_V1.brawler, heal: 0 },
  mage: { ...STATS_V1.mage, heal: 0 },
  spellblade: { ...STATS_V1.spellblade, atk: 1.1, matk: 0.95, heal: 0 },
  cleric: { ...STATS_V1.cleric, heal: 0 },
  summoner: { ...STATS_V1.summoner, atk: 0.95, matk: 1.1, mp: 1, heal: 0 },
  paladin: STATS_V1.paladin,
})
/** A class's lean in an engine's generation. */
export const rpgClassStats = (classId: RpgClass, engine: number = BATTLE_ENGINE_VERSION): RpgClassLean => statsOf(engine)[classId]
/** The live generation's leans. */
export const RPG_CLASS_STATS: Readonly<Record<RpgClass, RpgClassLean>> = statsOf(BATTLE_ENGINE_VERSION)

/** Every tree of a class (5 or 10), and the ones her weapons make usable. */
export const rpgClassTrees = (classId: RpgClass): RpgTreeId[] => rpgClassWeapons(classId).map((w) => rpgTreeOf(classId, w))
export const rpgProfileTrees = (p: Pick<RpgProfile, 'classId' | 'weapons'>): RpgTreeId[] => p.weapons.map((w) => rpgTreeOf(p.classId, w))

/**
 * How a class acts (D86): once a turn for everyone. `arms` and `tome` are the power of a skill or Attack of that half
 * (D179) and `mp` scales every skill's MP. `power` is a one-half class's power, or a pair class's leading half (in v1
 * each half's: there `arms` = `tome` = `power`). A Summoner's summon lingers at `linger`. A `pair` class acts with one
 * Arms half and one Tome half: the Spell Blade, and from v15 the Summoner too, her Tome half leading.
 */
export interface RpgHand { power: number; arms: number; tome: number; mp: number; linger: number; pair: boolean }
const hand = (power: number, arms: number, tome: number, mp: number, linger = 0, pair = false): RpgHand =>
  ({ power, arms, tome, mp, linger, pair })
const HANDS_V1: Readonly<Record<RpgClass, RpgHand>> = {
  brawler: hand(1, 1, 1, 1), mage: hand(1, 1, 1, 1), spellblade: hand(0.45, 0.45, 0.45, 0.5, 0, true),
  cleric: hand(0.5, 0.5, 0.5, 0.6), summoner: hand(0.6, 0.6, 0.6, 0.7, 0.3), paladin: hand(0.5, 0.5, 0.5, 0.6),
}
/** Classes v2 (§3.1–§3.3): the Spell Blade 70/30 with her Arms half leading, the Summoner her mirror. H63 (the mirror)
 * set them with the balance simulation so the two deal the same damage a turn on the world's stages, each 70/30 her way:
 * the Spell Blade Arms 0.72 + Tome 0.44 (1.16 a turn), the Summoner Tome 0.58 + Arms 0.56 (1.14) with her farewell
 * (`BATTLE_FAREWELL_FACTOR`) on top. Her Tome summons carry her areas and her kit is all magic, so her Arms summon sits
 * near her Tome summon for a 70% magical split; her Tome stays the stronger hand, so it still leads (H60, D186, had
 * 0.68 + 0.32 and 0.58 + 0.32). */
const HANDS_V2: Readonly<Record<RpgClass, RpgHand>> = {
  ...HANDS_V1, spellblade: hand(0.72, 0.72, 0.44, 0.5, 0, true), summoner: hand(0.58, 0.56, 0.58, 0.5, 0.3, true),
}
/** The Tier rework's fight (v16, SB11, CP9): v2's hands, the Summoner's Arms hand 0.48 (her Tome 0.58 still leads), the
 * mirror's knob on the new maps. H71 measures it and may move it. */
const handsOf = byRework(HANDS_V1, HANDS_V2, { ...HANDS_V2, summoner: hand(0.58, 0.48, 0.58, 0.5, 0.3, true) })
export function rpgHand(p: Pick<RpgProfile, 'classId'>, engine: number = BATTLE_ENGINE_VERSION): RpgHand {
  return { ...handsOf(engine)[p.classId] }
}

// --- Levels and stats --------------------------------------------------------------------------------------------------

function requireSafe(value: number, name: string, min = 0): void {
  if (!Number.isSafeInteger(value) || value < min) throw new RangeError(`Invalid ${name}`)
}

function checkedStats(value: Stats, name: string, growth = false): Stats {
  if (!value || typeof value !== 'object') throw new RangeError(`Missing ${name}`)
  const copy = {} as Stats
  for (const key of STATS) {
    const number = value[key]
    if (!Number.isFinite(number) || number < 0 || (growth ? number > 1 : !Number.isSafeInteger(number))) {
      throw new RangeError(`Invalid ${name}.${key}`)
    }
    copy[key] = number
  }
  return copy
}

export function rpgExpToNext(level: number): number {
  requireSafe(level, 'RPG level', 1)
  if (level >= RPG_TIER_MAX_LEVEL) throw new RangeError('Lv50 banks EXP until promotion')
  return 120 + 16 * level
}

/** Levels gained before this one across every tier: Tier 1 Lv1 is 0, Tier 2 Lv1 is 50 (design §2.2). */
export function rpgLifetimeLevels(tier: number, level: number): number {
  requireSafe(tier, 'RPG tier', 1)
  requireSafe(level, 'RPG level', 1)
  if (level > RPG_TIER_MAX_LEVEL) throw new RangeError('RPG level exceeds tier')
  const lifetime = RPG_TIER_MAX_LEVEL * (tier - 1) + level - 1
  requireSafe(lifetime, 'lifetime RPG levels')
  return lifetime
}

/** HP a point of Guts adds (classes v2 C1, D179): none in v1, 1 from v15, where Heal retires. */
const gutsHp = byGeneration(0, 1)

export function projectRpgStats(profile: Pick<RpgProfile, 'baseStats' | 'growthRates' | 'tier' | 'level' | 'classId'>,
  engine: number = BATTLE_ENGINE_VERSION): RpgCoreStats {
  const lifetime = rpgLifetimeLevels(profile.tier, profile.level)
  const base = checkedStats(profile.baseStats, 'base stats')
  const growth = checkedStats(profile.growthRates, 'growth rates', true)
  const lean = statsOf(engine)[profile.classId]
  if (!lean) throw new RangeError('Invalid RPG class')
  const core = {} as Stats
  for (const key of STATS) {
    const projected = Math.round(base[key] / 5 + lifetime * 1.5 * (1 + growth[key]))
    requireSafe(projected, `projected ${key}`)
    core[key] = projected
  }
  // Campaign MP: a pool worth a few skills that carries between fights; Wit buys more casts. HP stays under a thousand
  // at Lv 50 (D104: 5 × Stamina, was 6 ×); from v15 Guts adds to it (C1). Her Heal is 0 from v15, as its lean is.
  const hp = Math.round((100 + 5 * core.stamina + 2 * core.power + gutsHp(engine) * core.guts) * lean.hp)
  const mp = Math.round((20 + 1.5 * core.wit) * lean.mp)
  requireSafe(hp, 'projected HP')
  requireSafe(mp, 'projected MP')
  return { ...core, atk: Math.round(core.speed * lean.atk), matk: Math.round(core.speed * lean.matk), initiative: core.stamina,
    pdef: Math.round(core.power * lean.pdef), mdef: Math.round((core.power + core.wit) / 2 * lean.mdef),
    dexterity: Math.round(core.guts * lean.heal), hp, mp }
}

export function grantRpgExp(profile: Pick<RpgProfile, 'tier' | 'level' | 'exp'>, amount: number): { level: number; exp: number; levelsCrossed: number[] } {
  requireSafe(amount, 'RPG EXP grant')
  rpgLifetimeLevels(profile.tier, profile.level)
  requireSafe(profile.exp, 'RPG EXP bank')
  if (amount > Number.MAX_SAFE_INTEGER - profile.exp) throw new RangeError('RPG EXP overflow')
  let exp = profile.exp + amount
  let level = profile.level
  const levelsCrossed: number[] = []
  while (level < RPG_TIER_MAX_LEVEL && exp >= rpgExpToNext(level)) {
    exp -= rpgExpToNext(level)
    level += 1
    levelsCrossed.push(level)
  }
  return { level, exp, levelsCrossed }
}

// --- Trees (D77, D86) --------------------------------------------------------------------------------------------------

/** Side points a class has earned: one per Class Rank. */
export function rpgTreePointsEarned(classRank: number): number {
  return Math.max(0, Math.min(classRank, RPG_TIER_MAX_LEVEL)) * RPG_SIDE_POINTS_PER_LEVEL
}

export function rpgActiveSlots(level: number): number {
  rpgLifetimeLevels(1, level)
  return RPG_BASE_ACTIVE_SLOTS + RPG_ACTIVE_SLOT_GATES.filter((gate) => level >= gate).length
}

/** Side skills cost their depth; unknown nodes count as out of budget. */
export function rpgTreePointsSpent(tree: readonly RpgNodeRef[]): number {
  return tree.reduce((sum, ref) => sum + (rpgNode(ref.id)?.cost ?? Number.MAX_SAFE_INTEGER / 64), 0)
}

export const rpgNodeKey = (ref: RpgNodeRef): string => `${ref.tier}:${ref.id}`

type DepthGated = Pick<RpgProfile, 'classRank'>
/** Why a depth is closed, or null: depth d opens at Class Rank 1, 10, 20, 30 or 40 (D102). */
export function rpgDepthBlock(profile: DepthGated, depth: number): string | null {
  return profile.classRank < RPG_DEPTH_GATES[depth - 1]! ? `Opens at Class Rank ${RPG_DEPTH_GATES[depth - 1]}` : null
}
/** The deepest depth a Class Rank opens. */
export const rpgOpenDepth = (classRank: number): number => RPG_DEPTH_GATES.filter((gate) => classRank >= gate).length

/** The core skills an open depth gives in these trees, shallowest first. */
export function rpgOpenCores(profile: Pick<RpgProfile, 'tier' | 'classRank'>, trees: readonly RpgTreeId[]): RpgNodeRef[] {
  return trees.flatMap((tree) => Array.from({ length: 5 }, (_, i) => rpgNode(`${tree}.${i + 1}`))
    .filter((n): n is RpgNode => !!n && !rpgDepthBlock(profile, n.depth)))
    .sort((a, b) => a.depth - b.depth).map((n) => ({ tier: profile.tier, id: n.id }))
}

type Learner = Pick<RpgProfile, 'classId' | 'tier' | 'classRank' | 'tree'>
/** Why this node can't be learned now, or null. Only side skills are learned; the same rules validate a stored tree. */
export function rpgLearnBlock(profile: Learner, id: string): string | null {
  const node = rpgNode(id)
  if (!node || !rpgClassTrees(profile.classId).includes(node.tree)) return 'Not in this class’s trees'
  const depth = rpgDepthBlock(profile, node.depth)
  if (node.variant === null) return depth ?? 'Learned'
  if (profile.tree.some((ref) => ref.id === id)) return 'Already learned'
  if (depth) return depth
  if (profile.classRank < rpgSideNodeLevel(node.depth)) return `Opens at Class Rank ${rpgSideNodeLevel(node.depth)}`
  if (rpgTreePointsSpent(profile.tree) + node.cost > rpgTreePointsEarned(profile.classRank)) return 'Not enough points'
  return otherSide(profile.tree, node) ? 'The other side is learned' : null
}
const otherSide = (tree: readonly RpgNodeRef[], node: RpgNode): boolean =>
  tree.some((ref) => ref.id === `${node.tree}.${node.depth}${node.variant === 'a' ? 'b' : 'a'}`)

export function learnRpgNode<P extends Learner>(profile: P, id: string): P {
  const block = rpgLearnBlock(profile, id)
  if (block) throw new RangeError(block)
  return { ...profile, tree: [...profile.tree, { tier: profile.tier, id }] }
}

/** Side skills swap freely and the points come back. */
export function forgetRpgVariant<P extends Pick<RpgProfile, 'tree'>>(profile: P, id: string): P {
  const node = rpgNode(id)
  if (!node || node.variant === null || !profile.tree.some((ref) => ref.id === id)) throw new RangeError('Only a learned side skill can be swapped out')
  return { ...profile, tree: profile.tree.filter((ref) => ref.id !== id) }
}

/** A stored set of side skills obeys every learning rule at its Class Rank, whatever order it was learned in. */
export function validRpgTree(profile: Learner): boolean {
  const trees = rpgClassTrees(profile.classId)
  const nodes: RpgNode[] = []
  for (const ref of profile.tree) {
    const node = rpgNode(ref.id)
    if (!node || node.variant === null || ref.tier !== profile.tier || !trees.includes(node.tree) || rpgDepthBlock(profile, node.depth)) return false
    if (profile.classRank < rpgSideNodeLevel(node.depth)) return false
    nodes.push(node)
  }
  if (new Set(nodes.map((n) => n.id)).size !== nodes.length || rpgTreePointsSpent(profile.tree) > rpgTreePointsEarned(profile.classRank)) return false
  return !nodes.some((node) => otherSide(profile.tree, node))
}

/** Skills she may equip now: the open cores and learned sides of her weapons' trees, and her legacy ones. */
export function rpgLearnedSkills(profile: Pick<RpgProfile, 'classId' | 'weapons' | 'tier' | 'classRank' | 'tree' | 'legacy'>): RpgNodeRef[] {
  const trees = rpgProfileTrees(profile)
  const sides = profile.tree.filter((ref) => trees.includes(rpgNode(ref.id)?.tree as RpgTreeId))
  return [...rpgOpenCores(profile, trees), ...sides, ...profile.legacy]
}

/** The equipped skills she can still use, in order: known, in her weapons' trees, unique, within her slots. */
export function rpgUsableLoadout(profile: RpgProfile, refs: readonly RpgNodeRef[]): RpgNodeRef[] {
  const known = new Set(rpgLearnedSkills(profile).map(rpgNodeKey))
  const kept: RpgNodeRef[] = []
  for (const ref of refs) {
    const key = rpgNodeKey(ref)
    if (!known.has(key) || kept.some((r) => rpgNodeKey(r) === key)) continue
    if (ref.tier < profile.tier && kept.filter((r) => r.tier < profile.tier).length >= RPG_MAX_LEGACY_SLOTS) continue
    kept.push({ tier: ref.tier, id: ref.id })
  }
  return kept.slice(0, rpgActiveSlots(profile.level))
}

/** Skills chosen for her when she hasn't picked: each weapon's deepest open core in turn, then the next deepest. A
 * hybrid's weapons alternate Arms and Tomes (her larger half first), so a Spell Blade always has both halves. */
export function rpgAutoLoadout(profile: RpgProfile): RpgNodeRef[] {
  const arms = profile.weapons.filter((w) => !isRpgTome(w)), tomes = profile.weapons.filter(isRpgTome)
  const [first, second] = arms.length >= tomes.length ? [arms, tomes] : [tomes, arms]
  const order = first.flatMap((w, i) => (second[i] ? [w, second[i]!] : [w]))
  const trees = order.map((w) => rpgTreeOf(profile.classId, w))
  const byTree = trees.map((tree) => rpgOpenCores(profile, [tree]).reverse())
  const picks: RpgNodeRef[] = []
  for (let round = 0; round < 5; round++) for (const list of byTree) if (list[round]) picks.push(list[round]!)
  return picks.slice(0, rpgActiveSlots(profile.level))
}
