import { describe, expect, it } from 'vitest'
import type { RosterOutfit, TierWorld } from '@rpg/domain'
import { crowdOf, sheetFor, withoutSheet } from './Featured'

const outfit = (outfitId: string, releasedJp: string): RosterOutfit => ({ outfitId, name: `Uma ${outfitId}`, releasedJp }) as RosterOutfit
const ROSTER = ['a', 'b', 'c', 'd', 'e', 'f', 'g'].map((id, i) => outfit(id, `2020-01-0${i + 1}`))

function world(levels: Record<string, number>, party: (string | null)[]): TierWorld {
  return {
    umas: Object.fromEntries(Object.entries(levels).map(([id, level]) => [id, { level }])),
    parties: [{ name: 'One', slots: party }],
    world: { activeParty: 0 },
  } as unknown as TierWorld
}

describe('the plaza crowd (D150)', () => {
  it('puts the featured Uma first, then the active party, then the highest levels, five at most', () => {
    const w = world({ a: 5, b: 9, c: 3, d: 7, e: 1, f: 8, g: 2 }, ['c', null, 'e', null, null])
    expect(crowdOf(w, ROSTER, 'a').map((o) => o.outfitId)).toEqual(['a', 'c', 'e', 'b', 'f'])
  })

  it('features the highest level when none is chosen, and skips Umas not owned', () => {
    const w = world({ a: 5, b: 9 }, ['z', null, null, null, null])
    expect(crowdOf(w, ROSTER, null).map((o) => o.outfitId)).toEqual(['b', 'a'])
  })

  it('opens and closes the sheet for one Uma without touching other params', () => {
    const to = sheetFor({ pathname: '/town', search: '?x=1' }, 'b')
    expect(to).toBe('/town?x=1&sheet=featured&uma=b')
    expect(withoutSheet({ pathname: '/town', search: '?x=1&sheet=featured&uma=b' })).toBe('/town?x=1')
  })
})
