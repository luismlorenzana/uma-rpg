// R2's materials (H77; profession-progression.md §3.3, PP7, PP8, PP13): the sixty ids exactly as the catalog's table, their
// uma-art families and grades, and the names catalog in step with the ids.
import { describe, expect, it } from 'vitest'
import { gradeUnlockLevel, itemById } from './catalog'
import { isItemId } from './identity'
import { MATERIALS, materialById, materialName } from './materials'
import {
  isMaterialId, MATERIAL_IDENTITIES, MATERIAL_TYPES, materialGateGrade, materialIdentity, materialType, materialTypes, type MaterialLine,
} from './materials-id'
import { isStockItemId } from './stock-id'

/** PP §3.3, row by row: each line's tiers, low type then high type, raw then refined. */
const TABLE: Readonly<Record<MaterialLine, readonly (readonly [string, string, string, string])[]>> = {
  metal: [['copper-ore', 'copper-ingot', 'iron-ore', 'iron-ingot'], ['gold-ore', 'gold-ingot', 'titanium-ore', 'titanium-ingot'],
    ['mythril-ore', 'mythril-ingot', 'orichalcum-ore', 'orichalcum-ingot']],
  wood: [['pine-log', 'pine-plank', 'cedar-log', 'cedar-plank'], ['cherry-log', 'cherry-plank', 'ebony-log', 'ebony-plank'],
    ['elderwood-log', 'elderwood-plank', 'yggdrasil-branch', 'yggdrasil-plank']],
  vegetables: [['carrot', 'chopped-carrot', 'cabbage', 'shredded-cabbage'], ['bell-pepper', 'sliced-bell-pepper', 'asparagus', 'trimmed-asparagus'],
    ['golden-carrot', 'golden-carrot-puree', 'emperor-pumpkin', 'pumpkin-puree']],
  fish: [['carp', 'carp-fillet', 'sardine', 'sardine-fillet'], ['sea-bream', 'sea-bream-fillet', 'tuna', 'tuna-fillet'],
    ['silverfin', 'silverfin-fillet', 'rainbow-koi', 'rainbow-koi-fillet']],
  stone: [['quartz', 'cut-quartz', 'citrine', 'cut-citrine'], ['sapphire', 'cut-sapphire', 'diamond', 'cut-diamond'],
    ['starstone', 'cut-starstone', 'philosophers-stone', 'cut-philosophers-stone']],
}
const ART_FAMILY: Readonly<Record<MaterialLine, string>> = { metal: 'ores', wood: 'woods', vegetables: 'vegetables', fish: 'fish', stone: 'crystals' }
/** PP8: Tier 1 takes its family's grades 1 and 3, Tier 2 6 and 8, Tier 3 9 and 10. */
const ART_GRADE = [[1, 3], [6, 8], [9, 10]] as const

