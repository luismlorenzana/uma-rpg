import { describe, expect, it } from 'vitest'
import { HOUR, itemMinutes, MINUTE } from '../economy/pacing'
import { unlockUma, worldOf } from './rules'
import { newSave, type Save } from './save'
import { finishesBetween, finishNotice, readySlots } from './notify'
import { queueJob, startJob, type WorkOutfit } from './work'

const T0 = Date.parse('2026-10-10T12:00:00.000Z')
const at = (ms: number) => new Date(T0 + ms).toISOString()
// An invented outfit, Turf A: a grade-1 item takes U.
const turfA: WorkOutfit = { outfitId: '101', aptitudes: { surface: { turf: 'A', dirt: 'G' } } }
const U = (itemMinutes(1) * MINUTE) / 2
const give = (save: Save, items: Record<string, number>): Save => {
  const w = worldOf(save)
  return { ...save, tierWorlds: { '1': { ...w, items: { ...w.items, ...items } } } }
}

describe('finish notifications (QoL, D63)', () => {
  it('finds each job in a chain as it ends, and announces only the slot going idle', () => {
    let save = startJob(unlockUma(newSave('Luis', at(0)), '101', at(0)), 'fields', 0, turfA, 'wheat', 2, at(0))
    save = queueJob(save, 'fields', 0, turfA, 'wheat', 1, at(0))
    expect(finishesBetween(save, T0, T0 + 1.5 * U)).toEqual([])
    expect(finishesBetween(save, T0, T0 + 5 * U).map((f) => [f.at - T0, f.idle])).toEqual([[2 * U, false], [3 * U, true]])
    expect(finishNotice(finishesBetween(save, T0, T0 + 2.5 * U))).toBeNull()
    const notice = { title: 'Work done', body: 'Fields: Wheat ×1', tag: 'slot-fields-0', url: '/farmlands/fields' }
    expect(finishNotice(finishesBetween(save, T0, T0 + 5 * U))).toEqual(notice)
    expect(readySlots(save, at(5 * U))).toBe(1)
    expect(HOUR).toBe(60 * MINUTE)
  })

  it('stays quiet about queued jobs that never started', () => {
    let save = give(unlockUma(newSave('Luis', at(0)), '101', at(0)), { wheat: 1 })
    save = startJob(save, 'pantry', 0, turfA, 'wheat-flour', 1, at(0))
    save = queueJob(save, 'pantry', 0, turfA, 'wheat-flour', 5, at(0))
    expect(finishesBetween(save, T0, T0 + HOUR).map((f) => [f.output, f.idle])).toEqual([['wheat-flour', true]])
  })
})
