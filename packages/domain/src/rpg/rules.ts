// An Uma's battle build: class builds, stats, EXP and class trees (docs/design/classes.md). Ported from uma-racer's
// RPG and changed for uma-rpg: every class is free to use (design §5), each class build keeps its own tree with the
// full point budget, and depths open by Uma level until S5's class ranks replace the gates (D49).
import { STATS, type Stats } from '@luismlorenzana/uma-data'
import { RPG_VARIANTS_PER_TREE, rpgNode, rpgSideNodeLevel, type RpgNode } from './catalog'
import { type RpgClass, type RpgTreeId, type RpgWeapon, type RpgWeaponKind } from './kinds'

export * from './kinds'

export const RPG_TIER_MAX_LEVEL = 50
/** Two points a level up to Lv45, plus five each time a depth opens: 115 a tier. */
export const RPG_TREE_POINTS_PER_LEVEL = 2
/** Two points a level all the way to Lv50 (D73: side nodes at every depth need the room). */
export const RPG_TREE_POINT_MAX_LEVEL = 50
export const RPG_TREE_POINTS_PER_DEPTH = 5
/** Uma levels that open depths 1–5 (D49: until S5's class ranks). */
export const RPG_DEPTH_GATES = [1, 10, 20, 30, 40] as const
/** Three skill slots at Lv1, one more at each gate: ten by Lv40. */
export const RPG_BASE_ACTIVE_SLOTS = 3
export const RPG_ACTIVE_SLOT_GATES = [10, 15, 20, 25, 30, 35, 40] as const
export const RPG_MAX_ACTIVE_SLOTS = RPG_BASE_ACTIVE_SLOTS + RPG_ACTIVE_SLOT_GATES.length
/** Skills carried from an earlier tier (S8); the engine still checks the cap. */
export const RPG_MAX_LEGACY_SLOTS = 2
export const RPG_MAX_TREE_NODES = 40

/** A learned node of one tier. */
export interface RpgNodeRef { tier: number; id: string }
export interface RpgProfile {
  outfitId: string
  /** The outfit's base stats at its starting stars, and growth rates as fractions (0.1 = +10%). */
  baseStats: Stats
  growthRates: Stats
  classId: RpgClass
  /** The class build's weapons, main hand first. */
  weapons: RpgWeapon[]
  tier: number
  level: number
  exp: number
  /** The class build's learned nodes. */
  tree: RpgNodeRef[]
  legacy: RpgNodeRef[]
  /** Deepest skill depth her class rank opens (S5, D57). Absent: depths open by level, as in S3. */
  maxDepth?: number
}
export interface RpgCoreStats extends Stats {
  atk: number
  matk: number
  initiative: number
  pdef: number
  mdef: number
  dexterity: number
  hp: number
  mp: number
}

// --- Class builds ------------------------------------------------------------------------------------------------------

/** Weapon sets a class fights with (the Mage is two staves; the Spell Blade carries a Short Sword). */
export const RPG_CLASS_WEAPONS: Readonly<Record<RpgClass, readonly (readonly RpgWeapon[])[]>> = {
  brawler: [['greatsword', 'spear'], ['axe', 'bow']],
  mage: [['mage-staff', 'arcane-staff']],
  spellblade: [['short-sword']],
  cleric: [['arcane-staff', 'cleric-staff']],
  summoner: [['summoner-tome']],
}

/**
 * A class with one of its weapon sets. Each build keeps its own tree and loadout, and every build earns the full point
 * budget from Uma level, so switching costs nothing (design §5).
 */
