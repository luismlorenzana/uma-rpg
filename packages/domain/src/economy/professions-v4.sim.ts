// H109: the farm by line's pacing ledger (D224; farm-by-line.md FL9–FL11), on H81's yardstick: one maxed Uma at Craft
// Lv 25's manual times, before a place's ×1.25. Her pieces are R2's, but her weapons split by channel: the outfits' weapon
// slots are about half Arms and half Tomes (49% Arms on D220's defaults), so she holds 1.5 Arms Gems and 1.5 Tome Ink a
// grade. Every refined item costs one gather at its line's gathering place and a quarter at its making place (processing);
// each made item three quarters of a gather a refined item in it at its making place. Trades, places, rosters and grade
// days are read with R2's ledger (`professions.sim.ts`). Test support only: nothing in the game imports it.
import { madeRecipeV4 } from '../items/made-v4'
import { gradeItem, jewelId } from '../items/made-id'
import { lineItem } from '../items/lines'
import { itemMinutes, MAKE_SHARE_V4, refineMinutes } from './pacing'
import { PLACES_V4 } from './places-v4'
import { LEDGER_LEVEL } from './professions.sim'
import type { PlaceIdV3 } from './professions'
import type { MaterialLine } from '../items/materials-id'

const range = (n: number): number[] => Array.from({ length: n }, (_, i) => i + 1)

/** The made items one maxed Uma holds under the farm by line (FL9): a grade's 1.5 Arms Gems and 1.5 Tome Ink, 5 Armor
 * Fittings and an Accessory Setting, Planet Jewels I–V, Moon Jewels I–V on each of three moons, and with `moon` her own
 * moon's Moon Jewels II and IV. */
export function umaPiecesV4(moon = false): Record<string, number> {
  const pieces: Record<string, number> = {}
  const add = (id: string, n: number) => { pieces[id] = (pieces[id] ?? 0) + n }
  for (const g of range(10)) {
    add(gradeItem('weapon-gem', g), 1.5); add(gradeItem('tome-ink', g), 1.5); add(gradeItem('armor-fittings', g), 5); add(gradeItem('accessory-setting', g), 1)
  }
  for (const n of range(5)) { add(jewelId('planet', n), 1); add(jewelId('moon', n), 3) }
  if (moon) { add(jewelId('moon', 2), 1); add(jewelId('moon', 4), 1) }
  return pieces
}

/** What one maxed Uma's pieces take: refined items by id. */
export function umaRefinedV4(moon = false): Record<string, number> {
  const refined: Record<string, number> = {}
  for (const [id, n] of Object.entries(umaPiecesV4(moon))) {
    for (const [item, qty] of Object.entries(madeRecipeV4(id))) refined[item] = (refined[item] ?? 0) + qty * n
  }
  return refined
}

/** Her refined items by line (FL9's last column). */
export function umaRefinedByLine(moon = false): Record<MaterialLine, number> {
  const out: Record<MaterialLine, number> = { metal: 0, wood: 0, vegetables: 0, fish: 0, stone: 0 }
  for (const [id, n] of Object.entries(umaRefinedV4(moon))) out[lineItem(id)!.line] += n
  return out
}

const gatheringOf = (line: MaterialLine): PlaceIdV3 => PLACES_V4.find((p) => p.kinds.includes('gather') && p.line === line)!.id
const makingOf = (line: MaterialLine): PlaceIdV3 => PLACES_V4.find((p) => p.kinds.includes('refine') && p.line === line)!.id

/** Hours each place spends on one maxed Uma at Craft Lv 25's speed, before ×1.25 (FL10, FL11). */
export function placeHoursV4(moon = false): Record<PlaceIdV3, number> {
  const hours = Object.fromEntries(PLACES_V4.map((p) => [p.id, 0])) as Record<PlaceIdV3, number>
  const gather = itemMinutes(LEDGER_LEVEL) / 60, process = refineMinutes(LEDGER_LEVEL) / 60
  for (const [item, n] of Object.entries(umaRefinedV4(moon))) {
    const line = lineItem(item)!.line
    hours[gatheringOf(line)] += n * gather
    hours[makingOf(line)] += n * process
  }
  for (const [id, n] of Object.entries(umaPiecesV4(moon))) {
    const [item, qty] = Object.entries(madeRecipeV4(id))[0]!
    hours[makingOf(lineItem(item)!.line)] += n * qty * gather * MAKE_SHARE_V4
  }
  return hours
}