describe('R2 materials (PP7, PP8)', () => {
  it('holds the sixty ids by line, tier, band and form exactly as the table', () => {
    expect(MATERIAL_IDENTITIES).toHaveLength(60)
    expect(new Set(MATERIAL_IDENTITIES.map((m) => m.id)).size).toBe(60)
    for (const [line, tiers] of Object.entries(TABLE) as [MaterialLine, typeof TABLE[MaterialLine]][]) {
      tiers.forEach(([lowRaw, lowRefined, highRaw, highRefined], i) => {
        const tier = i + 1
        expect(materialIdentity(lowRaw)).toEqual({ id: lowRaw, line, tier, band: 'low', refined: false, pair: lowRefined })
        expect(materialIdentity(lowRefined)).toEqual({ id: lowRefined, line, tier, band: 'low', refined: true, pair: lowRaw })
        expect(materialIdentity(highRaw)).toEqual({ id: highRaw, line, tier, band: 'high', refined: false, pair: highRefined })
        expect(materialIdentity(highRefined)).toEqual({ id: highRefined, line, tier, band: 'high', refined: true, pair: highRaw })
      })
    }
    // A world holds every tier's types up to its own: 20 · 40 · 60 ids.
    expect([1, 2, 3].map((t) => MATERIAL_IDENTITIES.filter((m) => m.tier <= t).length)).toEqual([20, 40, 60])
    expect(MATERIAL_TYPES).toHaveLength(30)
  })

  it('draws each type from its uma-art family at the grade PP8 picks', () => {
    for (const m of MATERIALS) {
      const grades = ART_GRADE[m.tier - 1]!
      expect(m.art, m.id).toEqual({ family: ART_FAMILY[m.line], grade: m.band === 'low' ? grades[0] : grades[1] })
    }
  })

  it('keeps the names catalog equal to the ids field for field, every name uma-art\'s', () => {
    expect(MATERIALS.map(({ id, line, tier, band, refined, pair }) => ({ id, line, tier, band, refined, pair }))).toEqual(MATERIAL_IDENTITIES)
    // uma-art 2.12.0's `items` atlas, frame by frame, in catalog order.
    expect(MATERIAL_IDENTITIES.map((m) => materialById(m.id)?.name)).toEqual([
      'Copper Ore', 'Copper Ingot', 'Iron Ore', 'Iron Ingot', 'Gold Ore', 'Gold Ingot', 'Titanium Ore', 'Titanium Ingot', 'Mythril Ore', 'Mythril Ingot',
      'Orichalcum Ore', 'Orichalcum Ingot',
      'Pine Log', 'Pine Plank', 'Cedar Log', 'Cedar Plank', 'Cherry Log', 'Cherry Plank', 'Ebony Log', 'Ebony Plank', 'Elderwood Log', 'Elderwood Plank',
      'Yggdrasil Branch', 'Yggdrasil Plank',
      'Carrot', 'Chopped Carrot', 'Cabbage', 'Shredded Cabbage', 'Bell Pepper', 'Sliced Bell Pepper', 'Asparagus', 'Trimmed Asparagus', 'Golden Carrot',
      'Golden Carrot Purée', 'Emperor Pumpkin', 'Pumpkin Purée',
      'Carp', 'Carp Fillet', 'Sardine', 'Sardine Fillet', 'Sea Bream', 'Sea Bream Fillet', 'Tuna', 'Tuna Fillet', 'Silverfin', 'Silverfin Fillet',
      'Rainbow Koi', 'Rainbow Koi Fillet',
      'Quartz', 'Cut Quartz', 'Citrine', 'Cut Citrine', 'Sapphire', 'Cut Sapphire', 'Diamond', 'Cut Diamond', 'Starstone', 'Cut Starstone',
      "Philosopher's Stone", "Cut Philosopher's Stone",
    ])
    expect(materialName('tin-ore')).toBeUndefined()
  })

  it('shares uma-art\'s names with the 36 legacy ids it reuses, and refuses legacy-only ids', () => {
    const shared = MATERIAL_IDENTITIES.filter((m) => isItemId(m.id))
    expect(shared).toHaveLength(36)
    expect(new Set(shared.map((m) => m.line))).toEqual(new Set(['metal', 'wood', 'stone']))
    for (const m of shared) expect(itemById(m.id)?.name, m.id).toBe(materialName(m.id))
    for (const id of ['tin-ore', 'limestone', 'birch-plank', 'garnet', 'puffbun-pelt', 'wheat', '', 'Copper Ore']) expect(isMaterialId(id), id).toBe(false)
  })

  it('opens a low type at Craft Lv 1 and a high type at Lv 26 in every tier (PP13)', () => {
    for (const m of MATERIAL_IDENTITIES) expect(gradeUnlockLevel(materialGateGrade(m.id)), m.id).toBe(m.band === 'low' ? 1 : 26)
    expect(materialGateGrade('tin-ore')).toBe(0)
  })

  it('lists types by line, tier and band', () => {
    expect(materialTypes('metal').map((t) => t.raw)).toEqual(['copper-ore', 'iron-ore', 'gold-ore', 'titanium-ore', 'mythril-ore', 'orichalcum-ore'])
    expect(materialTypes(undefined, 1, 'high').map((t) => t.refined)).toEqual(['iron-ingot', 'cedar-plank', 'shredded-cabbage', 'sardine-fillet', 'cut-citrine'])
    expect(materialType('fish', 2, 'low')).toEqual({ line: 'fish', tier: 2, band: 'low', raw: 'sea-bream', refined: 'sea-bream-fillet' })
  })

  it('takes a Warehouse id by generation: the legacy items to v16, materials and made items from v17, the Branch Gem from v18', () => {
    expect(isStockItemId('tin-ore', 16)).toBe(true)
    expect(isStockItemId('carrot', 16)).toBe(false)
    expect(isStockItemId('weapon-gem-g1', 16)).toBe(false)
    expect(isStockItemId('tin-ore', 17)).toBe(false)
    expect(isStockItemId('iron-ore', 17)).toBe(true)
    expect(['carrot', 'cut-diamond', 'weapon-gem-g10', 'armor-fittings-g1', 'accessory-setting-g7', 'jewel-planet-5', 'jewel-moon-1'].every((id) => isStockItemId(id, 17))).toBe(true)
    expect(isStockItemId('branch-gem', 17)).toBe(false)
    expect(isStockItemId('branch-gem', 18)).toBe(true)
    expect(isStockItemId('weapon-gem-g11', 17)).toBe(false)
  })
})
