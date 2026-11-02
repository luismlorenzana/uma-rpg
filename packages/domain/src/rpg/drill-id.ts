// Drills' ids, numbers and day (D283, H154), in the main bundle; the fights themselves are `rpg/drills.ts`, behind
// `@rpg/domain/drills`.

export const DRILL_COUNT = 5
/** Logs a win, Drill I to V. */
export const DRILL_LOGS = [2, 3, 4, 5, 6] as const
export const DRILL_NUMERALS = ['I', 'II', 'III', 'IV', 'V'] as const

/** `drill-1` … `drill-5`: the save's key for a Drill's first win. */
export const drillId = (n: number): string => `drill-${n}`
/** The fight's node id: a Drill of a tier. */
export const drillNodeId = (tier: number, n: number): string => `drill-t${tier}-${n}`
export const drillChapterId = (tier: number): string => `drills-t${tier}`
export const isDrillChapter = (chapter: { id: string }): boolean => /^drills-t\d+$/.test(chapter.id)
/** Which Drill a node id is, 1–5, or null. */
export function drillOfNode(nodeId: string): number | null {
  const m = /^drill-t\d+-([1-5])$/.exec(nodeId)
  return m ? Number(m[1]) : null
}

/** The Drills' day on the phone's clock: it turns at 04:00, as `YYYY-MM-DD`. */
export function drillDay(now: Date): string {
  const shifted = new Date(now.getTime() - 4 * 3_600_000)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${shifted.getFullYear()}-${pad(shifted.getMonth() + 1)}-${pad(shifted.getDate())}`
}

/** Whole days from one day key to a later one (0 for the same day or an earlier one). */
export function daysBetween(from: string, to: string): number {
  const ms = Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)
  return Number.isFinite(ms) && ms > 0 ? Math.round(ms / 86_400_000) : 0
}
