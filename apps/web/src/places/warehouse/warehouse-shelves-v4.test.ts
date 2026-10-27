// The Warehouse under the farm by line (H111; farm-by-line.md FL16, FL23), with its switch mocked on: materials carry
// their grades (so the kit's grade chips filter every shelf), each line raw then refined by grade, Tome Ink on Made
// items after the Arms Gems, and the words.
import { newTierWorld } from '@rpg/domain'
import { describe, expect, it, vi } from 'vitest'
import { madeUse, materialFacts, materialPair } from '../../items/v3-words'
import { warehouseView } from './warehouse-shelves'

vi.mock('../../../../../packages/domain/src/save/version', async (orig) =>
  (await import('../../../../../packages/domain/src/save/version-at.fixture')).versionAt(30, await orig()))

describe('the Warehouse by grade (FL23)', () => {
  it('grades every material, orders each line raw then refined by grade, and puts Tome Ink after the Arms Gems', () => {
    const world = { ...newTierWorld('2026-10-25T12:00:00.000Z', 0), items: {
      'iron-ingot': 3, 'tin-ore': 2, 'copper-ore': 5, trout: 4, 'tome-ink-g2': 1, 'weapon-gem-g1': 2, 'armor-fittings-g1': 1,
    } }
    const view = warehouseView(world)
    const metal = view.items.filter((i) => i.shelf === 'metal')
    expect(metal.map((i) => [i.id, i.grade, i.group])).toEqual([['copper-ore', 1, 'metal-raw'], ['tin-ore', 2, 'metal-raw'], ['iron-ingot', 3, 'metal-refined']])
    expect(view.items.find((i) => i.id === 'trout' && i.shelf === 'fish')).toMatchObject({ name: 'Trout', grade: 2, line: 'Fish · G2 · raw' })
    expect(view.items.filter((i) => i.shelf === 'made').map((i) => [i.id, i.name])).toEqual([
      ['weapon-gem-g1', 'Arms Gem G1'], ['tome-ink-g2', 'Tome Ink G2'], ['armor-fittings-g1', 'Armor Fittings G1'],
    ])
    expect(view.header).toBe('14 materials · 4 made items')
  })

  it('says a material\'s line and grade, and what Arms Gems and Tome Ink raise (FL16)', () => {
    expect(materialFacts('iron-ingot')).toBe('Metal · G3 · refined')
    expect(materialPair('diced-potato')).toBe('Refined from Potato')
    expect(madeUse('weapon-gem-g3')).toBe('Raises an Arms weapon one grade')
    expect(madeUse('tome-ink-g3')).toBe('Raises a Tome one grade')
  })
})
