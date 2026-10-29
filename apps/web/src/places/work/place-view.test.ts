// The place pages' picker rules (H80): who comes first with "Another trade" and the open shop. What each place lists is
// `place-view-v4.test.ts`' (the farm by line, H111, live since H112).
import { newOwnedUma, newTierWorld, openShop, tradeOfCalling, type TierWorld, type UmaCallingClass } from '@rpg/domain'
import { describe, expect, it } from 'vitest'
import { whoAt } from './place-view'

const NOW = '2026-10-25T12:00:00.000Z'

describe('who takes a slot', () => {
  const world = (callings: Record<string, UmaCallingClass>): { world: TierWorld; tradeOf: (id: string) => ReturnType<typeof tradeOfCalling> | null } => {
    const base = newTierWorld(NOW, 0)
    return {
      world: { ...base, umas: Object.fromEntries(Object.keys(callings).map((id) => [id, newOwnedUma(NOW, callings[id]!)])) },
      tradeOf: (id) => (callings[id] ? tradeOfCalling(callings[id]!) : null),
    }
  }

  it('puts her trade\'s Umas first and greys the rest "Another trade"', () => {
    const { world: w, tradeOf } = world({ 101: 'brawler', 102: 'mage', 103: 'cleric' })
    const who = whoAt('weapon-forge', tradeOf, openShop(w, 'weapon-forge', tradeOf))
    expect(['101', '102', '103'].map((id) => [who.first(id), who.reason(id)])).toEqual([[true, null], [false, 'Another trade'], [false, 'Another trade']])
    // The Fields Workbench is the healers' processing place: a Paladin and a Cleric both work it.
    const bench = whoAt('fields-workbench', tradeOf, openShop(w, 'fields-workbench', tradeOf))
    expect(bench.first('103')).toBe(true)
    // An Uma whose trade nobody can say is never greyed (D208).
    expect(who.reason('999')).toBeNull()
  })

  it('opens the shop to everyone in a world with none of its trade', () => {
    const { world: w, tradeOf } = world({ 101: 'brawler', 102: 'cleric' })
    expect(openShop(w, 'lapidary', tradeOf)).toBe(true)
    const who = whoAt('lapidary', tradeOf, true)
    expect(['101', '102'].map((id) => [who.first(id), who.reason(id)])).toEqual([[true, null], [true, null]])
  })
})
