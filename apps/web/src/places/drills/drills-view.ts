// The Drills page's words (D283, H154; collections.md §7.5): the day's runs, each Drill's row and the Logs sheet's counts.
// Pure, so the page and its tests read the same lines.
import { DRILL_COUNT, DRILL_LOGS, DRILL_NUMERALS, drillId, RPG_TIER_MAX_LEVEL, rpgTierLevel, type DrillsState } from '@rpg/domain'
import { drillsOn, logsToLevel } from '@rpg/domain/drills'

/** "Runs 18 · +10 at 4:00", or "Runs 30 · full". */
export function runsLine(drills: DrillsState | undefined, today: string): string {
  const { runs } = drillsOn(drills, today)
  return runs >= 30 ? `Runs ${runs} · full` : `Runs ${runs} · +10 at 4:00`
}

export interface DrillRow { n: number; name: string; level: string; logs: string; won: boolean }

/** The five rows: "Drill III · Lv 30", "4 Logs a win", won or not. */
export function drillRows(drills: DrillsState | undefined, levels: readonly number[]): DrillRow[] {
  return Array.from({ length: DRILL_COUNT }, (_, i) => {
    const at = rpgTierLevel(levels[i] ?? 10 * (i + 1))
    return { n: i + 1, name: `Drill ${DRILL_NUMERALS[i]}`, level: `${at.tier === 1 ? '' : `T${at.tier} `}Lv ${at.level}`,
      logs: `${DRILL_LOGS[i]} Logs a win`, won: !!drills?.won[drillId(i + 1)] }
  })
}

export interface LogCount { key: string; label: string; count: number }

/** 1, 5, 10, To Lv n (the next multiple of ten, when the world holds that many) and Max, each no more than she can take or
 * the world holds. */
export function logCounts(level: number, exp: number, held: number): LogCount[] {
  if (level >= RPG_TIER_MAX_LEVEL || held < 1) return []
  const room = logsToLevel(level, exp, RPG_TIER_MAX_LEVEL)
  const most = Math.min(room, held)
  const target = Math.min(RPG_TIER_MAX_LEVEL, (Math.floor(level / 10) + 1) * 10)
  // "To Lv n" only when the world holds enough to get there.
  const toTarget = logsToLevel(level, exp, target)
  const out: LogCount[] = [1, 5, 10].filter((n) => n <= most).map((n) => ({ key: String(n), label: String(n), count: n }))
  if (toTarget > 0 && toTarget <= held && !out.some((c) => c.count === toTarget)) out.push({ key: 'to', label: `To Lv ${target}`, count: toTarget })
  if (!out.some((c) => c.count === most)) out.push({ key: 'max', label: 'Max', count: most })
  return out
}