export const RPG_BUILDS = ['greatsword-spear', 'axe-bow', 'mage', 'spellblade', 'cleric', 'summoner'] as const
export type RpgBuildId = typeof RPG_BUILDS[number]
export const RPG_BUILD: Readonly<Record<RpgBuildId, { classId: RpgClass; weapons: readonly RpgWeapon[] }>> = {
  'greatsword-spear': { classId: 'brawler', weapons: ['greatsword', 'spear'] },
  'axe-bow': { classId: 'brawler', weapons: ['axe', 'bow'] },
  mage: { classId: 'mage', weapons: ['mage-staff', 'arcane-staff'] },
  spellblade: { classId: 'spellblade', weapons: ['short-sword'] },
  cleric: { classId: 'cleric', weapons: ['arcane-staff', 'cleric-staff'] },
  summoner: { classId: 'summoner', weapons: ['summoner-tome'] },
}
export const isRpgBuildId = (v: unknown): v is RpgBuildId => RPG_BUILDS.includes(v as RpgBuildId)

/** The build an Uma starts in: her best running style's class (front Brawler, pace Mage, late Cleric, end Summoner). */
export function rpgDefaultBuild(style: 'front' | 'pace' | 'late' | 'end'): RpgBuildId {
  return ({ front: 'greatsword-spear', pace: 'mage', late: 'cleric', end: 'summoner' } as const)[style]
}

/** Each class leans the shared projection. The Spell Blade's hits are half physical, half magic. */
export const RPG_CLASS_STATS: Readonly<Record<RpgClass, { hp: number; atk: number; matk: number; pdef: number; mdef: number; mp: number }>> = {
  brawler: { hp: 1.15, atk: 1.1, matk: 0.9, pdef: 1.1, mdef: 0.9, mp: 0.8 },
  mage: { hp: 0.9, atk: 0.9, matk: 1.15, pdef: 0.9, mdef: 1.1, mp: 1.3 },
  spellblade: { hp: 1, atk: 1.05, matk: 1.05, pdef: 1, mdef: 1, mp: 1 },
  cleric: { hp: 1, atk: 0.8, matk: 1, pdef: 1, mdef: 1.15, mp: 1.3 },
  summoner: { hp: 1, atk: 1, matk: 1, pdef: 1, mdef: 1, mp: 1.1 },
}

export const sameRpgWeapons = (a: readonly RpgWeapon[], b: readonly RpgWeapon[]): boolean => a.length === b.length && a.every((w, i) => w === b[i])
export function validRpgWeapons(classId: RpgClass, weapons: readonly RpgWeapon[]): boolean {
  return RPG_CLASS_WEAPONS[classId]?.some((set) => sameRpgWeapons(set, weapons)) ?? false
}

/** The class's two trees for its weapons. */
export function rpgClassTrees(classId: RpgClass, weapons: readonly RpgWeapon[]): RpgTreeId[] {
  if (classId === 'summoner') return ['summon-elemental', 'summon-arcane']
  if (classId === 'spellblade') return ['blade-elemental', 'blade-arcane']
  return weapons as RpgTreeId[]
}
export const rpgProfileTrees = (p: Pick<RpgProfile, 'classId' | 'weapons'>): RpgTreeId[] => rpgClassTrees(p.classId, p.weapons)
export const rpgBuildTrees = (build: RpgBuildId): RpgTreeId[] => rpgClassTrees(RPG_BUILD[build].classId, RPG_BUILD[build].weapons)

/** How a build acts each turn: actions, the power and MP share of each skill, and its free action. */
export interface RpgHand { actions: 1 | 2; power: number; mp: number; free: { power: number; kind: 'weapon' | 'short-sword' | 'staff' | 'familiar' } }
export function rpgHand(p: Pick<RpgProfile, 'classId' | 'weapons'>): RpgHand {
  if (p.classId === 'brawler') return { actions: 1, power: 1, mp: 1, free: { power: 1, kind: 'weapon' } }
  if (p.classId === 'cleric') return { actions: 1, power: 0.5, mp: 0.7, free: { power: 0.5, kind: 'staff' } }
  if (p.classId === 'summoner') return { actions: 2, power: 0.5, mp: 0.5, free: { power: 0.5, kind: 'familiar' } }
  // Two half-strength blade actions a turn, so a turn is worth one Brawler action.
  if (p.classId === 'spellblade') return { actions: 2, power: 0.5, mp: 0.5, free: { power: 0.5, kind: 'short-sword' } }
  return { actions: 2, power: 0.6, mp: 0.6, free: { power: 0.4, kind: 'staff' } }
}

