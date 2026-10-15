// Material symmetry (D86): every gathering family is consumed alike by crafting, and every farming family alike by
// cooking, so no site sits idle and none is a bottleneck.
import { describe, expect, it } from 'vitest'
import { ITEM_FAMILIES, itemById } from '../items/catalog'
import { RPG_CLASSES, rpgDefaultWeapons } from '../rpg/rules'
import { EQUIP_TYPES, recipeFamilies, gearById, type EquipType } from './gear'
import { DISHES } from './dishes'

const same = (counts: Record<string, number>) => new Set(Object.values(counts)).size === 1
const PHYSICAL: EquipType[] = ['helm', 'cuirass', 'greaves', 'gauntlets', 'boots'], MAGICAL: EquipType[] = ['circlet', 'robe', 'leggings', 'bracers', 'slippers']

describe('materials (D86)', () => {
  it('has every Uma use all eight gathering families about equally, whatever her class, armor or accessories (D139)', () => {
    for (const classId of RPG_CLASSES) for (const armor of [PHYSICAL, MAGICAL]) for (const accessories of [[], ['orb-fire', 'talisman-vital'], ['orb-katana', 'amulet-mirror']] as EquipType[][]) {
      const used: Record<string, number> = Object.fromEntries(ITEM_FAMILIES.filter((f) => f.side === 'gathering').map((f) => [f.id, 0]))
      for (const type of [...rpgDefaultWeapons(classId), ...armor, ...accessories] as EquipType[]) {
        for (let g = 1; g <= 10; g++) for (const [id, n] of Object.entries(gearById(`${type}-g${g}`)!.inputs)) used[itemById(id)!.family]! += n
      }
      const counts = Object.values(used), key = `${classId} ${armor[0]} +${accessories.length}`
      expect(counts.every((n) => n > 0), key).toBe(true)
      expect(Math.max(...counts) - Math.min(...counts), key).toBeLessThanOrEqual(4)
    }
    // Every recipe is two refined items of its own grade, one from each half, and nothing else (D94, D125, D139).
    for (const type of EQUIP_TYPES) for (let g = 1; g <= 10; g++) {
      const families = recipeFamilies(type, g)
      expect(Object.keys(gearById(`${type}-g${g}`)!.inputs).map((id) => [itemById(id)!.grade, itemById(id)!.family]), `${type}-g${g}`)
        .toEqual(families.map((f) => [g, f]))
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
