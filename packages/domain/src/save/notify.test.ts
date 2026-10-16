import { describe, expect, it } from 'vitest'
import { HOUR, itemMinutes, MINUTE } from '../economy/pacing'
import { unlockUma, worldOf } from './rules'
import { newSave, type Save } from './save'
import { finishesBetween, finishNotice, readySlots } from './notify'
import { queueJob, startJob, type WorkOutfit } from './work'

const T0 = Date.parse('2026-10-10T12:00:00.000Z')
const at = (ms: number) => new Date(T0 + ms).toISOString()
// An invented outfit at Craft Lv1: an item takes U, whatever its grade (D139).
const turfA: WorkOutfit = { outfitId: '101' }
const U = itemMinutes(1) * MINUTE
const give = (save: Save, items: Record<string, number>): Save => {
  const w = worldOf(save)
  return { ...save, tierWorlds: { '1': { ...w, items: { ...w.items, ...items } } } }
}

describe('finish notifications (QoL, D63)', () => {
  it('finds each job in a chain as it ends, and announces only the slot going idle', () => {
    let save = startJob(unlockUma(newSave('Luis', at(0)), '101', at(0)), 'mine', 0, turfA, 'copper-ore', 2, at(0))
    save = queueJob(save, 'mine', 0, turfA, 'copper-ore', 1, at(0))
    expect(finishesBetween(save, T0, T0 + 1.5 * U)).toEqual([])
    expect(finishesBetween(save, T0, T0 + 5 * U).map((f) => [f.at - T0, f.idle])).toEqual([[2 * U, false], [3 * U, true]])
    expect(finishNotice(finishesBetween(save, T0, T0 + 2.5 * U))).toBeNull()
    const notice = { title: 'Work done', body: 'Mine: Copper Ore ×1', tag: 'slot-mine-0', url: '/wilds/mine' }
    expect(finishNotice(finishesBetween(save, T0, T0 + 5 * U))).toEqual(notice)
    expect(readySlots(save, at(5 * U))).toBe(1)
    expect(HOUR).toBe(60 * MINUTE)
  })

  it('stays quiet about queued jobs that never started', () => {
    let save = give(unlockUma(newSave('Luis', at(0)), '101', at(0)), { 'copper-ore': 1 })
    save = startJob(save, 'workbench', 0, turfA, 'copper-ingot', 1, at(0))
    save = queueJob(save, 'workbench', 0, turfA, 'copper-ingot', 5, at(0))
    expect(finishesBetween(save, T0, T0 + HOUR).map((f) => [f.output, f.idle])).toEqual([['copper-ingot', true]])
  })
})
