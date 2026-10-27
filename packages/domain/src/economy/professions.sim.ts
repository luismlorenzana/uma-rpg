// H81: R2's profession pacing ledger (profession-progression.md §5.3, §7, §8.5, §9.4; D195, D208), deterministic like
// H14's `pacing.sim.ts`: no fights, the game's own catalog, recipes and times. One Uma's demand is what a maxed Uma
// holds (three weapons, five armor slots and R2's one accessory slot at G10, the Planet and three moons' jewels, her moon's
// two with `moon`); every refined item in it is one gather of its raw type and one process at the Workbench, and a made
// item takes one gather's time a refined item in it (PP12). Hours are the manual's at Craft Lv 25's speed, before a
// place's ×1.25, as §7 states them; a roster's pace is the tightest of its trades (an Uma works her trade's two places,
// R2 has no secondary) and its places (four slots each). Test support only: nothing in the game imports it.
import { madeRecipe, madePlace } from '../items/made'
import { gradeItem, jewelId, madeIdentity } from '../items/made-id'
import { materialIdentity, type MaterialLine } from '../items/materials-id'
import { EXP_PER_MINUTE, itemMinutes, professionExpToNext, refineMinutes } from './pacing'
import { PLACE_SLOTS_V3, PLACE_SPEED_V3, PLACES_V3, professionById, TRADES, type PlaceIdV3, type TradeId } from './professions'

/** §7's yardstick: a maxed Uma's work at Craft Lv 25's manual times. */
export const LEDGER_LEVEL = 25
const HOURS_A_DAY = 24
const range = (n: number): number[] => Array.from({ length: n }, (_, i) => i + 1)

/** The made items one maxed Uma holds in R2 (§7.1): a Weapon Gem a grade on each of three weapons, Armor Fittings on five
 * slots, an Accessory Setting a grade on one slot, Planet Jewels I–V, Moon Jewels I–V on each of three moons, and with
 * `moon` her own moon's Moon Jewels II and IV. */
export function umaPieces(moon = false): Record<string, number> {
  const pieces: Record<string, number> = {}
  const add = (id: string, n: number) => { pieces[id] = (pieces[id] ?? 0) + n }
  for (const g of range(10)) { add(gradeItem('weapon-gem', g), 3); add(gradeItem('armor-fittings', g), 5); add(gradeItem('accessory-setting', g), 1) }
  for (const n of range(5)) { add(jewelId('planet', n), 1); add(jewelId('moon', n), 3) }
  if (moon) { add(jewelId('moon', 2), 1); add(jewelId('moon', 4), 1) }
  return pieces
}

/** What one maxed Uma's pieces take in a world of `tier`: refined items by id (`madeRecipe`, the ladder's pairs). */
export function umaRefined(tier: number, moon = false): Record<string, number> {
  const refined: Record<string, number> = {}
  for (const [id, n] of Object.entries(umaPieces(moon))) {
    for (const [item, qty] of Object.entries(madeRecipe(id, tier))) refined[item] = (refined[item] ?? 0) + qty * n
  }
  return refined
}

const sum = (xs: Iterable<number>): number => { let n = 0; for (const x of xs) n += x; return n }
const placeOfLine = (line: MaterialLine): PlaceIdV3 => PLACES_V3.find((p) => p.kind === 'gather' && p.line === line)!.id

/** Hours each place spends on one maxed Uma at Craft Lv 25's speed, before ×1.25: gathers at her line's place, processes
 * at the Workbench, each made item at its making place (one gather's time a refined item in it). */
export function placeHours(tier: number, moon = false): Record<PlaceIdV3, number> {
  const hours = Object.fromEntries(PLACES_V3.map((p) => [p.id, 0])) as Record<PlaceIdV3, number>
  const gather = itemMinutes(LEDGER_LEVEL) / 60, process = refineMinutes(LEDGER_LEVEL) / 60
  for (const [item, n] of Object.entries(umaRefined(tier, moon))) {
    hours[placeOfLine(materialIdentity(item)!.line)] += n * gather
    hours.workbench += n * process
  }
  for (const [id, n] of Object.entries(umaPieces(moon))) {
    const refinedEach = sum(Object.values(madeRecipe(id, tier)))
    hours[madePlace(madeIdentity(id)!.line)] += n * refinedEach * gather
  }
  return hours
}

/** A trade's two places (PP2, PP3). */
export const tradePlaceIds = (trade: TradeId): readonly [PlaceIdV3, PlaceIdV3] => {
  const t = TRADES.find((x) => x.id === trade)!
  return [professionById(t.gathering)!.place, professionById(t.crafting)!.place]
}

/** Each trade's hours on one maxed Uma and its share of hers (§7.2). */
export function tradeHours(tier: number, moon = false): Record<TradeId, { hours: number; share: number }> {
  return tradeHoursOf(placeHours(tier, moon))
}
/** Each trade's hours and share from each place's hours (the farm by line's ledger shares it, H109). */
export function tradeHoursOf(hours: Record<PlaceIdV3, number>): Record<TradeId, { hours: number; share: number }> {
  const total = sum(Object.values(hours))
  return Object.fromEntries(TRADES.map((t) => {
    const h = sum(tradePlaceIds(t.id).map((p) => hours[p]))
    return [t.id, { hours: h, share: h / total }]
  })) as Record<TradeId, { hours: number; share: number }>
}

