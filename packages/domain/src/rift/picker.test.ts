import { describe, expect, it } from 'vitest'
import type { EnemyTier, Franchise, RosterMember } from '../world/roster'
import { riftChain, riftConvergence, riftFight, type RiftContext, type RiftFightPlan } from './generate'
import { riftShape, type RiftFace } from './fronts'
import { RIFT_FRANCHISE_WEIGHTS, RIFT_RUN_FIGHTS, riftEchoFaces, riftRunFaces, riftShapeOf } from './picker'
import { packRoster } from './roster.fixture'
import { RIFT_FRONTS, riftRefKey } from './state'

const roster = packRoster()
const byId = new Map(roster.map((m) => [m.id, m]))
const tierOf = (id: string): EnemyTier => byId.get(id)!.tier!
/** A run's faces in allocation order, with each one's tier. */
const runFaces = (r: readonly RosterMember[], runId: string, defeated: ReadonlySet<string> = new Set()): string[] => {
  const faces = riftRunFaces(r, 1, runId, defeated)
  return RIFT_RUN_FIGHTS.flatMap((ref) => [...faces.get(riftRefKey(ref))!])
}
const plans = (c: RiftContext): RiftFightPlan[] => [...RIFT_FRONTS.flatMap((f) => riftChain(c, f)), ...riftConvergence(c)]

describe('the Rift\'s faces (H47)', () => {
  it('fills a run\'s 52 fights with a face for every foe, from the slot\'s tier', () => {
    const c: RiftContext = { tier: 1, runId: 't1-r1', roster, defeated: new Set() }
    for (const plan of plans(c)) {
      for (const e of [plan.enemies, ...(plan.waves ?? [])].flat()) expect(byId.has(e.castId)).toBe(true)
    }
    const faces = runFaces(roster, 't1-r1')
    const count = (tier: EnemyTier) => faces.filter((id) => tierOf(id) === tier).length
    // Every slot takes a face of its own tier, as many as the shapes hold (46 boss and 64 sub-boss slots since H51).
    const slots = RIFT_RUN_FIGHTS.flatMap((ref) => { const { front, stage } = riftShapeOf(ref); return riftShape(front, stage).flat() })
    const want = (face: RiftFace) => slots.filter((s) => s.face === face).length
    expect([count('boss'), count('subboss'), count('key')]).toEqual([want('boss'), want('subboss'), want('key')])
  })

  it('never repeats a boss or sub-boss face in a run while unused ones remain', () => {
    const faces = runFaces(roster, 't1-r1')
    for (const tier of ['boss', 'subboss'] as const) {
      const list = faces.filter((id) => tierOf(id) === tier)
      expect(new Set(list).size).toBe(list.length)
    }
    // A small pack runs out and starts over: a face comes back only once every face of its tier has shown.
    const small = roster.filter((m) => m.tier !== 'boss' || Number(m.id.split('-').at(-1)) <= 6)
    const bosses = runFaces(small, 't1-r1').filter((id) => byId.get(id)!.tier === 'boss')
    const total = small.filter((m) => m.tier === 'boss').length
    expect(total).toBe(18)
    const seen = new Set<string>()
    bosses.forEach((id, i) => {
      if (seen.has(id)) expect(new Set(bosses.slice(0, i)).size, `boss ${i}`).toBe(total)
      seen.add(id)
    })
  })

  it('splits boss and sub-boss slots by pack within 5 points of 40 / 37 / 23', () => {
    for (const runId of ['t1-r1', 't1-r2', 't2-r1']) {
      const faces = runFaces(roster, runId)
      for (const tier of ['boss', 'subboss'] as const) {
        const list = faces.filter((id) => tierOf(id) === tier)
        for (const [franchise, weight] of Object.entries(RIFT_FRANCHISE_WEIGHTS) as [Franchise, number][]) {
          const share = (100 * list.filter((id) => byId.get(id)!.franchise === franchise).length) / list.length
          expect(Math.abs(share - weight), `${runId} ${tier} ${franchise}`).toBeLessThanOrEqual(5)
        }
      }
    }
  })

  it('uses every boss not yet defeated before a defeated one', () => {
    const bosses = roster.filter((m) => m.tier === 'boss').map((m) => m.id).sort()
    // Half defeated: a run's boss slots (46) take only undefeated ones.
    const half = new Set(bosses.filter((_, i) => i % 2 === 0))
    expect(runFaces(roster, 't1-r3', half).filter((id) => tierOf(id) === 'boss').some((id) => half.has(id))).toBe(false)
    // All but 15 defeated: the run's first 15 bosses are exactly those 15.
    const most = new Set(bosses.filter((_, i) => i % 9 !== 0))
    const fresh = bosses.filter((id) => !most.has(id))
    expect(fresh).toHaveLength(15)
    const used = runFaces(roster, 't1-r3', most).filter((id) => tierOf(id) === 'boss')
    expect(new Set(used.slice(0, 15))).toEqual(new Set(fresh))
  })

  it('never repeats a face within a fight', () => {
    const faces = riftRunFaces(roster, 1, 't1-r1', new Set())
    for (const list of faces.values()) expect(new Set(list).size).toBe(list.length)
    // Even with a small roster whose tiers start over many times, as long as each holds a fight's worth (15 keys).
    const tiny = roster.filter((m) => Number(m.id.split('-').at(-1)) <= 5)
    for (const list of riftRunFaces(tiny, 1, 't1-r1', new Set()).values()) expect(new Set(list).size).toBe(list.length)
  })

  it('borrows from the nearest tier when one is empty', () => {
    const noKeys = roster.filter((m) => m.tier !== 'key')
    const plan = riftFight({ tier: 1, runId: 't1-r1', roster: noKeys, defeated: new Set() }, { kind: 'front', front: 'horde', stage: 1 })
    for (const e of [plan.enemies, ...(plan.waves ?? [])].flat()) expect(['subboss', 'boss']).toContain(tierOf(e.castId))
    const plain = [{ id: 'a', name: 'A' }, { id: 'b', name: 'B' }, { id: 'c', name: 'C' }]
    const ids = riftFight({ tier: 1, runId: 't1-r1', roster: plain, defeated: new Set() }, { kind: 'front', front: 'iron', stage: 1 }).enemies.map((e) => e.castId)
    expect(ids).toHaveLength(riftShape('iron', 1).flat().length)
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) expect(['a', 'b', 'c']).toContain(id)
  })

  it('keeps an Echo\'s faces whatever the account has defeated', () => {
    const ref = { kind: 'echo', front: 'iron', level: '50' } as const
    const defeated = new Set(roster.filter((m) => m.tier === 'boss' || m.tier === 'subboss').map((m) => m.id).slice(0, 150))
    const fresh = riftFight({ tier: 1, runId: null, roster, defeated: new Set() }, ref)
    expect(riftFight({ tier: 1, runId: 't1-r4', roster, defeated }, ref)).toEqual(fresh)
    expect(riftEchoFaces(roster, 1, ref)).toEqual([fresh.enemies, ...(fresh.waves ?? [])].flat().map((e) => e.castId))
  })

  it('throws on an empty roster', () => {
    expect(() => riftRunFaces([], 1, 't1-r1', new Set())).toThrow(RangeError)
    expect(() => riftEchoFaces([], 1, { kind: 'echo', front: 'duel', level: '45' })).toThrow(RangeError)
  })
})
