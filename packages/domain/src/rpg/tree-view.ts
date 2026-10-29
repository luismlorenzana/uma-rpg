// The Tier rework's trees as the Skills tab draws them (engine v16, H65; class-progression.md §6.1, §6.2, §6.7, CP23):
// her class at the root, then one tree per weapon slot, each a trunk (depths 1–2) and a fork into lines A and B (3–5), her
// line held and the other dimmed, every node with its gate and Skill Rank. Pure, so the screen (H70) stays thin; it reads
// the catalog for names, so only a lazy page imports it. From v19 (Classes v3, H126) a Tier 0's trees are one node each,
// her skill on that weapon, ranking with her Class Rank to 10 (CV6).
import { BATTLE_ENGINE_VERSION, rpgRework } from './battle/caps'
import { rpgNode } from './catalog'
import { rpgIsTier0, type RpgClass, type RpgTreeId, type RpgWeapon } from './kinds'
import { RPG_TIER0_MAX_RANK } from './class-tree'
import { RPG_BRANCH_B_NAME, rpgBranchNode, rpgLineOf, rpgTreeOf, type RpgBranch } from './node-identity'
import {
  RPG_DEPTH_GATES, rpgHand, rpgHeldSkills, rpgNodeKey, rpgSkillRank, rpgSkillRankNextAt, type RpgHand, type RpgNodeRef, type RpgProfile,
} from './rules'

/** One node of a tree, as she stands. */
export interface RpgTreeViewNode {
  id: string
  /** The live generation's name. */
  name: string
  depth: number
  /** The trunk (depths 1–2, always hers) or a line at the fork (3–5). */
  line: 'trunk' | RpgBranch
  /** On her path at an open depth: she holds it and may equip it. */
  held: boolean
  /** Its depth is open at her Class Rank, whichever line she is on. */
  open: boolean
  /** The Class Rank that opens its depth. */
  gate: number
  /** Its Skill Rank at her Class Rank (1–5, 0 while closed): the same on either line, since a swap keeps it. */
  rank: number
  /** The Class Rank of its next rank (its gate while closed), or null at Rank 5. */
  nextRankAt: number | null
  /** In her loadout. */
  equipped: boolean
}
/** One weapon slot's tree: its line (`branch`) and branch B's name, and its eight nodes: the trunk, A, then B. A Tier 0's
 * (v19): line A, no B name (''), and its one node. */
export interface RpgTreeViewTree { weapon: RpgWeapon; tree: RpgTreeId; branch: RpgBranch; bName: string; nodes: RpgTreeViewNode[] }
/** The Skills tab's model: the root (her class, its tier of class and hand; H68 and H70 add the Flourish) and her three
 * trees in slot order. `tier` is 0 for a Tier 0 from v19, else 1. */
export interface RpgTreeView { root: { classId: RpgClass; tier: 0 | 1; hand: RpgHand }; trees: RpgTreeViewTree[] }
/** Whether she is a Tier 0 in an engine's generation (only from v19). */
const tier0At = (classId: RpgClass, engine: number): boolean => rpgRework('classes', engine) && rpgIsTier0(classId)
/** A Tier 0's rank on her one node: her Class Rank, 10 at most. */
const tier0Rank = (classRank: number): number => Math.min(RPG_TIER0_MAX_RANK, Math.max(1, classRank))

/** Her trees from v16, one per weapon slot, with her `loadout` marked; null before v16, where the trees are rows of five
 * depths with side skills bought with points (today's Skills tab). */
export function rpgTreeView(profile: RpgProfile, loadout: readonly RpgNodeRef[], engine: number = BATTLE_ENGINE_VERSION): RpgTreeView | null {
  if (!rpgRework('fight', engine)) return null
  const held = new Set(rpgHeldSkills(profile, engine).map(rpgNodeKey))
  const equipped = new Set(loadout.map(rpgNodeKey))
  const hand = rpgHand(profile, engine)
  if (tier0At(profile.classId, engine)) {
    const rank = tier0Rank(profile.classRank)
    const trees = profile.weapons.map((weapon): RpgTreeViewTree => {
      const id = rpgBranchNode(profile.classId, weapon, 1, 'A')
      const key = rpgNodeKey({ tier: profile.tier, id })
      return { weapon, tree: rpgTreeOf(profile.classId, weapon), branch: 'A', bName: '', nodes: [{ id, name: rpgNode(id)!.name, depth: 1,
        line: 'trunk', held: held.has(key), open: true, gate: 1, rank, nextRankAt: rank < RPG_TIER0_MAX_RANK ? rank + 1 : null, equipped: equipped.has(key) }] }
    })
    return { root: { classId: profile.classId, tier: 0, hand }, trees }
  }
  const trees = profile.weapons.map((weapon): RpgTreeViewTree => {
    const node = (depth: number, line: 'trunk' | RpgBranch): RpgTreeViewNode => {
      const id = rpgBranchNode(profile.classId, weapon, depth, line === 'trunk' ? 'A' : line)
      const key = rpgNodeKey({ tier: profile.tier, id })
      const gate = RPG_DEPTH_GATES[depth - 1]!
      return { id, name: rpgNode(id)!.name, depth, line, held: held.has(key), open: profile.classRank >= gate, gate,
        rank: rpgSkillRank(depth, profile.classRank), nextRankAt: rpgSkillRankNextAt(depth, profile.classRank), equipped: equipped.has(key) }
    }
    return { weapon, tree: rpgTreeOf(profile.classId, weapon), branch: rpgLineOf(profile.lines, weapon), bName: RPG_BRANCH_B_NAME[profile.classId][weapon]!,
      nodes: [node(1, 'trunk'), node(2, 'trunk'), ...[3, 4, 5].map((d) => node(d, 'A')), ...[3, 4, 5].map((d) => node(d, 'B'))] }
  })
  return { root: { classId: profile.classId, tier: 1, hand }, trees }
}

/** A held skill that rose a Skill Rank, for the result sheet ("Cleave reached Rank 3"). `opened`: its depth opened in
 * the same rise, so it arrives at Rank 1 ("Sunder opened"). */
export interface RpgSkillRankUp { id: string; name: string; depth: number; rank: number; opened: boolean }
/** The skills she holds at `afterClassRank` whose Skill Rank is higher than at `beforeClassRank`, with the new rank, in held
 * order (shallowest first, her weapons in slot order). None before v16, where nothing ranks. From v19 a Tier 0's three
 * nodes rank with each new Class Rank to 10 (CV6). */
export function rpgSkillRankUps(profile: RpgProfile, beforeClassRank: number, afterClassRank: number,
  engine: number = BATTLE_ENGINE_VERSION): RpgSkillRankUp[] {
  if (!rpgRework('fight', engine)) return []
  if (tier0At(profile.classId, engine)) {
    const before = tier0Rank(beforeClassRank), rank = tier0Rank(afterClassRank)
    if (rank <= before) return []
    return rpgHeldSkills({ ...profile, classRank: afterClassRank }, engine).map((ref) =>
      ({ id: ref.id, name: rpgNode(ref.id)!.name, depth: 1, rank, opened: false }))
  }
  return rpgHeldSkills({ ...profile, classRank: afterClassRank }, engine).flatMap((ref) => {
    const node = rpgNode(ref.id)!
    const before = rpgSkillRank(node.depth, beforeClassRank), rank = rpgSkillRank(node.depth, afterClassRank)
    return rank > before ? [{ id: ref.id, name: node.name, depth: node.depth, rank, opened: before === 0 }] : []
  })
}
