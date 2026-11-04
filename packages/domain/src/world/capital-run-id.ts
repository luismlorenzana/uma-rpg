// Capital runs' ids (D293, H159), in the main bundle: a continent's nth run is `w1-run3`, which is its chapter's id too,
// and its sixteen fights are `w1-run3-l2-g1` (lane 2's General I) … `w1-run3-l4-final` (lane 4's final boss). The fights
// themselves are `capitalRunChapter` in `world/capital.ts`.
import { RPG_FINALS_LANES } from '../rpg/campaign/finals'

/** Generals a lane walks before the Final. */
export const CAPITAL_RUN_GENERALS = 3

export type CapitalRunStep = 1 | 2 | 3 | 'final'
export interface CapitalRunNode { runId: string; continentId: string; lane: number; general: 1 | 2 | 3 | null; final: boolean }

const CONTINENT = /^w[1-9]\d{0,3}$/
const RUN = /^(w[1-9]\d{0,3})-run([1-9]\d{0,8})$/
const NODE = /^(w[1-9]\d{0,3}-run[1-9]\d{0,8})-l([1-9]\d?)-(?:g([1-9])|final)$/

/** A continent's nth capital run. */
export function capitalRunId(continentId: string, n: number): string {
  if (!CONTINENT.test(continentId) || !Number.isSafeInteger(n) || n < 1 || n > 999_999_999) throw new RangeError(`Bad capital run ${continentId} ${n}`)
  return `${continentId}-run${n}`
}

/** A run id's continent and number, or null. */
export function capitalRunOf(runId: string): { continentId: string; n: number } | null {
  const m = RUN.exec(runId)
  return m ? { continentId: m[1]!, n: Number(m[2]) } : null
}

/** A run fight's node id: a lane's general (1–3) or its final boss. */
export function capitalRunNodeId(runId: string, lane: number, step: CapitalRunStep): string {
  if (!capitalRunOf(runId)) throw new RangeError(`Bad capital run ${runId}`)
  if (!Number.isInteger(lane) || lane < 1 || lane > RPG_FINALS_LANES) throw new RangeError(`Bad capital run lane ${lane}`)
  if (step !== 'final' && !(Number.isInteger(step) && step >= 1 && step <= CAPITAL_RUN_GENERALS)) throw new RangeError(`Bad capital run general ${step}`)
  return `${runId}-l${lane}-${step === 'final' ? 'final' : `g${step}`}`
}

/** Whether a chapter is a capital run's. */
export const isCapitalRunChapter = (chapter: { id: string }): boolean => RUN.test(chapter.id)

/** What a run fight's node id names, or null for any other id. */
export function capitalRunNodeOf(nodeId: string): CapitalRunNode | null {
  const m = NODE.exec(nodeId)
  if (!m) return null
  const lane = Number(m[2]), general = m[3] === undefined ? null : Number(m[3])
  if (lane > RPG_FINALS_LANES || (general !== null && general > CAPITAL_RUN_GENERALS)) return null
  return { runId: m[1]!, continentId: capitalRunOf(m[1]!)!.continentId, lane, general: general as 1 | 2 | 3 | null, final: general === null }
}
