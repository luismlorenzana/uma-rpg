// The place pages' picker rules as data (profession-progression.md §4.3, PP16; H80): who comes first in a place's picker
// and why another trade is greyed. What each place lists is `place-view-v4.ts`' (the farm by line, H111, live since H112).
import { ANOTHER_TRADE, placeSpecV4, tradeProfessions, type TradeOf } from '@rpg/domain'

/** Whether her trade works this place: its profession is her gathering or crafting one. */
export function ofTrade(placeId: string, trade: ReturnType<TradeOf>): boolean {
  const profession = placeSpecV4(placeId)?.profession
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
