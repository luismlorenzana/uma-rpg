// A window's record in the save (collections.md §8, D283): kept small, because the save is one document. Each step is
// three base-36 characters in the catalog's order, the day it lit as days since 2026-01-01 (UTC), `---` while dark.
// World steps light on won capital runs (v37). No save import here, so `save.ts` can parse it without a cycle.
import { WINDOW_STEP_IDS, WINDOW_STEPS_MAX, type WindowStepId } from '../rpg/windows'

export interface WindowRecord {
  /** `WINDOW_STEPS_MAX` × 3 characters. */
  steps: string
}

/** The account's windows: by outfit id, then by tier key ("1", "2"…). */
export type WindowRecords = Record<string, Record<string, WindowRecord>>

const EPOCH = Date.UTC(2026, 0, 1)
const DAY = 86_400_000
export const WINDOW_DARK = '---'
export const WINDOW_CODE = /^(?:---|[0-9a-z]{3})$/
export const WINDOW_STEPS_LENGTH = WINDOW_STEPS_MAX * 3
export const emptyWindow = (): WindowRecord => ({ steps: WINDOW_DARK.repeat(WINDOW_STEPS_MAX) })

/** The day a time falls on, as the record's code. */
export function dayCode(now: string): string {
  const days = Math.max(0, Math.floor((Date.parse(now) - EPOCH) / DAY))
  return days.toString(36).padStart(3, '0')
}

/** A code's day, `YYYY-MM-DD` (UTC), or null while dark. */
export const codeDay = (code: string): string | null =>
  code === WINDOW_DARK ? null : new Date(EPOCH + parseInt(code, 36) * DAY).toISOString().slice(0, 10)

const indexOf = (id: WindowStepId): number => WINDOW_STEP_IDS.indexOf(id)

/** A step's code in a record. */
export const stepCode = (record: WindowRecord, id: WindowStepId): string => record.steps.slice(indexOf(id) * 3, indexOf(id) * 3 + 3)

/** The day a step lit, or null. */
export const stepDay = (record: WindowRecord, id: WindowStepId): string | null => codeDay(stepCode(record, id))

/** The record with these steps lit on `now`'s day; a step already lit keeps its day. The same object when none is new. */
export function withSteps(record: WindowRecord, ids: Iterable<WindowStepId>, now: string, code = dayCode(now)): WindowRecord {
  let steps = record.steps
  for (const id of ids) {
    const i = indexOf(id) * 3
    if (steps.slice(i, i + 3) !== WINDOW_DARK) continue
    steps = steps.slice(0, i) + code + steps.slice(i + 3)
  }
  return steps === record.steps ? record : { ...record, steps }
}

/** A save v35 record's steps (31) as v36's (D289): the five Weapons steps at the end, dark, or, when every v35 step was
 * lit (a full window, an ascended Uma's among them), lit on its latest day so a full window stays full. */
export function widenSteps(steps: unknown): unknown {
  const v35 = WINDOW_STEP_IDS.indexOf('rift') + 1
  if (typeof steps !== 'string' || steps.length !== v35 * 3) return steps
  const codes = Array.from({ length: v35 }, (_, i) => steps.slice(3 * i, 3 * i + 3))
  const last = codes.every((c) => c !== WINDOW_DARK) ? codes.reduce((a, b) => (parseInt(b, 36) > parseInt(a, 36) ? b : a)) : WINDOW_DARK
  return steps + last.repeat(WINDOW_STEPS_MAX - v35)
}

/** Whether a string is a well-formed record's steps. */
export function validSteps(steps: unknown): steps is string {
  if (typeof steps !== 'string' || steps.length !== WINDOW_STEPS_LENGTH) return false
  for (let i = 0; i < steps.length; i += 3) if (!WINDOW_CODE.test(steps.slice(i, i + 3))) return false
  return true
}
