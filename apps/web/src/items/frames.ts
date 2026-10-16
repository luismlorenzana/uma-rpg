// Where an icon sits on the shared atlases (@luismlorenzana/uma-art, P37–P38), computed from the catalog's own order so
// the indexes never ship in the main chunk; frames.test.ts pins every position against them.
import { gearById, gemIdentity, ITEM_FAMILIES, itemById, type EquipType, type ItemEffect, type RpgDamageKind } from '@rpg/domain'

export const ATLAS_CELL = 32
export type Sheet = 'items' | 'gear'
export const SHEET_SIZE: Readonly<Record<Sheet, { w: number; h: number }>> = {
  items: { w: 320, h: 1024 },
  gear: { w: 320, h: 1472 },
}

/** `kind`: a badge for pieces drawn with another type's art (a Tome's element, an Orb's kind). `planets`: a Star Gem's
 * badge, the planets it feeds (all eight for a Sun gem). */
export interface IconFrame { sheet: Sheet; x: number; y: number; kind?: RpgDamageKind; planets?: readonly ItemEffect[] }
/** uma-art 2.5.0: published rows stay fixed, including retired armor/Ring/Charm. H28 appends dedicated feet,
 * Talisman and Amulet rows, so every current gear type uses its own art. */
export const GEAR_ART_ROWS = ['greatsword', 'axe', 'lance', 'bow', 'katana', 'tome-fire', 'tome-ice', 'tome-lightning', 'tome-light', 'tome-dark',
  'garb', 'leather', 'mail', 'plate', 'ring', 'charm', 'orb-greatsword', 'orb-axe', 'orb-lance', 'orb-bow', 'orb-katana', 'orb-fire', 'orb-ice',
  'orb-lightning', 'orb-light', 'orb-dark', 'helm', 'cuirass', 'greaves', 'gauntlets', 'circlet', 'robe', 'leggings', 'bracers',
  'boots', 'slippers', 'talisman-vital', 'talisman-vampire', 'talisman-bulwark', 'talisman-iron', 'talisman-thorn',
  'amulet-spring', 'amulet-siphon', 'amulet-veil', 'amulet-ward', 'amulet-mirror'] as const
export function gearArt(type: EquipType): { row: (typeof GEAR_ART_ROWS)[number]; kind?: RpgDamageKind } {
  return { row: type }
}

/** uma-art 2.5.0's items atlas keeps sixteen rows for uma-racer's families first; the eight Wilds families follow, a raw
 * and a refined row each, in catalog order. */
const WILDS_FIRST_ROW = 16
const ITEM_ROW = new Map(ITEM_FAMILIES.map((f, i) => [f.id, WILDS_FIRST_ROW + i * 2]))

/** An item, gear piece or Star Gem's icon. A Star Gem borrows its grade's cut crystal and wears its planets' badge (D144)
 * until H29 draws its own. */
export function iconFrame(id: string): IconFrame | null {
  const gem = gemIdentity(id)
  if (gem) {
    const crystal = ITEM_FAMILIES.find((f) => f.id === 'crystals')!.refined[gem.grade - 1]!
    return { ...iconFrame(crystal.id)!, planets: gem.effects }
  }
  const item = itemById(id)
  if (item) {
    const row = ITEM_ROW.get(item.family)
    return row === undefined ? null : { sheet: 'items', x: (item.grade - 1) * ATLAS_CELL, y: (row + (item.refined ? 1 : 0)) * ATLAS_CELL }
  }
  const piece = gearById(id)
  if (piece) {
    const art = gearArt(piece.type)
    return { sheet: 'gear', x: (piece.grade - 1) * ATLAS_CELL, y: GEAR_ART_ROWS.indexOf(art.row) * ATLAS_CELL, ...(art.kind ? { kind: art.kind } : {}) }
  }
  return null
}
