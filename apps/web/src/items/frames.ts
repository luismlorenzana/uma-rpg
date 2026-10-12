// Where an icon sits on the shared atlases (@luismlorenzana/uma-art, P37–P38), computed from the catalog's own order so
// the indexes never ship in the main chunk; frames.test.ts pins every position against them.
import { DISHES, gearById, ITEM_FAMILIES, itemById, type EquipType, type ItemEffect, type RpgDamageKind } from '@rpg/domain'

export const ATLAS_CELL = 32
export type Sheet = 'items' | 'dishes' | 'gear'
export const SHEET_SIZE: Readonly<Record<Sheet, { w: number; h: number }>> = {
  items: { w: 320, h: 1024 },
  dishes: { w: 320, h: 320 },
  gear: { w: 320, h: 1088 },
}

/** `kind`: a badge for pieces drawn with another type's art (a Tome's element, an Orb's kind). */
export interface IconFrame { sheet: Sheet; x: number; y: number; accent?: ItemEffect; kind?: RpgDamageKind }
/** The gear atlas' rows (uma-art 2.1.0): D86's ten weapons (H03), the retired pre-D103 armor rows, Ring and Charm, the ten
 * Orbs, and D103's eight armor pieces (H27). Every type the game crafts has its own row. */
export const GEAR_ART_ROWS = ['greatsword', 'axe', 'lance', 'bow', 'katana', 'tome-fire', 'tome-ice', 'tome-lightning', 'tome-light', 'tome-dark',
  'garb', 'leather', 'mail', 'plate', 'ring', 'charm', 'orb-greatsword', 'orb-axe', 'orb-lance', 'orb-bow', 'orb-katana', 'orb-fire', 'orb-ice',
  'orb-lightning', 'orb-light', 'orb-dark', 'helm', 'cuirass', 'greaves', 'gauntlets', 'circlet', 'robe', 'leggings', 'bracers'] as const
export function gearArt(type: EquipType): { row: (typeof GEAR_ART_ROWS)[number]; kind?: RpgDamageKind } {
  return { row: type as (typeof GEAR_ART_ROWS)[number] }
}

const ITEM_ROW = new Map(ITEM_FAMILIES.map((f, i) => [f.id, i * 2]))
const FARM_ROW = new Map(ITEM_FAMILIES.filter((f) => f.side === 'farming').map((f, i) => [f.id, i]))
const DISH_FRAMES = new Map<string, IconFrame>()
{
  // Planet dishes: one row per farming family, grades across. Then Duo dishes and Feasts, ten to a row.
  let k = 0
  for (const d of DISHES) {
    if (d.kind === 'planet') {
      const row = FARM_ROW.get(d.id.slice('dish-'.length, d.id.lastIndexOf('-')))
      if (row !== undefined) DISH_FRAMES.set(d.id, { sheet: 'dishes', x: (d.grade - 1) * ATLAS_CELL, y: row * ATLAS_CELL })
    } else {
      DISH_FRAMES.set(d.id, { sheet: 'dishes', x: (k % 10) * ATLAS_CELL, y: (FARM_ROW.size + Math.floor(k / 10)) * ATLAS_CELL })
      k++
    }
  }
}

/** An item, dish or gear piece's icon; gear carries its accent for the corner mark. */
export function iconFrame(id: string): IconFrame | null {
  const item = itemById(id)
  if (item) {
    const row = ITEM_ROW.get(item.family)
    return row === undefined ? null : { sheet: 'items', x: (item.grade - 1) * ATLAS_CELL, y: (row + (item.refined ? 1 : 0)) * ATLAS_CELL }
  }
  const dish = DISH_FRAMES.get(id)
  if (dish) return dish
  const piece = gearById(id)
  if (piece) {
    const art = gearArt(piece.type)
    return { sheet: 'gear', x: (piece.grade - 1) * ATLAS_CELL, y: GEAR_ART_ROWS.indexOf(art.row) * ATLAS_CELL, ...(piece.accent ? { accent: piece.accent } : {}),
      ...(art.kind ? { kind: art.kind } : {}) }
  }
  return null
}

/** The accent mark's colour per effect (the gear atlas leaves its bottom-right 9×9 clear for it). */
export const ACCENT_COLOR: Readonly<Record<ItemEffect, string>> = {
  hp: '#e2504f', mp: '#4c8df0', atk: '#f08a35', matk: '#a66ff2', def: '#a3b0c2', mdef: '#33c2b0', speed: '#7cd650', limit: '#f4cb45',
}
