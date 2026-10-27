// The farm by line's catalog (H109; farm-by-line.md FL5, FL14, FL15): five lines of ten grades from uma-art's families,
// every name uma-art's own, and R2's sixty ids among them at the grades R2 drew them with.
import { describe, expect, it } from 'vitest'
import { R2_TYPES } from '../save/v29.fixture'
import { isLineItemId, LINE_ITEMS, lineItem, lineItemId, lineItems, MATERIAL_LINES } from './lines'

describe('the farm by line\'s catalog (FL5)', () => {
  it('holds a hundred ids, each line ten raw then ten refined by grade, each the other form\'s pair', () => {
    expect(LINE_ITEMS).toHaveLength(100)
    expect(new Set(LINE_ITEMS.map((m) => m.id)).size).toBe(100)
    for (const line of MATERIAL_LINES) {
      const raw = lineItems(line, false), refined = lineItems(line, true)
      expect(raw.map((m) => m.grade)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
      raw.forEach((m, i) => {
        expect(m.pair).toBe(refined[i]!.id)
        expect(lineItem(m.pair)).toMatchObject({ line, grade: m.grade, refined: true, pair: m.id })
        expect(lineItemId(line, m.grade, false)).toBe(m.id)
        expect(lineItemId(line, m.grade, true)).toBe(m.pair)
      })
    }
    expect(lineItem('iron-ore')).toMatchObject({ line: 'metal', grade: 3, refined: false, pair: 'iron-ingot' })
    expect(lineItem('cut-emerald')).toMatchObject({ line: 'stone', grade: 5, refined: true })
    expect(isLineItemId('weapon-gem-g1')).toBe(false)
    expect(() => lineItemId('metal', 11, false)).toThrow(RangeError)
  })

  it('names every item as uma-art\'s `items` atlas does, frame by frame', () => {
    expect(LINE_ITEMS.map((m) => m.name)).toEqual([
    'Copper Ore', 'Tin Ore', 'Iron Ore', 'Silver Ore', 'Cobalt Ore', 'Gold Ore', 'Platinum Ore', 'Titanium Ore', 'Mythril Ore', 'Orichalcum Ore',
    'Copper Ingot', 'Tin Ingot', 'Iron Ingot', 'Silver Ingot', 'Cobalt Ingot', 'Gold Ingot', 'Platinum Ingot', 'Titanium Ingot', 'Mythril Ingot', 'Orichalcum Ingot',
    'Pine Log', 'Birch Log', 'Cedar Log', 'Maple Log', 'Oak Log', 'Cherry Log', 'Mahogany Log', 'Ebony Log', 'Elderwood Log', 'Yggdrasil Branch',
    'Pine Plank', 'Birch Plank', 'Cedar Plank', 'Maple Plank', 'Oak Plank', 'Cherry Plank', 'Mahogany Plank', 'Ebony Plank', 'Elderwood Plank', 'Yggdrasil Plank',
    'Carrot', 'Potato', 'Cabbage', 'Onion', 'Tomato', 'Bell Pepper', 'Eggplant', 'Asparagus', 'Golden Carrot', 'Emperor Pumpkin',
    'Chopped Carrot', 'Diced Potato', 'Shredded Cabbage', 'Diced Onion', 'Tomato Purée', 'Sliced Bell Pepper', 'Sliced Eggplant', 'Trimmed Asparagus', 'Golden Carrot Purée', 'Pumpkin Purée',
    'Carp', 'Trout', 'Sardine', 'Mackerel', 'Salmon', 'Sea Bream', 'Eel', 'Tuna', 'Silverfin', 'Rainbow Koi',
    'Carp Fillet', 'Trout Fillet', 'Sardine Fillet', 'Mackerel Fillet', 'Salmon Fillet', 'Sea Bream Fillet', 'Eel Fillet', 'Tuna Fillet', 'Silverfin Fillet', 'Rainbow Koi Fillet',
    'Quartz', 'Amethyst', 'Citrine', 'Garnet', 'Emerald', 'Sapphire', 'Ruby', 'Diamond', 'Starstone', "Philosopher's Stone",
    'Cut Quartz', 'Cut Amethyst', 'Cut Citrine', 'Cut Garnet', 'Cut Emerald', 'Cut Sapphire', 'Cut Ruby', 'Cut Diamond', 'Cut Starstone', "Cut Philosopher's Stone"
    ])
  })

  it('draws each from its line\'s uma-art family at its grade (FL15)', () => {
    const family = { metal: 'ores', wood: 'woods', vegetables: 'vegetables', fish: 'fish', stone: 'crystals' } as const
    for (const m of LINE_ITEMS) expect(m.art, m.id).toEqual({ family: family[m.line], grade: m.grade })
  })

  it('holds R2\'s sixty ids on their own lines and forms (save v30 moved each to its line\'s G1 or G6)', () => {
    for (const m of R2_TYPES) expect(lineItem(m.id), m.id).toMatchObject({ line: m.line, refined: m.refined })
  })
})
