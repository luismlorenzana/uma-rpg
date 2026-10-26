import { describe, expect, it, vi } from 'vitest'
import { HOUR, itemMinutes, MINUTE } from '../economy/pacing'
import { unlockUma, worldOf } from './rules'
import { newSave, type Save } from './save'
import { finishesBetween, finishNotice, readyEverywhere, readySlots, tierNotices } from './notify'
import { TIER2_UMAS, withTierTwo } from './tiers.fixture'
import { queueJob, startJob, type WorkOutfit } from './work'

// The v1 economy's rules, kept as the old game's record since R2's switch (H82, D218): this file runs as the game before
// it, the switch at engine 16 (today's facilities, crafted pieces, Star Gems and gear ranks) and old saves read through
// the chain to v27.
vi.mock('../rpg/battle/caps', async (orig) => (await import('../rpg/battle/caps-at.fixture')).capsAt(16, await orig()))
vi.mock('./migrations', async (orig) => { const m = await orig<typeof import('./migrations')>(); return { ...m, migrateWorld: m.migrateWorldToV27 } })

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
    const notice = { title: 'Work done', body: 'Mine: Copper Ore ×1', tag: 'slot-mine-0', url: '/wilds/mine?tier=1' }
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

describe('notifications across tier worlds (H35)', () => {
  // Tier 1's Mine works with 101 and Tier 2's (a synthetic world) with 201, one Copper Ore each.
  const tier2: WorkOutfit = { outfitId: TIER2_UMAS[0] }
  const both = (tier1Job: boolean): Save => {
    let save = withTierTwo(unlockUma(newSave('Luis', at(0)), '101', at(0)), at(0))
    if (tier1Job) save = startJob(save, 'mine', 0, turfA, 'copper-ore', 1, at(0))
    return startJob(save, 'mine', 0, tier2, 'copper-ore', 1, at(0), '2')
  }

  it('links a Tier 2 finish to ?tier=2 and names its tier when the save has two worlds', () => {
    const save = both(false)
    expect(tierNotices(save, T0, T0 + 2 * U)).toEqual([
      { title: 'Tier 2 · Work done', body: 'Mine: Copper Ore ×1', tag: 't2-slot-mine-0', url: '/wilds/mine?tier=2' },
    ])
    expect(finishNotice(finishesBetween(save, T0, T0 + 2 * U, '2'), 2, true)?.url).toBe('/wilds/mine?tier=2')
  })

  it('gives one notice per world with news, in tier order, and a badge that counts both', () => {
    const save = both(true)
    expect(tierNotices(save, T0, T0 + 2 * U).map((n) => [n.title, n.url])).toEqual([
      ['Tier 1 · Work done', '/wilds/mine?tier=1'], ['Tier 2 · Work done', '/wilds/mine?tier=2'],
    ])
    expect(readySlots(save, at(2 * U))).toBe(1)
    expect(readySlots(save, at(2 * U), '2')).toBe(1)
    expect(readyEverywhere(save, at(2 * U))).toBe(2)
  })

  it('keeps a one-world save’s titles free of tiers', () => {
    const save = startJob(unlockUma(newSave('Luis', at(0)), '101', at(0)), 'mine', 0, turfA, 'copper-ore', 1, at(0))
    const notices = tierNotices(save, T0, T0 + 2 * U)
    expect(notices).toHaveLength(1)
    expect(notices[0]!.title).toBe('Work done')
    expect(notices.some((n) => n.title.includes('Tier'))).toBe(false)
    expect(readyEverywhere(save, at(2 * U))).toBe(readySlots(save, at(2 * U)))
  })
})
