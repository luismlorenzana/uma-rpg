// The farm by line's raw materials at the Exchange (H111; farm-by-line.md FL12, FL23), with its switch mocked on: each
// line's ten grades, G1–G5 at 30 and G6–G10 at 80 Laurels × the tier, stocked after the first win and continent 3.
import { newTierWorld, type TierWorld } from '@rpg/domain'
import { describe, expect, it, vi } from 'vitest'
import { rawRowsV4 } from './exchange-rows'

vi.mock('../../../../../packages/domain/src/save/version', async (orig) =>
  (await import('../../../../../packages/domain/src/save/version-at.fixture')).versionAt(30, await orig()))

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
      ['copper-ore', 1, 30], ['tin-ore', 2, 30], ['iron-ore', 3, 30], ['silver-ore', 4, 30], ['cobalt-ore', 5, 30],
      ['gold-ore', 6, 80], ['platinum-ore', 7, 80], ['titanium-ore', 8, 80], ['mythril-ore', 9, 80], ['orichalcum-ore', 10, 80],
    ])
    expect(new Set(rows.map((r) => r.locked))).toEqual(new Set(['After the tier’s first win', 'After a win on continent 3']))
  })

  it('stocks G1–G5 after the first win and G6–G10 after continent 3, × the tier', () => {
    expect(rowsOf(wonOn(1), 1, 'fish').map((r) => r.locked)).toEqual([null, null, null, null, null,
      'After a win on continent 3', 'After a win on continent 3', 'After a win on continent 3', 'After a win on continent 3', 'After a win on continent 3'])
    expect(rowsOf(wonOn(3), 1, 'stone').every((r) => r.locked === null)).toBe(true)
    expect(rowsOf(wonOn(8), 2).map((r) => r.price)).toEqual([60, 60, 60, 60, 60, 160, 160, 160, 160, 160])
    expect(rowsOf({ ...wonOn(1), items: { trout: 4 } }, 1, 'fish')[1]).toMatchObject({ id: 'trout', name: 'Trout', have: 4 })
  })
})
