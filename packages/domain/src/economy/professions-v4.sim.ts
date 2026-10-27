// H109: the farm by line's pacing ledger (D224; farm-by-line.md FL9–FL11), on H81's yardstick: one maxed Uma at Craft
// Lv 25's manual times, before a place's ×1.25. Her pieces are R2's, but her weapons split by channel: the outfits' weapon
// slots are about half Arms and half Tomes (49% Arms on D220's defaults), so she holds 1.5 Arms Gems and 1.5 Tome Ink a
// grade. Every refined item takes one equal step at its gathering place, another at its workbench, and one step per
// refined input at its making place. Trades, places, rosters and grade
// days are read with the ledger's shared math (`professions.sim.ts`). Test support only: nothing in the game imports it.
import { madeRecipeV4 } from '../items/made-v4'
import { gradeItem, jewelId } from '../items/made-id'
import { lineItem, type MaterialLine } from '../items/lines'
import { stepMinutes } from './pacing'
import { PLACES_V4 } from './places-v4'
import { FORTY, gradeDaysAt, LEDGER_LEVEL, placeSupplyOf, rosterRateOf, tradeHoursOf, TWENTY } from './professions.sim'
import { TRADES, type PlaceIdV3 } from './professions'

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
const processingOf = (line: MaterialLine): PlaceIdV3 => PLACES_V4.find((p) => p.kinds.includes('refine') && p.line === line)!.id
const makingOf = (line: MaterialLine): PlaceIdV3 => PLACES_V4.find((p) => (p.kinds.includes('craft') || p.kinds.includes('cut')) && p.line === line)!.id

/** Hours each place spends on one maxed Uma at Craft Lv 25's speed, before ×1.25 (FL10, FL11). */
export function placeHoursV4(moon = false): Record<PlaceIdV3, number> {
  const hours = Object.fromEntries(PLACES_V4.map((p) => [p.id, 0])) as Record<PlaceIdV3, number>
  const step = stepMinutes(LEDGER_LEVEL) / 60
  for (const [item, n] of Object.entries(umaRefinedV4(moon))) {
    const line = lineItem(item)!.line
    hours[gatheringOf(line)] += n * step
    hours[processingOf(line)] += n * step
  }
  for (const [id, n] of Object.entries(umaPiecesV4(moon))) {
    const [item, qty] = Object.entries(madeRecipeV4(id))[0] as [string, number]
    hours[makingOf(lineItem(item)!.line)] += n * qty * step
  }
  return hours
}

/** The ledger's report (`SIM=1`): one Uma's demand and hours, each trade and place, rosters and grade days. */
export function professionsReport(): string {
  const f1 = (x: number) => x.toFixed(1), f2 = (x: number) => x.toFixed(2), pct = (x: number) => `${(100 * x).toFixed(1)}%`
  const total = (r: Record<string, number>) => Object.values(r).reduce((a, b) => a + b, 0)
  const hours = placeHoursV4(), trades = tradeHoursOf(hours)
  const rows = [
    `One Uma: ${total(umaPiecesV4())} pieces, ${total(umaRefinedV4())} refined (${total(umaRefinedV4(true))} with her moon), ` +
      `${f1(total(hours))} h (${f1(total(placeHoursV4(true)))} h) at Craft Lv ${LEDGER_LEVEL} before ×1.25`,
    `  by line: ${Object.entries(umaRefinedByLine()).map(([line, n]) => `${line} ${n}`).join(', ')}`,
    `  trades: ${TRADES.map((t) => `${t.id} ${f1(trades[t.id].hours)} h, ${pct(trades[t.id].share)}`).join(' · ')}`,
    `  places, maxed Umas a day: ${Object.entries(placeSupplyOf(hours)).map(([p, n]) => `${p} ${f2(n)}`).join(' · ')}`,
  ]
  for (const [label, split] of [['forty', FORTY], ['twenty', TWENTY]] as const) {
    const r = rosterRateOf(split, hours)
    rows.push(`  ${label} (${split.join(' · ')}): ${f2(r.rate)} maxed Umas a day (${r.binds}); a party ${f1(5 / r.rate)} days, a run of twenty ${f1(20 / r.rate)} days`)
  }
  rows.push('', 'Grade | opens (Craft Lv 5g − 4), day | the party holds it (forty) | a run of twenty holds it')
  for (const d of gradeDaysAt(rosterRateOf(FORTY, hours).rate)) rows.push(`G${d.grade} | ${f1(d.opens)} | ${f1(d.party)} | ${f1(d.run)}`)
  return rows.join('\n')
}
