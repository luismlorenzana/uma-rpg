// The farm by line's place pages as data (D224; farm-by-line.md FL2, FL5, FL6, FL16, FL22; H111): what a gathering
// place's and a making place's What step list for her Craft Level, each job's kind and sizes, the (i)'s lines and the
// quick look. Pure, so the page and the tests read the same; shown only when `farmByLine()` (H112).
import {
  gradeItem, gradeUnlockLevel, isLineItemId, isMakingPlaceV4, isProcessingPlaceV4, jewelId, jobKindV4, jobSizes, lineItems, madeRefinedV4, placeSpecV4,
  type JobKind, type MadeLine, type MaterialLine,
} from '@rpg/domain'
import { LINE_WORD } from '../../items/v3-words'

/** A raw or refined tile: its id, grade and why she can't take it yet ("From Craft Lv 11"), or null. */
export interface LineTile { id: string; grade: number; locked: string | null }
/** A made item's chip: its id, grade, its label ("3", or a jewel's numeral) and its gate. */
export interface MadeChip { id: string; grade: number; label: string; locked: string | null }
export interface MadeGroup { key: string; label: string | null; chips: MadeChip[] }

const gate = (grade: number, level: number): string | null => {
  const opens = gradeUnlockLevel(grade)
  return level < opens ? `From Craft Lv ${opens}` : null
}
const tiles = (line: MaterialLine, refined: boolean, level: number): LineTile[] =>
  lineItems(line, refined).map((m) => ({ id: m.id, grade: m.grade, locked: gate(m.grade, level) }))

/** A gathering place's ten raw tiles, G1–G10 (FL22). */
export const gatherTilesV4 = (line: MaterialLine, level: number): LineTile[] => tiles(line, false, level)
/** A workbench's ten refined tiles to process, G1–G10. */
export const processTilesV4 = (line: MaterialLine, level: number): LineTile[] => tiles(line, true, level)

const NUMERALS = ['I', 'II', 'III', 'IV', 'V'] as const
const GRADED: ReadonlySet<MadeLine> = new Set(['weapon-gem', 'tome-ink', 'armor-fittings', 'accessory-setting'])

/** A making place's groups: its item's ten grades, or the Lapidary's Planet I–V (grades 1, 3 … 9) and Moon I–V (2,
 * 4 … 10). The Branch Gem waits for R3. */
export function makeGroupsV4(placeId: string, level: number): MadeGroup[] {
  const place = placeSpecV4(placeId)
  if (!place || !isMakingPlaceV4(place)) return []
  if (place.made.includes('jewel-planet')) {
    return (['planet', 'moon'] as const).map((body) => ({
      key: body, label: body === 'planet' ? 'Planet' : 'Moon',
      chips: NUMERALS.map((numeral, i) => {
        const grade = body === 'planet' ? 2 * i + 1 : 2 * i + 2
        return { id: jewelId(body, i + 1), grade, label: numeral, locked: gate(grade, level) }
      }),
    }))
  }
  const line = place.made.find((m) => GRADED.has(m)) as 'weapon-gem' | 'tome-ink' | 'armor-fittings' | 'accessory-setting'
  return [{
    key: line, label: null,
    chips: Array.from({ length: 10 }, (_, i) => ({ id: gradeItem(line, i + 1), grade: i + 1, label: String(i + 1), locked: gate(i + 1, level) })),
  }]
}

/** A job's kind at a place: by its item under the farm by line. */
export const jobKindAtV4 = (placeId: string, id: string): JobKind => jobKindV4(placeId, id) ?? placeSpecV4(placeId)?.kinds[0] ?? 'gather'

/** The sizes a job offers (D233), about half an hour to about 8 hours: ×1 … ×20 to gather or process; a make's by its
 * refined items, so an Arms Gem ×1, ×2 or ×3. */
export const jobSizesV4 = (item: string): number[] => jobSizes(isLineItemId(item) ? 1 : madeRefinedV4(item))

/** What the sheet opens on: the highest grade she can take of the place's one kind. */
export function initialJobV4(placeId: string, level: number): string {
  const place = placeSpecV4(placeId)!
  const open = <T extends { id: string; locked: string | null }>(list: readonly T[]): string => (list.filter((t) => t.locked === null).at(-1) ?? list[0]!).id
  if (isProcessingPlaceV4(place)) return open(processTilesV4(place.line, level))
  if (!isMakingPlaceV4(place)) return open(gatherTilesV4(place.line, level))
  return open(makeGroupsV4(placeId, level).flatMap((g) => g.chips).sort((a, b) => a.grade - b.grade))
}

const MADE_WORDS: Readonly<Record<string, string>> = {
  'weapon-forge': 'Arms Gems from Ingots',
  'tome-forge': 'Tome Ink from vegetable cuts',
  armorer: 'Armor Fittings from Planks',
  'charm-forge': 'Accessory Settings from Fillets',
  lapidary: 'Planet and Moon Jewels from cut stones',
}

/** The (i)'s lines (FL16). */
export function helpLinesV4(placeId: string): string[] {
  const place = placeSpecV4(placeId)!
  const shop = 'Her trade’s Umas work here. In a world with none of them, anyone may: the open shop.'
  if (isProcessingPlaceV4(place)) return [`Processes ${LINE_WORD[place.line].toLowerCase()}’s raw items into refined ones, one for one. Grade g opens at Craft Lv 5g − 4.`, shop]
  if (isMakingPlaceV4(place)) return [`Makes ${MADE_WORDS[placeId]}, one step for each refined item in it. Grade g opens at Craft Lv 5g − 4.`, shop]
  return [`Gathers ${LINE_WORD[place.line].toLowerCase()}, G1–G10. Grade g opens at Craft Lv 5g − 4.`, shop]
}

/** The quick look: a gather or process place's ten icons; a making place's chips. */
export function peekV4(placeId: string): { icons: string[] } | { chips: MadeChip[] } {
  const place = placeSpecV4(placeId)!
  if (isProcessingPlaceV4(place)) return { icons: processTilesV4(place.line, 50).map((t) => t.id) }
  if (!isMakingPlaceV4(place)) return { icons: gatherTilesV4(place.line, 50).map((t) => t.id) }
  return { chips: makeGroupsV4(placeId, 50).flatMap((g) => g.chips) }
}