/** The Summoner's Familiar forms: one per weapon kind. */
export const RPG_DEFAULT_FAMILIAR: RpgWeaponKind = 'greatsword'

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
  // Campaign MP: a pool worth a few skills that carries between fights; Wit buys more casts.
  const hp = Math.round((100 + 6 * core.stamina + 2 * core.power) * lean.hp)
  const mp = Math.round((20 + 1.5 * core.wit) * lean.mp)
  requireSafe(hp, 'projected HP')
  requireSafe(mp, 'projected MP')
  return { ...core, atk: Math.round(core.speed * lean.atk), matk: Math.round(core.speed * lean.matk), initiative: core.stamina,
    pdef: Math.round(core.power * lean.pdef), mdef: Math.round((core.power + core.wit) / 2 * lean.mdef),
    dexterity: core.guts, hp, mp }
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

// --- Trees ------------------------------------------------------------------------------------------------------------

export function rpgTreePointsEarned(level: number): number {
  rpgLifetimeLevels(1, level)
  return Math.min(level, RPG_TREE_POINT_MAX_LEVEL) * RPG_TREE_POINTS_PER_LEVEL +
    RPG_DEPTH_GATES.filter((gate) => level >= gate).length * RPG_TREE_POINTS_PER_DEPTH
}

export function rpgActiveSlots(level: number): number {
  rpgLifetimeLevels(1, level)
  return RPG_BASE_ACTIVE_SLOTS + RPG_ACTIVE_SLOT_GATES.filter((gate) => level >= gate).length
}

/** Nodes cost their depth; unknown nodes count as out of budget. */
export function rpgTreePointsSpent(tree: readonly RpgNodeRef[]): number {
  return tree.reduce((sum, ref) => sum + (rpgNode(ref.id)?.cost ?? Number.MAX_SAFE_INTEGER / 64), 0)
}

export const rpgNodeKey = (ref: RpgNodeRef): string => `${ref.tier}:${ref.id}`

type DepthGated = Pick<RpgProfile, 'level' | 'maxDepth'>
/** Why a depth is closed, or null: depth d needs class rank d (D77) and Uma Lv 1/10/20/30/40, as in uma-racer. */
export function rpgDepthBlock(profile: DepthGated, depth: number): string | null {
  if (profile.maxDepth !== undefined && depth > profile.maxDepth) return `Needs class rank ${depth}`
  return profile.level < RPG_DEPTH_GATES[depth - 1]! ? `Opens at Lv${RPG_DEPTH_GATES[depth - 1]}` : null
}

/** Why this node can't be learned now, or null. The same rules validate a stored tree. */
export function rpgLearnBlock(profile: Pick<RpgProfile, 'classId' | 'weapons' | 'tier' | 'level' | 'tree' | 'maxDepth'>, id: string): string | null {
  const node = rpgNode(id)
  if (!node || !rpgProfileTrees(profile).includes(node.tree)) return 'Not in this class’s trees'
  if (profile.tree.some((ref) => ref.id === id)) return 'Already learned'
  const depth = rpgDepthBlock(profile, node.depth)
  if (depth) return depth
  if (node.variant !== null && profile.level < rpgSideNodeLevel(node.depth)) return `Opens at Lv${rpgSideNodeLevel(node.depth)}`
  if (rpgTreePointsSpent(profile.tree) + node.cost > rpgTreePointsEarned(profile.level)) return 'Not enough points'
  return rpgShapeBlock(profile.tree.map((ref) => rpgNode(ref.id)!).filter(Boolean), node)
}

