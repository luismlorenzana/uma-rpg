// The profession pacing ledger's shared math (H81; profession-progression.md §5.3, §7; D195, D208): a slot's day, a
// trade's and a place's hours, maxed Umas a day for a roster, and when a grade opens and is held. The farm by line's
// ledger (`professions-v4.sim.ts`, H109; live since H112) feeds it each place's hours on one maxed Uma at Craft Lv 25's
// manual times, before a place's ×1.25. Test support only: nothing in the game imports it.
import { EXP_PER_MINUTE, professionExpToNext } from './pacing'
import { PLACE_IDS_V3, PLACE_SLOTS_V3, PLACE_SPEED_V3, professionById, TRADES, type PlaceIdV3, type TradeId } from './professions'

/** §7's yardstick: a maxed Uma's work at Craft Lv 25's manual times. */
export const LEDGER_LEVEL = 25
const HOURS_A_DAY = 24
const range = (n: number): number[] => Array.from({ length: n }, (_, i) => i + 1)
const sum = (xs: Iterable<number>): number => { let n = 0; for (const x of xs) n += x; return n }

/** A trade's two places (PP2, PP3). */
export const tradePlaceIds = (trade: TradeId): readonly [PlaceIdV3, PlaceIdV3] => {
  const t = TRADES.find((x) => x.id === trade)!
  return [professionById(t.gathering)!.place, professionById(t.crafting)!.place]
}

/** Each trade's hours and share from each place's hours (§7.2). */
export function tradeHoursOf(hours: Record<PlaceIdV3, number>): Record<TradeId, { hours: number; share: number }> {
  const total = sum(Object.values(hours))
  return Object.fromEntries(TRADES.map((t) => {
    const h = sum(tradePlaceIds(t.id).map((p) => hours[p]))
    return [t.id, { hours: h, share: h / total }]
  })) as Record<TradeId, { hours: number; share: number }>
}

/** A slot's work a day in manual hours: 24 real hours at the places' ×1.25. */
const slotDay = HOURS_A_DAY * PLACE_SPEED_V3
/** Maxed Umas a day each place makes with all four of its slots working (§7.3). */
export function placeSupplyOf(hours: Record<PlaceIdV3, number>): Record<PlaceIdV3, number> {
  return Object.fromEntries(PLACE_IDS_V3.map((p) => [p, (PLACE_SLOTS_V3 * slotDay) / hours[p]])) as Record<PlaceIdV3, number>
}

/** A roster's Umas by trade (the callings' split, §7.4), in `TRADES`' order: physical, physical hybrid, healer, magical
 * hybrid, magical. */
export type TradeSplit = readonly [number, number, number, number, number]
export const FORTY: TradeSplit = [9, 8, 9, 7, 7]
export const TWENTY: TradeSplit = [5, 4, 5, 3, 3]

/** Maxed Umas a day a roster makes, and what binds it (§7.4): each trade's Umas work its two places (at most their eight
 * slots), each place at most its four; the roster runs at its tightest trade or place. */
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

/** Grade g's day at a roster's rate of maxed Umas a day (§7.4): it opens at Craft Lv 5g − 4; the fighting party holds it
 * a tenth of five maxed Umas later, a run of twenty a tenth of twenty. */
export function gradeDaysAt(rate: number): { grade: number; opens: number; party: number; run: number }[] {
  return range(10).map((grade) => {
    const opens = craftDay(5 * grade - 4)
    return { grade, opens, party: opens + 0.5 / rate, run: opens + 2 / rate }
  })
}
