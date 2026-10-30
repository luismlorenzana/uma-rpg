// The farm by line's raw materials at the Exchange (H111; farm-by-line.md FL12, FL23): each
// line's ten grades, G1–G5 at 30 and G6–G10 at 80 Laurels × the tier, stocked after the first win and continent 3.
import { newTierWorld, type TierWorld } from '@rpg/domain'
import { describe, expect, it } from 'vitest'
import { rawRowsV4 } from './exchange-rows'

const NOW = '2026-10-25T12:00:00.000Z'
function wonOn(...bands: number[]): TierWorld {
  const base = newTierWorld(NOW, 0)
  return { ...base, world: { ...base.world, run: { ...base.world.run, wins: Object.fromEntries(bands.map((b) => [`w${b}-1`, 1])) } } }
}
const rowsOf = (world: TierWorld, tier: number, line = 'metal') => rawRowsV4(world, tier).find((g) => g.line === line)!.rows

describe('the Exchange\'s raw materials by grade (FL12)', () => {
  it('lists each line\'s ten grades, locked until stocked', () => {
    const rows = rowsOf(wonOn(), 1)
    expect(rows.map((r) => [r.id, r.grade, r.price])).toEqual([
      ['copper-ore', 1, 20], ['tin-ore', 2, 20], ['iron-ore', 3, 20], ['silver-ore', 4, 20], ['cobalt-ore', 5, 20],
      ['gold-ore', 6, 53], ['platinum-ore', 7, 53], ['titanium-ore', 8, 53], ['mythril-ore', 9, 53], ['orichalcum-ore', 10, 53],
    ])
    expect(new Set(rows.map((r) => r.locked))).toEqual(new Set(['After the tier’s first win', 'After a win on continent 3']))
  })

  it('stocks G1–G5 after the first win and G6–G10 after continent 3, × the tier', () => {
    expect(rowsOf(wonOn(1), 1, 'fish').map((r) => r.locked)).toEqual([null, null, null, null, null,
      'After a win on continent 3', 'After a win on continent 3', 'After a win on continent 3', 'After a win on continent 3', 'After a win on continent 3'])
    expect(rowsOf(wonOn(3), 1, 'stone').every((r) => r.locked === null)).toBe(true)
    expect(rowsOf(wonOn(8), 2).map((r) => r.price)).toEqual([40, 40, 40, 40, 40, 106, 106, 106, 106, 106])
    expect(rowsOf({ ...wonOn(1), items: { trout: 4 } }, 1, 'fish')[1]).toMatchObject({ id: 'trout', name: 'Trout', have: 4 })
  })
})
