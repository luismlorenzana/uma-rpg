// The Warehouse's shelves (H80): R2's two, Materials (line by line, raw then refined, tier by tier, no grade) and Made
// items (the grade lines, then the jewels), with the header's totals; v1's three unchanged.
import { newTierWorld, type TierWorld } from '@rpg/domain'
import { describe, expect, it } from 'vitest'
import { warehouseView } from './warehouse-shelves'

const NOW = '2026-10-25T12:00:00.000Z'
const world = (items: Record<string, number>, extra: Partial<TierWorld> = {}): TierWorld => ({ ...newTierWorld(NOW, 0), items, ...extra })

describe('R2\'s Warehouse', () => {
  const view = warehouseView(world({
    'jewel-moon-2': 1, 'cut-quartz': 4, 'iron-ingot': 3, 'gold-ore': 2, 'copper-ore': 100, 'pine-log': 11, 'weapon-gem-g5': 30,
    'jewel-planet-3': 2, 'armor-fittings-g1': 2,
  }), true)

  it('has Materials and Made items, and their totals', () => {
    expect(view.shelves).toEqual([{ key: 'materials', label: 'Materials' }, { key: 'made', label: 'Made items' }])
    expect(view.header).toBe('120 materials · 35 made items')
  })

  it('orders materials by line, raw then refined, tier by tier, each with its tier and band', () => {
    const materials = view.items.filter((i) => i.shelf === 'materials')
    expect(materials.map((i) => [i.id, i.line, i.grade])).toEqual([
      ['copper-ore', 'Tier 1 · low · raw', null], ['gold-ore', 'Tier 2 · low · raw', null], ['iron-ingot', 'Tier 1 · high · refined', null],
      ['pine-log', 'Tier 1 · low · raw', null], ['cut-quartz', 'Tier 1 · low · refined', null],
    ])
    expect(materials.every((i) => i.sell === 'items')).toBe(true)
  })

  it('orders made items by line and grade, then Planet and Moon Jewels', () => {
    const made = view.items.filter((i) => i.shelf === 'made')
    expect(made.map((i) => [i.name, i.grade, i.line])).toEqual([
      ['Weapon Gem G5', 5, 'Grade 5 · Raises a weapon one grade'],
      ['Armor Fittings G1', 1, 'Grade 1 · Raises an armor piece one grade'],
      ['Planet Jewel III', 5, 'Opens Planet III'],
      ['Moon Jewel II', 4, 'Opens a moon’s node II'],
    ])
  })
})

describe('v1\'s Warehouse', () => {
  it('keeps its three shelves, its order and its header', () => {
    const view = warehouseView(world({ 'iron-ore': 2 }, { gems: { 'gem-hp-1': 1 }, gear: { 'greatsword-g1': 3 } }), false)
    expect(view.shelves.map((s) => s.label)).toEqual(['Materials', 'Star Gems', 'Gear'])
    expect(view.items.map((i) => [i.shelf, i.id, i.count])).toEqual([['items', 'iron-ore', 2], ['gems', 'gem-hp-1', 1], ['gear', 'greatsword-g1', 3]])
    expect(view.header).toBe('2 items · 1 Star Gems · 3 unbound gear')
  })
})