/** Structure only: the core node above, the fork's other side and the variant cap. */
function rpgShapeBlock(learned: readonly RpgNode[], node: RpgNode): string | null {
  const has = (branchDepth: number, variant: 'a' | 'b' | null) =>
    learned.some((n) => n.tree === node.tree && n.branch === node.branch && n.depth === branchDepth && n.variant === variant)
  if (node.variant === null) return node.depth > 1 && !has(node.depth - 1, null) ? 'Needs the core skill above' : null
  if (!has(node.depth, null)) return 'Needs its core skill first'
  if (has(node.depth, node.variant === 'a' ? 'b' : 'a')) return 'The other side of this fork is learned'
  if (learned.filter((n) => n.tree === node.tree && n.variant !== null).length >= RPG_VARIANTS_PER_TREE) return `${RPG_VARIANTS_PER_TREE} variants per tree`
  return null
}

export function learnRpgNode<P extends Pick<RpgProfile, 'classId' | 'weapons' | 'tier' | 'level' | 'tree' | 'maxDepth'>>(profile: P, id: string): P {
  const block = rpgLearnBlock(profile, id)
  if (block) throw new RangeError(block)
  return { ...profile, tree: [...profile.tree, { tier: profile.tier, id }] }
}

/** Variants swap freely and the points come back. Core nodes are permanent. */
export function forgetRpgVariant<P extends Pick<RpgProfile, 'tree'>>(profile: P, id: string): P {
  const node = rpgNode(id)
  if (!node || node.variant === null || !profile.tree.some((ref) => ref.id === id)) throw new RangeError('Only a learned variant can be swapped out')
  return { ...profile, tree: profile.tree.filter((ref) => ref.id !== id) }
}

/** A stored tree obeys every learning rule at its level, whatever order it was learned in. */
export function validRpgTree(profile: Pick<RpgProfile, 'classId' | 'weapons' | 'tier' | 'level' | 'tree' | 'maxDepth'>): boolean {
  const trees = rpgProfileTrees(profile)
  const nodes: RpgNode[] = []
  for (const ref of profile.tree) {
    const node = rpgNode(ref.id)
    if (!node || ref.tier !== profile.tier || !trees.includes(node.tree) || rpgDepthBlock(profile, node.depth)) return false
    if (node.variant !== null && profile.level < rpgSideNodeLevel(node.depth)) return false
    nodes.push(node)
  }
  if (new Set(nodes.map((n) => n.id)).size !== nodes.length || rpgTreePointsSpent(profile.tree) > rpgTreePointsEarned(profile.level)) return false
  return nodes.every((node) => rpgShapeBlock(nodes.filter((n) => n !== node), node) === null)
}

/** Active skills she may equip: the build's learned skills and her legacy ones. */
export function rpgLearnedSkills(profile: Pick<RpgProfile, 'tree' | 'legacy'>): RpgNodeRef[] {
  return [...profile.tree, ...profile.legacy].filter((ref) => rpgNode(ref.id)?.skill)
}

/** The equipped skills she can still use, in order: learned, in her trees, unique, within her slots and the legacy cap. */
export function rpgUsableLoadout(profile: RpgProfile, refs: readonly RpgNodeRef[]): RpgNodeRef[] {
  const learned = new Set(rpgLearnedSkills(profile).map(rpgNodeKey))
  const trees = rpgProfileTrees(profile)
  const kept: RpgNodeRef[] = []
  for (const ref of refs) {
    const key = rpgNodeKey(ref), node = rpgNode(ref.id)
    if (!learned.has(key) || !node || !trees.includes(node.tree) || kept.some((r) => rpgNodeKey(r) === key)) continue
    if (ref.tier < profile.tier && kept.filter((r) => r.tier < profile.tier).length >= RPG_MAX_LEGACY_SLOTS) continue
    kept.push({ tier: ref.tier, id: ref.id })
  }
  return kept.slice(0, rpgActiveSlots(profile.level))
}
