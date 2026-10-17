// What the Hub can collect (the Collect all pill, the Ready badges and the Wilds tab's count).
import { placeById, readyWork, type HubPage, type TierWorld } from '@rpg/domain'

/** Places with something to collect. */
export function readyPlaces(world: TierWorld | null, now: string): Set<string> {
  return new Set(world ? readyWork(world, now).keys() : [])
}

/** Slots with something to collect, on one page. */
export function readyOnPage(world: TierWorld | null, now: string, page: HubPage): number {
  let n = 0
  for (const [id, slots] of world ? readyWork(world, now) : []) if (placeById(id)?.page === page) n += slots
  return n
}
