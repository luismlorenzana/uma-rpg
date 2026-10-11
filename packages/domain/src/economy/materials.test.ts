// Material symmetry (D86): every gathering family is consumed alike by crafting, and every farming family alike by
// cooking, so no site sits idle and none is a bottleneck.
import { describe, expect, it } from 'vitest'
import { ITEM_FAMILIES, itemById } from '../items/catalog'
import { ACCESSORY_TYPES, ORB_TYPES, recipeFamilies, gearById, type EquipType } from './gear'
import { DISHES } from './dishes'
import { ARMOR_TYPES, WEAPON_TYPES } from './training'

const tally = (types: readonly EquipType[]) => {
  const out: Record<string, number> = Object.fromEntries(ITEM_FAMILIES.filter((f) => f.side === 'gathering').map((f) => [f.id, 0]))
  for (const t of types) for (const f of recipeFamilies(t)) out[f]! += 1
  return out
}
const same = (counts: Record<string, number>) => new Set(Object.values(counts)).size === 1

describe('materials (D86)', () => {
  it('uses every gathering family alike: weapons and Orbs by halves, armor twice each, stat accessories once each', () => {
    expect(tally([...WEAPON_TYPES, ...ORB_TYPES])).toEqual(Object.fromEntries(Object.keys(tally([])).map((k) => [k, 10])))
    expect(same(tally(ARMOR_TYPES))).toBe(true)
    expect(Object.values(tally(ARMOR_TYPES))[0]).toBe(2)
    expect(tally(ACCESSORY_TYPES.filter((t) => t === 'ring' || t === 'charm'))).toEqual(Object.fromEntries(Object.keys(tally([])).map((k) => [k, 1])))
    // And every recipe is four refined items of its own grade plus one Crafting Token.
    const piece = gearById('plate-g7-def')!
    expect(Object.entries(piece.inputs).filter(([id]) => itemById(id)?.grade === 7)).toHaveLength(4)
    expect(Object.keys(piece.inputs).filter((id) => id.startsWith('token-craft-'))).toEqual(['token-craft-def-4'])
  })

  it('uses every farming family alike across all the dishes', () => {
    const farm = ITEM_FAMILIES.filter((f) => f.side === 'farming')
    const used: Record<string, number> = Object.fromEntries(farm.map((f) => [f.id, 0]))
    for (const dish of DISHES) for (const [id, n] of Object.entries(dish.inputs)) { const item = itemById(id); if (item) used[item.family]! += n }
    expect(same(used)).toBe(true)
  })
})
