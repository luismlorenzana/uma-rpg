// Her trade on the web (R2, PP2, PP16, PP21; H80): the resolver every work action passes (R2's build decision 8: her
// trade from her template's calling and her stored pick, `tradeResolver` over the master roster, null for an outfit it
// lacks, D208), and the trade's words. The words use R2's place names whatever the live engine, so the Stable's facet list
// and the tests read the same before and after the switch.
import {
  RPG_REWORK_ENGINE, tradePlaces, tradeResolver, TRADE_IDS, wildsPlaces, type RosterOutfit, type TierWorld, type TradeId, type TradeOf,
} from '@rpg/domain'

const PLACE_NAME: ReadonlyMap<string, string> = new Map(wildsPlaces(RPG_REWORK_ENGINE.economy).map((p) => [p.id, p.name]))

/** An R2 place's name ("Monster Den"). */
export const placeNameV3 = (placeId: string): string => PLACE_NAME.get(placeId) ?? placeId

/** A trade by its first and last places: "Mine · Weapon Forge". */
export const tradeLabel = (trade: TradeId): string => {
  const places = tradePlaces(trade)
  return [places[0], places.at(-1)!].map(placeNameV3).join(' · ')
}

/** Who a trade's Umas are, by class: the open shop's header names them ("Open shop: no Brawler in this world"). */
export const TRADE_CLASS_WORDS: Readonly<Record<TradeId, string>> = {
  physical: 'Brawler', 'physical-hybrid': 'Spell Blade', healer: 'Paladin or Cleric', 'magical-hybrid': 'Summoner', magical: 'Mage',
}

let last: { world: TierWorld; roster: readonly RosterOutfit[]; tradeOf: TradeOf } | null = null

/** Each owned Uma's trade in a world, from the master roster; built once per world and roster. */
export function tradeOfWorld(world: TierWorld, roster: readonly RosterOutfit[]): TradeOf {
  if (last?.world === world && last.roster === roster) return last.tradeOf
  const byId = new Map(roster.map((outfit) => [outfit.outfitId, outfit]))
  const tradeOf = tradeResolver(world, (id) => byId.get(id))
  last = { world, roster, tradeOf }
  return tradeOf
}

/** How many of the world's Umas work each trade (the calling pick card's head counts). */
export function tradeCounts(world: Pick<TierWorld, 'umas'>, tradeOf: TradeOf): Record<TradeId, number> {
  const counts = Object.fromEntries(TRADE_IDS.map((t) => [t, 0])) as Record<TradeId, number>
  for (const id of Object.keys(world.umas)) {
    const trade = tradeOf(id)
    if (trade) counts[trade] += 1
  }
  return counts
}
