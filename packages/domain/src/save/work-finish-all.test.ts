// "Finish all" on a place (R2, PP25; H80), on engine v17 (live since H82): the running jobs' tickets summed, each
// ⌈remaining ÷ 30 minutes⌉; finishing spends exactly that and starts each queue at once; short tickets refuse; one
// running job has no Finish all.
import { describe, expect, it } from 'vitest'
import { itemMinutes } from '../economy/pacing'
import { ECONOMY_V3_NOW, gradedUma, gradedWorld } from './economy-v3.fixture'
import { worldOf } from './rules'
import type { Save } from './save'
import { finishAllAt, finishAllCost, queueJob, startJob } from './work'


const T0 = Date.parse(ECONOMY_V3_NOW)
const at = (ms: number) => new Date(T0 + ms).toISOString()
const MIN = 60_000
/** One Craft Lv 1 gather in a slot: 54 minutes ÷ 1.25. */
const GATHER_MS = Math.round((itemMinutes(1) * 60) / 1.25) * 1000
const tickets = (ms: number) => Math.ceil(ms / (30 * MIN))

function saveWith(timeTickets: number): Save {
  const base = gradedWorld({})
  const world = gradedWorld({ wallet: { ...base.wallet, timeTickets },
    umas: Object.fromEntries(['101', '102', '103'].map((id) => [id, gradedUma({ craft: { level: 1, exp: 0 } })])) })
  return {
    schemaVersion: 30,
    account: { trainerName: 'Tester', createdAt: ECONOMY_V3_NOW, updatedAt: ECONOMY_V3_NOW, achievements: {}, history: {}, defeated: {} },
    tierWorlds: { 1: world },
  }
}

/** Three gathers at the Mine (×3, ×1, ×2) and one queued behind the second. */
function threeRunning(timeTickets: number): Save {
  let save = saveWith(timeTickets)
  save = startJob(save, 'mine', 0, { outfitId: '101' }, 'copper-ore', 3, at(0))
  save = startJob(save, 'mine', 1, { outfitId: '102' }, 'copper-ore', 1, at(0))
  save = startJob(save, 'mine', 2, { outfitId: '103' }, 'copper-ore', 2, at(0))
  return queueJob(save, 'mine', 1, { outfitId: '102' }, 'copper-ore', 1, at(0))
}

const NOW = 10 * MIN
const COST = tickets(3 * GATHER_MS - NOW) + tickets(GATHER_MS - NOW) + tickets(2 * GATHER_MS - NOW)

describe('Finish all on a place', () => {
  it('costs the sum of each running job\'s ⌈remaining ÷ 30 minutes⌉', () => {
    expect(COST).toBe(4 + 2 + 3)
    expect(finishAllCost(worldOf(threeRunning(0)), 'mine', at(NOW), 1)).toEqual({ jobs: 3, tickets: COST })
    expect(finishAllCost(worldOf(threeRunning(0)), 'forge', at(NOW), 1)).toBeNull()
  })

  it('spends exactly that and starts each queue at once', () => {
    const after = worldOf(finishAllAt(threeRunning(COST + 5), 'mine', at(NOW)))
    expect(after.wallet.timeTickets).toBe(5)
    const second = after.work['102']!
    expect(second.queue).toEqual([])
    expect(second.entries).toHaveLength(2)
    expect(second.entries.at(-1)!.startedAt).toBe(T0 + NOW)
    // The other two are done: nothing of theirs runs past now.
    expect(finishAllCost(after, 'mine', at(NOW), 1)).toBeNull()
  })

  it('refuses with the total when the tickets fall short', () => {
    expect(() => finishAllAt(threeRunning(COST - 1), 'mine', at(NOW))).toThrow(`Needs ${COST} Speed Tickets`)
  })

  it('has no Finish all with one running job', () => {
    const save = startJob(saveWith(10), 'mine', 0, { outfitId: '101' }, 'copper-ore', 1, at(0))
    expect(finishAllCost(worldOf(save), 'mine', at(NOW), 1)).toBeNull()
    expect(() => finishAllAt(save, 'mine', at(NOW))).toThrow('nothing to finish together')
  })
})
