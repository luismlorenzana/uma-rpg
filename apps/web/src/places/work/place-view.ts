// R2's place pages as data (profession-progression.md §4.3–§4.4, PP9, PP13, PP16; H80): what a place's What step lists
// for a world's tier and her Craft Level, the grade chips' material tiers by the ladder, and who comes first in its
// picker. Pure, so each page reads the same in every tier and the tests read it without the switch.
import {
  ANOTHER_TRADE, gradeItem, gradeUnlockLevel, jewelId, ladderTier, MATERIAL_LINES, materialGateGrade, materialTypes, placeSpecV3, tradeProfessions,
  worldMaterialTier, type MadeLine, type MaterialBand, type MaterialLine, type MaterialTier, type TradeOf,
} from '@rpg/domain'

/** A type's tile: its id (raw at a gathering place, refined at the Workbench), its tier and band, and why she can't
 * take it yet ("From Craft Lv 26"), or null. */
export interface TypeTile { id: string; line: MaterialLine; tier: MaterialTier; band: MaterialBand; locked: string | null }

const gateOf = (id: string, level: number): string | null => {
  const opens = gradeUnlockLevel(materialGateGrade(id))
  return level < opens ? `From Craft Lv ${opens}` : null
}

const tile = (id: string, line: MaterialLine, tier: MaterialTier, band: MaterialBand, level: number): TypeTile =>
  ({ id, line, tier, band, locked: gateOf(id, level) })

/** A gathering place's types: one row a tier up to the world's, its low type then its high. */
export function gatherRows(line: MaterialLine, worldTier: number, level: number): { tier: MaterialTier; tiles: TypeTile[] }[] {
  const top = worldMaterialTier(worldTier)
  return ([1, 2, 3] as const).filter((tier) => tier <= top).map((tier) => ({
    tier, tiles: materialTypes(line, tier).map((t) => tile(t.raw, line, tier, t.band, level)),
  }))
}

/** The Workbench: five columns, one a line (the Wilds' rows: metal, wood, vegetables, fish, stone), and a row per tier
 * and band up to the world's, each cell the refined type. */
export function workbenchRows(worldTier: number, level: number): { tier: MaterialTier; band: MaterialBand; cells: TypeTile[] }[] {
  const top = worldMaterialTier(worldTier)
  return ([1, 2, 3] as const).filter((tier) => tier <= top).flatMap((tier) => (['low', 'high'] as const).map((band) => ({
    tier, band, cells: MATERIAL_LINES.map((line) => tile(materialTypes(line, tier, band)[0]!.refined, line, tier, band, level)),
  })))
}

/** A made item's chip: its grade, the tier its material comes from in this world (the ladder) and its Craft Level gate. */
export interface GradeChip { id: string; grade: number; label: string; tier: MaterialTier; locked: string | null }

const chip = (id: string, grade: number, label: string, worldTier: number, level: number): GradeChip => {
  const opens = gradeUnlockLevel(grade)
  return { id, grade, label, tier: ladderTier(grade, worldTier), locked: level < opens ? `From Craft Lv ${opens}` : null }
}

/** The Forge's, the Armorer's and the Charm Shop's ten grades of a line: in a Tier 2 world G5 and G10 on Tier 2's
 * materials; in Tier 3 G4 and G9 on Tier 2's, G5 and G10 on Tier 3's. */
export function gradeChips(line: Extract<MadeLine, 'weapon-gem' | 'armor-fittings' | 'accessory-setting'>, worldTier: number, level: number): GradeChip[] {
  return Array.from({ length: 10 }, (_, i) => chip(gradeItem(line, i + 1), i + 1, String(i + 1), worldTier, level))
}

const NUMERALS = ['I', 'II', 'III', 'IV', 'V'] as const

/** The Lapidary: one row a kind, Planet I–V (grades 1, 3 … 9) and Moon I–V (2, 4 … 10), the same in every tier. */
export function jewelRows(worldTier: number, level: number): { body: 'planet' | 'moon'; label: string; chips: GradeChip[] }[] {
  return (['planet', 'moon'] as const).map((body) => ({
    body, label: body === 'planet' ? 'Planet' : 'Moon',
    chips: NUMERALS.map((numeral, i) => chip(jewelId(body, i + 1), body === 'planet' ? 2 * i + 1 : 2 * i + 2, numeral, worldTier, level)),
  }))
}

/** Whether her trade works this place: its profession is her gathering or crafting one. */
export function ofTrade(placeId: string, trade: ReturnType<TradeOf>): boolean {
  const profession = placeSpecV3(placeId)?.profession
  return trade !== null && profession !== undefined && tradeProfessions(trade).includes(profession)
}

/** Who may take a slot here (PP §4.3, PP16): her trade's Umas first; anyone else is greyed "Another trade", unless the
 * open shop holds (everyone in the first group). An Uma whose trade the caller can't say is never greyed (D208). */
export function whoAt(placeId: string, tradeOf: TradeOf, open: boolean): { first: (outfitId: string) => boolean; reason: (outfitId: string) => string | null } {
  const first = (outfitId: string) => open || ofTrade(placeId, tradeOf(outfitId))
  return {
    first,
    reason: (outfitId) => (first(outfitId) || tradeOf(outfitId) === null ? null : ANOTHER_TRADE),
  }
}

/** A gathering place's quick look: its line's raw types up to the world's tier (2 · 4 · 6 icons). */
export const peekTypes = (line: MaterialLine, worldTier: number): string[] =>
  gatherRows(line, worldTier, 50).flatMap((row) => row.tiles.map((t) => t.id))
