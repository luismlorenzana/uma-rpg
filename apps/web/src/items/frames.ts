// Where an icon sits on the shared atlases (@luismlorenzana/uma-art, P37–P38), computed from the catalog's own order so
// the indexes never ship in the main chunk; frames.test.ts pins every position against them.
import {
  gearById, GEM_IDENTITIES, ITEM_FAMILIES, lineItem, madeIdentity, itemById,
  type AccessorySlotState, type EquipType, type RpgDamageKind,
} from '@rpg/domain'

export const ATLAS_CELL = 32
export type Sheet = 'items' | 'gear' | 'gems'
export const SHEET_SIZE: Readonly<Record<Sheet, { w: number; h: number }>> = {
  // uma-art 2.13.0 appends R2's made items after the racer rows; no earlier frame moves.
  items: { w: 320, h: 1216 },
  gear: { w: 320, h: 1472 },
  gems: { w: 320, h: 320 },
}

/** `kind`: a badge for pieces drawn with another type's art (a Tome's element, an Orb's kind). */
export interface IconFrame { sheet: Sheet; x: number; y: number; kind?: RpgDamageKind }
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

/** uma-art keeps sixteen rows for uma-racer's families first; the eight Wilds families follow, a raw and a refined
 * row each, in catalog order. Utility items append below them without moving any material row. */
const WILDS_FIRST_ROW = 16
const ITEM_ROW = new Map(ITEM_FAMILIES.map((f, i) => [f.id, WILDS_FIRST_ROW + i * 2]))
const GEM_POSITION = new Map(GEM_IDENTITIES.map((g, i) => [g.id, { x: i % 10 * ATLAS_CELL, y: Math.floor(i / 10) * ATLAS_CELL }]))

const MATERIAL_ROW = { fish: 4, vegetables: 8, ores: 20, crystals: 22, woods: 28 } as const
/** The made items' rows; Tome Ink (the farm by line, FL15) borrows uma-art's essences refined row, the infusion bottles. */
const MADE_ROW = { 'weapon-gem': 34, 'armor-fittings': 35, 'accessory-setting': 36, 'tome-ink': 19 } as const
const PLANET_JEWEL_ART = ['gem-sun-4', 'gem-sun-4', 'gem-sun-6', 'gem-sun-8', 'gem-sun-10'] as const
const MOON_JEWEL_ART = ['gem-limit-2', 'gem-limit-4', 'gem-limit-6', 'gem-limit-8', 'gem-limit-10'] as const
const BELL_ROW: Readonly<Record<RpgDamageKind, (typeof GEAR_ART_ROWS)[number]>> = {
  greatsword: 'talisman-vital', axe: 'talisman-vampire', lance: 'talisman-bulwark', bow: 'talisman-iron', katana: 'talisman-thorn',
  fire: 'amulet-spring', ice: 'amulet-siphon', lightning: 'amulet-veil', light: 'amulet-ward', dark: 'amulet-mirror',
}

/** A synthetic id consumed only by `ItemIcon`; the save keeps the slot as structured data. */
export function accessoryIconId(slot: AccessorySlotState | undefined): string {
  if (!slot || slot.grade < 1 || slot.family === null) return 'accessory-form:none:g0'
  return `accessory-form:${slot.family}:${slot.kind ?? 'none'}:g${slot.grade}`
}

function accessoryFrame(id: string): IconFrame | null | undefined {
  if (!id.startsWith('accessory-form:')) return undefined
  const [, family, kindWord, gradeWord] = id.split(':')
  const grade = Number(gradeWord?.slice(1))
  if (!family || !Number.isInteger(grade) || grade < 1 || grade > 10) return null
  const kind = kindWord !== 'none' ? kindWord as RpgDamageKind : undefined
  const row = family === 'pendant' ? 'charm' : family === 'insignia' ? 'ring'
    : family === 'orb' && kind ? `orb-${kind}` as (typeof GEAR_ART_ROWS)[number]
      : family === 'bell' && kind ? BELL_ROW[kind] : undefined
  if (!row) return null
  return { sheet: 'gear', x: (grade - 1) * ATLAS_CELL, y: GEAR_ART_ROWS.indexOf(row) * ATLAS_CELL, ...(kind ? { kind } : {}) }
}

/** An item, gear piece or Star Gem's own icon. H29's gem sheet follows GEM_IDENTITIES, ten across. */
export function iconFrame(id: string): IconFrame | null {
  const accessory = accessoryFrame(id)
  if (accessory !== undefined) return accessory
  // A line item (the Wilds' hundred, D224): its family's row at its grade.
  const line = lineItem(id)
  if (line) return {
    sheet: 'items', x: (line.art.grade - 1) * ATLAS_CELL,
    y: (MATERIAL_ROW[line.art.family] + (line.refined ? 1 : 0)) * ATLAS_CELL,
  }
  const made = madeIdentity(id)
  if (made) {
    if (made.line === 'branch-gem') return { sheet: 'items', x: 0, y: 1184 }
    if (made.line === 'jewel-planet' || made.line === 'jewel-moon') {
      const art = (made.line === 'jewel-planet' ? PLANET_JEWEL_ART : MOON_JEWEL_ART)[Math.ceil(made.grade / 2) - 1]!
      const gem = GEM_POSITION.get(art)
      return gem ? { sheet: 'gems', ...gem } : null
    }
    const row = MADE_ROW[made.line]
    return { sheet: 'items', x: (made.grade - 1) * ATLAS_CELL, y: row * ATLAS_CELL }
  }
  const gem = GEM_POSITION.get(id)
  if (gem) return { sheet: 'gems', ...gem }
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