/** A slot's work a day in manual hours: 24 real hours at the places' ×1.25. */
const slotDay = HOURS_A_DAY * PLACE_SPEED_V3
/** Maxed Umas a day one place makes with all four of its slots working (§7.3). */
export function placeSupply(tier: number, moon = false): Record<PlaceIdV3, number> {
  return placeSupplyOf(placeHours(tier, moon))
}
/** Maxed Umas a day each place makes, from each place's hours. */
export function placeSupplyOf(hours: Record<PlaceIdV3, number>): Record<PlaceIdV3, number> {
  return Object.fromEntries(PLACES_V3.map((p) => [p.id, (PLACE_SLOTS_V3 * slotDay) / hours[p.id]])) as Record<PlaceIdV3, number>
}

/** A roster's Umas by trade (the callings' split, §7.4), in `TRADES`' order: physical, physical hybrid, healer, magical
 * hybrid, magical. */
export type TradeSplit = readonly [number, number, number, number, number]
export const FORTY: TradeSplit = [9, 8, 9, 7, 7]
export const TWENTY: TradeSplit = [5, 4, 5, 3, 3]

/** Maxed Umas a day a roster makes, and what binds it (§7.4): each trade's Umas work its two places (at most their eight
 * slots), each place at most its four; the roster runs at its tightest trade or place. */
export function rosterRate(split: TradeSplit, tier: number, moon = false): { rate: number; binds: string } {
  return rosterRateOf(split, placeHours(tier, moon))
}
/** A roster's rate and what binds it, from each place's hours. */
export function rosterRateOf(split: TradeSplit, hours: Record<PlaceIdV3, number>): { rate: number; binds: string } {
  const trades = tradeHoursOf(hours)
  let rate = Infinity, binds = ''
  TRADES.forEach((t, i) => {
    const workers = Math.min(split[i]!, 2 * PLACE_SLOTS_V3)
    const own = (workers * slotDay) / trades[t.id].hours
    if (own < rate) { rate = own; binds = `${t.id} (${split[i]} Umas)` }
    for (const p of tradePlaceIds(t.id)) {
      const place = (PLACE_SLOTS_V3 * slotDay) / hours[p]
      if (place < rate) { rate = place; binds = p }
    }
  })
  return { rate, binds }
}

/** The day Craft Level reaches `level` working nonstop at ×1.25 (§5.3): its EXP at 2 a manual minute. */
export function craftDay(level: number): number {
  let exp = 0
  for (let l = 1; l < level; l++) exp += professionExpToNext(l)
  return exp / (EXP_PER_MINUTE * 60 * slotDay)
}

/** Grade g's day (§7.4): it opens at Craft Lv 5g − 4; the fighting party holds it a tenth of five maxed Umas later, a run
 * of twenty a tenth of twenty. */
export function gradeDays(split: TradeSplit = FORTY, tier = 1): { grade: number; opens: number; party: number; run: number }[] {
  return gradeDaysAt(rosterRate(split, tier).rate)
}
/** Grade g's day at a roster's rate of maxed Umas a day. */
export function gradeDaysAt(rate: number): { grade: number; opens: number; party: number; run: number }[] {
  return range(10).map((grade) => {
    const opens = craftDay(5 * grade - 4)
    return { grade, opens, party: opens + 0.5 / rate, run: opens + 2 / rate }
  })
}

/** The ledger's report (`SIM=1`): Tier 1 in full, and R2's Tier 2 and 3 worlds (one slot, no weapon moon, no Branch Gem,
 * no secondary until R3). */
export function professionsReport(): string {
  const f1 = (x: number) => x.toFixed(1), f2 = (x: number) => x.toFixed(2), pct = (x: number) => `${(100 * x).toFixed(1)}%`
  const rows: string[] = []
  for (const tier of [1, 2, 3]) {
    const refined = umaRefined(tier), withMoon = umaRefined(tier, true)
    const hours = placeHours(tier), trades = tradeHours(tier)
    rows.push(`Tier ${tier}: one Uma ${sum(Object.values(umaPieces()))} pieces, ${sum(Object.values(refined))} refined (${sum(Object.values(withMoon))} with her moon), ` +
      `${f1(sum(Object.values(hours)))} h (${f1(sum(Object.values(placeHours(tier, true))))} h) at Craft Lv ${LEDGER_LEVEL} before ×${PLACE_SPEED_V3}`)
    rows.push(`  by type: ${Object.entries(refined).map(([id, n]) => `${materialIdentity(id)!.pair} ${n}`).join(', ')}`)
    rows.push(`  trades: ${TRADES.map((t) => `${t.id} ${f1(trades[t.id].hours)} h, ${pct(trades[t.id].share)}`).join(' · ')}`)
    rows.push(`  places, maxed Umas a day: ${Object.entries(placeSupply(tier)).map(([p, n]) => `${p} ${f2(n)}`).join(' · ')}`)
    for (const [label, split] of [['forty', FORTY], ['twenty', TWENTY]] as const) {
      const r = rosterRate(split, tier)
      rows.push(`  ${label} (${split.join(' · ')}): ${f2(r.rate)} maxed Umas a day (${r.binds}); a party ${f1(5 / r.rate)} days, a run of twenty ${f1(20 / r.rate)} days`)
    }
  }
  rows.push('', 'Grade | opens (Craft Lv 5g − 4), day | the party holds it (forty) | a run of twenty holds it')
  for (const d of gradeDays()) rows.push(`G${d.grade} | ${f1(d.opens)} | ${f1(d.party)} | ${f1(d.run)}`)
  rows.push(`Lv 50 | ${f1(craftDay(50))}`)
  return rows.join('\n')
}
