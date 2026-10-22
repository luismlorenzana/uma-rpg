// Battle numbers and skill lookup, engine v6–v15 (D86, D102, D141, D169, D179; docs/design/class-rework.md, combat-balance.md).
import { rpgNode, type RpgNode, type RpgSkillDef } from '../catalog'
import { isRpgTome, RPG_DEPTH_GATES, rpgElementWeakness, rpgHand, rpgLearnedSkills, rpgNodeKey, rpgPhysical, rpgProfileTrees, type RpgDamageKind, type RpgElement,
  type RpgNodeRef } from '../rules'
import type { BattleAlly, BattleChannel } from './types'

/** Octopath Traveler: a weakness hit ×1.3, a broken foe ×2 — here as ×0.5 before the break and ×1 after. */
export const BATTLE_WEAK = 1.3
export const BATTLE_UNBROKEN_FACTOR = 0.5
/** v14 (D169): the Rift's ward. A hit of the channel a foe wards deals this share, on top of the unbroken halving. */
export const BATTLE_WARD_FACTOR = 0.5
export const BATTLE_DEFENSE_SHARE = 0.5
export const BATTLE_MIN_OFFENSE_SHARE = 0.2
export const BATTLE_GUARD_FACTOR = 0.5
/** A break lasts the round it happens in and the next one. */
export const BATTLE_BREAK_ROUNDS = 2
export { BATTLE_MAX_ROUNDS } from './caps'
export const BATTLE_STATUS_TURNS = 2
export const BATTLE_STATUS_STACK_CAP = 3
export const BATTLE_BURN_PERCENT = 0.04
/** Ally-made statuses move damage 10% a stack; the foes' own D265 statuses 15% (mark 10%). */
export const BATTLE_STATUS_STEP = 0.1
export const BATTLE_FOE_STATUS_STEP = 0.15
export const BATTLE_BARRIER_PERCENT = 0.08
export const BATTLE_BARRIER_CAP = 0.3
export const BATTLE_CLARITY_PERCENT = 0.04
/** v12 (D141, combat-balance.md): a skill Barrier's cap as a share of max HP; the part of a foe hit she can Rally back;
 * what every Uma recovers when a new wave enters; a revive's HP. */
export const BATTLE_COVER_CAP = 0.4
export const BATTLE_RALLY_SHARE = 0.3
export const BATTLE_BREATHER = 0.1
export const BATTLE_REVIVE_SHARE = 0.25
/** v15 (classes v2 §3.3, C8): one healer carries the party, so a skill Barrier may reach 60% of max HP. */
export const BATTLE_COVER_CAP_V15 = 0.6
/** v15 (§4): a Cleric's Light spell leaves Regen, its mend repeating at this share of itself at the end of the round she
 * casts it and of the next (`BATTLE_REGEN_ROUNDS`, in `caps.ts` so the node summaries read it without the engine). */
export const BATTLE_REGEN_SHARE = 0.3
export { BATTLE_HEAL_OFFENSE_SCALE, BATTLE_HEAL_SCALE, BATTLE_REGEN_ROUNDS } from './caps'

export const battleChannel = (kind: RpgDamageKind | null): BattleChannel => kind !== null && rpgPhysical(kind) ? 'physical' : 'magical'
/** The element that a foe of this element is weak to. */
export const battleWeakness = (element: RpgElement): RpgElement => rpgElementWeakness(element)

export interface BattleSkill { node: RpgNode; def: RpgSkillDef; ref: RpgNodeRef; label: string; mp: number; power: number }

/** The Class Rank that gates her trees: v8 sends it; a v6–v7 fight gated depths by her level and class rank (D77), and
 * this rank opens exactly the same depths and side skills. */
export function battleClassRank(ally: Pick<BattleAlly, 'classRank' | 'level' | 'maxDepth'>): number {
  if (ally.classRank !== undefined) return ally.classRank
  if (ally.maxDepth === undefined || ally.maxDepth >= RPG_DEPTH_GATES.length) return ally.level
  return Math.min(ally.level, RPG_DEPTH_GATES[ally.maxDepth]! - 1)
}

/** A known, equipped skill as this ally casts it in a fight of `version`: her hand of that generation scales its power
 * (`arms` or `tome` by its weapon, equal in v1, D179) and MP, the skill's tier scales MP. */
export function battleSkillFor(ally: Pick<BattleAlly, 'classId' | 'weapons' | 'tier' | 'level' | 'tree' | 'legacy' | 'loadout' | 'maxDepth' | 'classRank'>,
  ref: RpgNodeRef, version: number): BattleSkill | null {
  const node = rpgNode(ref.id)
  if (!node || (ref.tier === ally.tier && !rpgProfileTrees(ally).includes(node.tree))) return null
  const key = rpgNodeKey(ref)
  if (!rpgLearnedSkills({ ...ally, classRank: battleClassRank(ally) }).some((r) => rpgNodeKey(r) === key) || !ally.loadout.some((r) => rpgNodeKey(r) === key)) return null
  const hand = rpgHand(ally, version)
  return { node, def: node.skill, ref, label: node.name, power: isRpgTome(node.weapon) ? hand.tome : hand.arms,
    mp: Math.max(1, Math.round(node.skill.mp * hand.mp)) * ref.tier }
}

export const battleSkillLabel = (id: string): string => rpgNode(id)?.name ?? id
