// Achievements' words on screen (H49): a seal or "Rift Conquered" with its tier, a run by its tier and number.
import type { AchievementDef } from '@rpg/domain'

/** "Iron Seal · Tier 1"; a title by its name alone. */
export const achievementTitle = (def: AchievementDef): string => def.tier === null ? def.name : `${def.name} · Tier ${def.tier}`

/** `t1-r2` → "Tier 1 run 2". */
export function runLabel(runId: string): string {
  const m = /^t(\d+)-r(\d+)$/.exec(runId)
  return m ? `Tier ${m[1]} run ${m[2]}` : runId
}

/** "21 Oct", in the phone's time zone. */
export const shortDate = (at: string): string => new Date(at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
