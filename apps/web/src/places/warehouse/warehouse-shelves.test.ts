// The Warehouse's icon shelves (H106): every held stack on All and its own shelf, ordered by material/made line, with
// domain grades and highest-grade groups ready for the shared ShelfView.
import { newTierWorld, type TierWorld } from '@rpg/domain'
import { describe, expect, it } from 'vitest'
import { warehouseView } from './warehouse-shelves'

const NOW = '2026-10-25T12:00:00.000Z'
const world = (items: Record<string, number>, extra: Partial<TierWorld> = {}): TierWorld => ({ ...newTierWorld(NOW, 0), items, ...extra })

describe('the Warehouse icon grid', () => {
  const view = warehouseView(world({
    'jewel-moon-2': 1, 'cut-quartz': 4, 'iron-ingot': 3, 'gold-ore': 2, 'copper-ore': 100, 'pine-log': 11, 'weapon-gem-g5': 30,
    'jewel-planet-3': 2, 'armor-fittings-g1': 2,
  }))

  it('has All, five material lines and Made items, and keeps the header totals unique', () => {
    expect(view.shelves).toEqual([
      { key: 'all', label: 'All' }, { key: 'metal', label: 'Metal' }, { key: 'wood', label: 'Wood' },
      { key: 'vegetables', label: 'Vegetables' }, { key: 'fish', label: 'Fish' }, { key: 'stone', label: 'Stone' },
      { key: 'made', label: 'Made items' },
    ])
    expect(view.header).toBe('120 materials · 35 made items')
  })

  it('puts every held stack on All and its line shelf or Made items with the same id and stock data', () => {
    const shelves = new Map<string, string>([
      ['copper-ore', 'metal'], ['gold-ore', 'metal'], ['iron-ingot', 'metal'], ['pine-log', 'wood'], ['cut-quartz', 'stone'],
      ['weapon-gem-g5', 'made'], ['armor-fittings-g1', 'made'], ['jewel-planet-3', 'made'], ['jewel-moon-2', 'made'],
    ])
    for (const [id, shelf] of shelves) {
      const copies = view.items.filter((i) => i.id === id)
      expect(copies.map((i) => i.shelf)).toEqual(['all', shelf])
      expect(copies[1]).toEqual({ ...copies[0]!, shelf })
    }
  })

  it('orders materials by line, raw then refined, by grade, each with its grade (FL23)', () => {
    const materials = view.items.filter((i) => i.shelf === 'metal' || i.shelf === 'wood' || i.shelf === 'stone')
    expect(materials.map((i) => [i.id, i.line, i.grade, i.group])).toEqual([
      ['copper-ore', 'Metal · G1 · raw', 1, 'metal-raw'], ['gold-ore', 'Metal · G6 · raw', 6, 'metal-raw'],
      ['iron-ingot', 'Metal · G3 · refined', 3, 'metal-refined'], ['pine-log', 'Wood · G1 · raw', 1, 'wood-raw'],
      ['cut-quartz', 'Stone · G1 · refined', 1, 'stone-refined'],
    ])
    expect(materials.every((i) => i.sell === 'items')).toBe(true)
  })

  it('orders made items by line and grade, then Planet and Moon Jewels, with one group per line', () => {
    const made = view.items.filter((i) => i.shelf === 'made')
    expect(made.map((i) => [i.name, i.grade, i.line, i.group])).toEqual([
      ['Arms Gem G5', 5, 'Grade 5 · Raises an Arms weapon one grade', 'weapon-gem'],
      ['Armor Fittings G1', 1, 'Grade 1 · Raises an armor piece one grade', 'armor-fittings'],
      ['Planet Jewel III', 5, 'Opens Planet III', 'jewel-planet'],
      ['Moon Jewel II', 4, 'Opens a moon’s node II', 'jewel-moon'],
    ])
  })

  it('keeps every shelf when the Warehouse is empty', () => {
    expect(warehouseView(world({}))).toEqual({
      shelves: [
        { key: 'all', label: 'All' }, { key: 'metal', label: 'Metal' }, { key: 'wood', label: 'Wood' },
        { key: 'vegetables', label: 'Vegetables' }, { key: 'fish', label: 'Fish' }, { key: 'stone', label: 'Stone' },
        { key: 'made', label: 'Made items' },
      ],
      items: [],
      header: '0 materials · 0 made items',
    })
  })
})
