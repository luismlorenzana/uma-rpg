// Material symmetry (D86): every gathering family is consumed alike by crafting, and every farming family alike by
// cooking, so no site sits idle and none is a bottleneck.
import { describe, expect, it } from 'vitest'
import { ITEM_FAMILIES, itemById } from '../items/catalog'
import { ORB_TYPES, recipeFamilies, gearById, type EquipType } from './gear'
import { DISHES } from './dishes'
import { ARMOR_PIECES, WEAPON_TYPES } from './ranks'

const tally = (types: readonly EquipType[]) => {
  const out: Record<string, number> = Object.fromEntries(ITEM_FAMILIES.filter((f) => f.side === 'gathering').map((f) => [f.id, 0]))
  for (const t of types) for (const f of recipeFamilies(t)) out[f]! += 1
  return out
}
const same = (counts: Record<string, number>) => new Set(Object.values(counts)).size === 1

describe('materials (D86)', () => {
  it('uses every gathering family alike: weapons, Orbs and armor by halves (D103)', () => {
    expect(tally([...WEAPON_TYPES, ...ORB_TYPES])).toEqual(Object.fromEntries(Object.keys(tally([])).map((k) => [k, 10])))
    expect(tally(ARMOR_PIECES)).toEqual(Object.fromEntries(Object.keys(tally([])).map((k) => [k, 4])))
    // And every recipe is four refined items of its own grade, and nothing else (D94).
    const piece = gearById('cuirass-g7-def')!
    expect(Object.entries(piece.inputs).filter(([id]) => itemById(id)?.grade === 7)).toHaveLength(4)
    expect(Object.keys(piece.inputs)).toHaveLength(4)
  })

  it('uses every farming family alike across all the dishes, which take refined items only (D105)', () => {
    const farm = ITEM_FAMILIES.filter((f) => f.side === 'farming')
    const used: Record<string, number> = Object.fromEntries(farm.map((f) => [f.id, 0]))
    for (const dish of DISHES) for (const [id, n] of Object.entries(dish.inputs)) { const item = itemById(id); if (item) used[item.family]! += n }
    expect(same(used)).toBe(true)
    expect(DISHES.every((d) => Object.keys(d.inputs).every((id) => itemById(id)?.refined))).toBe(true)
  })
})
