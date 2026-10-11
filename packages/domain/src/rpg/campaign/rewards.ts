// What a won fight pays (docs/design/battles.md): level-relative EXP for every entrant and Laurels for the world (D51).
// EXP is uma-racer's rule re-weighted for ten-level chapters (D48); Laurels come from the pacing model (D54).
import { BATTLE_LAURELS } from '../../economy/pacing'
import { rpgExpToNext, RPG_TIER_MAX_LEVEL } from '../rules'
import { RPG_FIGHT_STAGES, rpgTierLevel, type RpgMapNode } from './chapters'

/**
 * Shares of one level at the foes' level, for the world map's stages (D71, D72): a regular stage about 0.4 of a level,
 * an elite 0.6, a region boss 0.8, so a fresh party needs about 120 stages from Lv1 to Lv50. (A vanguard is an elite.)
 */
export const RPG_BATTLE_EXP_WEIGHTS = { fight: 0.4, 'sub-boss': 0.6, vanguard: 0.6, boss: 0.8 } as const
export const RPG_LEVEL_EXP_STEP = 0.1
export const RPG_LEVEL_EXP_MIN = 0.1
export const RPG_LEVEL_EXP_MAX = 2
/** Laurels per win, times the chapter's tier (D51; the pacing model sets them, D54). */
export const RPG_BATTLE_LAURELS = BATTLE_LAURELS
/** Uma levels that pay one Uma Shard each, in Tier 1 (design §3). */
export const RPG_SHARD_LEVELS = [10, 20, 30, 40, 50] as const

/** What a fight pays as: a Finals sub-boss is a vanguard. */
export type RpgRewardKind = keyof typeof RPG_BATTLE_EXP_WEIGHTS
export const rpgRewardKind = (node: Pick<RpgMapNode, 'kind' | 'stage'>): RpgRewardKind =>
  node.kind === 'camp' ? 'fight' : node.kind === 'sub-boss' && node.stage >= RPG_FIGHT_STAGES ? 'vanguard' : node.kind

/** A fight's EXP before the level gap: a share of one level at the foes' level. */
export function rpgBattleBaseExp(kind: RpgRewardKind, foeLevel: number): number {
  const { level } = rpgTierLevel(foeLevel)
  return Math.round(rpgExpToNext(Math.min(level, RPG_TIER_MAX_LEVEL - 1)) * RPG_BATTLE_EXP_WEIGHTS[kind])
}

/** Lower-level fights pay less, higher-level fights more: ±10% per lifetime level, from 10% to 200%. */
export function rpgLevelExpFactor(memberLevel: number, foeLevel: number): number {
  const factor = 1 - (memberLevel - foeLevel) * RPG_LEVEL_EXP_STEP
  return Math.min(RPG_LEVEL_EXP_MAX, Math.max(RPG_LEVEL_EXP_MIN, Math.round(factor * 100) / 100))
}

/** `memberLevel` is the Uma's lifetime level (Tier 1 Lv1 is 1). */
export function rpgBattleExp(kind: RpgRewardKind, foeLevel: number, memberLevel: number): number {
  return Math.max(1, Math.round(rpgBattleBaseExp(kind, foeLevel) * rpgLevelExpFactor(memberLevel, foeLevel)))
}

export function rpgBattleLaurels(kind: RpgRewardKind, tier: number): number {
  return RPG_BATTLE_LAURELS[kind] * Math.max(1, tier)
}

/** Shards for going from one level to another (Tier 1 only). */
export function rpgShardsBetween(before: number, after: number): number {
  return RPG_SHARD_LEVELS.filter((level) => before < level && after >= level).length
}
