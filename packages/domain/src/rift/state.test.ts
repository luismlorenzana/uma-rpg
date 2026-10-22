import { describe, expect, it } from 'vitest'
import { openRiftRun, RIFT_OPEN_AT, riftLevel50s, riftOpen, type RiftRun } from './state'

const run = (n: number, ascendedAt: string | null): RiftRun => ({
  id: `t1-r${n}`, roster: [], startedAt: '2026-10-01T00:00:00.000Z', fronts: { iron: 12, arcane: 12, duel: 12, horde: 12 },
  convergence: { attempts: 1, open: null }, traces: {}, wonAt: ascendedAt ? '2026-10-02T00:00:00.000Z' : null, ascendedAt,
})
const world = (levels: number[]) => ({ umas: Object.fromEntries(levels.map((level, i) => [`${101 + i}`, { level }])) })

describe('the Rift’s selectors (H48)', () => {
  it('counts Lv 50 Umas and opens at five, in Tiers 1 and 2 only', () => {
    expect(RIFT_OPEN_AT).toBe(5)
    expect(riftLevel50s(world([50, 50, 49, 1, 50]))).toBe(3)
    expect(riftOpen(world([50, 50, 50, 50, 49]), 1)).toBe(false)
    expect(riftOpen(world([50, 50, 50, 50, 50]), 1)).toBe(true)
    expect(riftOpen(world([50, 50, 50, 50, 50]), 2)).toBe(true)
    // Tier 3's Rift waits for its fifth scenario (T9).
    expect(riftOpen(world(Array(20).fill(50)), 3)).toBe(false)
  })

  it('reads the current run: the last, until it ascends', () => {
    expect(openRiftRun({ runs: [] })).toBeNull()
    expect(openRiftRun({ runs: [run(1, '2026-10-03T00:00:00.000Z')] })).toBeNull()
    const open = run(2, null)
    expect(openRiftRun({ runs: [run(1, '2026-10-03T00:00:00.000Z'), open] })).toBe(open)
    const won = { ...run(1, null), wonAt: '2026-10-02T00:00:00.000Z' }
    expect(openRiftRun({ runs: [won] })).toBe(won)
  })
})
