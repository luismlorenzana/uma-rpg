// Material symmetry (D86): every gathering family is consumed alike by crafting, and every farming family alike by
// cooking, so no site sits idle and none is a bottleneck.
import { describe, expect, it } from 'vitest'
import { ITEM_FAMILIES, itemById } from '../items/catalog'
import { EQUIP_TYPES, recipeFamilies, gearById, type EquipType } from './gear'
import { DISHES } from './dishes'

const tally = (types: readonly EquipType[]) => {
  const out: Record<string, number> = Object.fromEntries(ITEM_FAMILIES.filter((f) => f.side === 'gathering').map((f) => [f.id, 0]))
  for (const t of types) for (const f of recipeFamilies(t)) out[f]! += 1
  return out
}
const same = (counts: Record<string, number>) => new Set(Object.values(counts)).size === 1

describe('materials (D86)', () => {
  it('uses every gathering family at every grade, the physical and magical halves mirrored (D125)', () => {
    const used = tally(EQUIP_TYPES)
    expect(Object.values(used).every((n) => n > 0)).toBe(true)
    // Each Arms family has an Arcana twin used exactly as much: Ores–Crystals, Woods–Essences, Hides–Bones, Stones–Fibers.
    expect([used.ores, used.woods, used['hides-scales'], used.stones]).toEqual([used.crystals, used.essences, used['bones-horns'], used.fibers])
    // And every recipe is two refined items of its own grade, and nothing else (D94, D125).
    for (const id of ['cuirass-g7', 'tome-ice-g7', 'talisman-iron-g7', 'amulet-veil-g7']) {
      const piece = gearById(id)!
      expect(Object.entries(piece.inputs).filter(([item]) => itemById(item)?.grade === 7), id).toHaveLength(2)
      expect(Object.keys(piece.inputs), id).toHaveLength(2)
    }
  })

  it('uses every farming family alike across all the dishes, which take refined items only (D105)', () => {
    const farm = ITEM_FAMILIES.filter((f) => f.side === 'farming')
    const used: Record<string, number> = Object.fromEntries(farm.map((f) => [f.id, 0]))
    for (const dish of DISHES) for (const [id, n] of Object.entries(dish.inputs)) { const item = itemById(id); if (item) used[item.family]! += n }
    expect(same(used)).toBe(true)
    expect(DISHES.every((d) => Object.keys(d.inputs).every((id) => itemById(id)?.refined))).toBe(true)
  })
})
