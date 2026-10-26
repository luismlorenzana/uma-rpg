// What the Hub can collect (the Collect all pill, the Ready badges and the Wilds tab's count).
import { placeById, readyWork, type HubPage, type TierWorld } from '@rpg/domain'

/** Places with something to collect, in a world of `tier` (R2's work plans by it). */
export function readyPlaces(world: TierWorld | null, now: string, tier = 1): Set<string> {
  return new Set(world ? readyWork(world, now, tier).keys() : [])
}

/** Slots with something to collect, on one page. */
export function readyOnPage(world: TierWorld | null, now: string, page: HubPage, tier = 1): number {
  let n = 0
  for (const [id, slots] of world ? readyWork(world, now, tier) : []) if (placeById(id)?.page === page) n += slots
  return n
}
