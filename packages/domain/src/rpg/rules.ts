// An Uma's battle profile: class, weapons, stats, EXP and skill trees (D86, docs/design/class-rework.md). Every class
// wields five weapons and has a tree per weapon; its Class Rank opens the depths and pays the points for side skills
// (D102), her Uma Level her stats and skill slots, and a hand per class scales power and MP.
import { STATS, type Stats } from '@luismlorenzana/uma-data'
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
/** Every class wields five weapons (D86). */
export const RPG_WEAPON_SLOTS = 5

/** A learned node of one tier. */
export interface RpgNodeRef { tier: number; id: string }
export interface RpgProfile {
  outfitId: string
  /** The outfit's base stats at its starting stars, and growth rates as fractions (0.1 = +10%). */
  baseStats: Stats
  growthRates: Stats
  classId: RpgClass
  /** The five weapons the class wields now (D86). */
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
   * frozen fights still parse. */
  dexterity: number
  hp: number
  mp: number
}

// --- Classes and weapons (D86) -----------------------------------------------------------------------------------------

/** What each of a class's five slots holds. Brawler and Mage wield all of their five; the others choose. */
export type RpgSlotKind = 'arms' | 'tome' | 'any'
export const RPG_CLASS_SLOTS: Readonly<Record<RpgClass, readonly RpgSlotKind[]>> = {
  brawler: ['arms', 'arms', 'arms', 'arms', 'arms'],
  mage: ['tome', 'tome', 'tome', 'tome', 'tome'],
  summoner: ['tome', 'tome', 'tome', 'arms', 'arms'],
  spellblade: ['arms', 'arms', 'arms', 'tome', 'tome'],
  cleric: ['any', 'any', 'any', 'any', 'any'],
}
/** Whether a class picks its weapons (Summoner, Spell Blade, Cleric) or wields a fixed five. */
export const rpgPicksWeapons = (classId: RpgClass): boolean => classId !== 'brawler' && classId !== 'mage'
/** A class's weapons until she picks: Brawler and Mage their five, the others a spread (class-rework.md §10). */
export function rpgDefaultWeapons(classId: RpgClass): RpgWeapon[] {
  return ({
    brawler: [...RPG_WEAPON_KINDS], mage: [...RPG_TOMES],
    summoner: ['tome-fire', 'tome-ice', 'tome-lightning', 'greatsword', 'lance'],
    spellblade: ['greatsword', 'lance', 'katana', 'tome-fire', 'tome-lightning'],
    cleric: ['greatsword', 'axe', 'bow', 'tome-fire', 'tome-light'],
  } as Record<RpgClass, RpgWeapon[]>)[classId]
}
/** Five different weapons, as many Tomes and Arms as the class's slots say. */
export function validRpgWeapons(classId: RpgClass, weapons: readonly RpgWeapon[]): boolean {
  if (!Array.isArray(weapons) || weapons.length !== RPG_WEAPON_SLOTS || new Set(weapons).size !== weapons.length) return false
  if (!weapons.every((w) => isRpgWeapon(w) && rpgClassWeapons(classId).includes(w))) return false
  const slots = RPG_CLASS_SLOTS[classId]
  const tomes = weapons.filter(isRpgTome).length
  const want = slots.filter((k) => k === 'tome').length
  return slots.includes('any') || tomes === want
}

/** The class an Uma starts in: her best running style's (front Brawler, pace Mage, late Cleric, end Summoner). */
export function rpgDefaultClass(style: 'front' | 'pace' | 'late' | 'end'): RpgClass {
  return ({ front: 'brawler', pace: 'mage', late: 'cleric', end: 'summoner' } as const)[style]
}

/** Each class leans the shared projection. */
export const RPG_CLASS_STATS: Readonly<Record<RpgClass, { hp: number; atk: number; matk: number; pdef: number; mdef: number; mp: number; heal: number }>> = {
  brawler: { hp: 1.15, atk: 1.1, matk: 0.9, pdef: 1.1, mdef: 0.9, mp: 0.8, heal: 0.8 },
  mage: { hp: 0.9, atk: 0.9, matk: 1.15, pdef: 0.9, mdef: 1.1, mp: 1.3, heal: 1 },
  spellblade: { hp: 1, atk: 1.05, matk: 1.05, pdef: 1, mdef: 1, mp: 1, heal: 0.9 },
  cleric: { hp: 1, atk: 0.8, matk: 1, pdef: 1, mdef: 1.15, mp: 1.3, heal: 1.3 },
  summoner: { hp: 1, atk: 1, matk: 1, pdef: 1, mdef: 1, mp: 1.1, heal: 1.2 },
}

/** Every tree of a class (5 or 10), and the ones her weapons make usable. */
export const rpgClassTrees = (classId: RpgClass): RpgTreeId[] => rpgClassWeapons(classId).map((w) => rpgTreeOf(classId, w))
export const rpgProfileTrees = (p: Pick<RpgProfile, 'classId' | 'weapons'>): RpgTreeId[] => p.weapons.map((w) => rpgTreeOf(p.classId, w))

/**
 * How a class acts (D86): once a turn for everyone. `power` and `mp` scale every skill and the Attack; a Summoner's
 * summon lingers at `linger`; a Spell Blade's act is a `pair`, one Arms half and one Tome half.
 */
export interface RpgHand { power: number; mp: number; linger: number; pair: boolean }
export function rpgHand(p: Pick<RpgProfile, 'classId'>): RpgHand {
  switch (p.classId) {
    case 'summoner': return { power: 0.6, mp: 0.7, linger: 0.3, pair: false }
    case 'spellblade': return { power: 0.45, mp: 0.5, linger: 0, pair: true }
    case 'cleric': return { power: 0.5, mp: 0.6, linger: 0, pair: false }
    default: return { power: 1, mp: 1, linger: 0, pair: false }
  }
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

export function projectRpgStats(profile: Pick<RpgProfile, 'baseStats' | 'growthRates' | 'tier' | 'level' | 'classId'>): RpgCoreStats {
  const lifetime = rpgLifetimeLevels(profile.tier, profile.level)
  const base = checkedStats(profile.baseStats, 'base stats')
  const growth = checkedStats(profile.growthRates, 'growth rates', true)
  const lean = RPG_CLASS_STATS[profile.classId]
  if (!lean) throw new RangeError('Invalid RPG class')
  const core = {} as Stats
  for (const key of STATS) {
    const projected = Math.round(base[key] / 5 + lifetime * 1.5 * (1 + growth[key]))
    requireSafe(projected, `projected ${key}`)
    core[key] = projected
  }
  // Campaign MP: a pool worth a few skills that carries between fights; Wit buys more casts. HP stays under a thousand
  // at Lv 50 (D104: 5 × Stamina, was 6 ×).
  const hp = Math.round((100 + 5 * core.stamina + 2 * core.power) * lean.hp)
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
