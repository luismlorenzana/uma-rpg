// R2's raw materials at the Exchange (H80, PP17): every type of the world's tier and below, line by line, the stocked
// ones at 30 and 80 Laurels × the tier, the rest locked with the win that stocks them.
import { newTierWorld, type TierWorld } from '@rpg/domain'
import { describe, expect, it } from 'vitest'
import { rawRowsV3 } from './exchange-rows'

const NOW = '2026-10-25T12:00:00.000Z'
/** A world with a won stage on each of these continents (stage ids `w<band>-…`). */
function wonOn(...bands: number[]): TierWorld {
  const base = newTierWorld(NOW, 0)
  return { ...base, world: { ...base.world, run: { ...base.world.run, wins: Object.fromEntries(bands.map((b) => [`w${b}-1`, 1])) } } }
}
const rowsOf = (world: TierWorld, tier: number, line = 'metal') => rawRowsV3(world, tier).find((g) => g.line === line)!.rows
  .map((r) => [r.id, r.price, r.locked])

describe('the Exchange\'s raw materials', () => {
  it('locks everything before the first win, saying which win stocks it', () => {
    expect(rowsOf(wonOn(), 1)).toEqual([
      ['copper-ore', 30, 'After the tier’s first win'], ['iron-ore', 80, 'After a win on continent 3'],
    ])
  })

  it('stocks the low type after the first win and the high after continent 3', () => {
    expect(rowsOf(wonOn(1), 1)).toEqual([['copper-ore', 30, null], ['iron-ore', 80, 'After a win on continent 3']])
    expect(rowsOf(wonOn(3), 1, 'stone')).toEqual([['quartz', 30, null], ['citrine', 80, null]])
  })

  it('prices × the tier and lists a later tier\'s pair from continent 2 and 4', () => {
    expect(rowsOf(wonOn(7), 2)).toEqual([
      ['copper-ore', 60, null], ['iron-ore', 160, 'After a win on continent 3'],
      ['gold-ore', 60, null], ['titanium-ore', 160, 'After a win on continent 4'],
    ])
    expect(rawRowsV3(wonOn(), 3).map((g) => g.rows.length)).toEqual([6, 6, 6, 6, 6])
  })
})
