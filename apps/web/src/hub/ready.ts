// What the Hub can collect (the Collect all pill, the Ready badges and the Wilds tab's count).
import { jobFinished, placeById, type HubPage, type TierWorld } from '@rpg/domain'

/** Places with something to collect. */
export function readyPlaces(world: TierWorld | null, now: string): Set<string> {
  const ready = new Set<string>()
  for (const [id, f] of Object.entries(world?.facilities ?? {})) {
    if (f.jobs.some((j) => j && (jobFinished(j, now) > j.collected || jobFinished(j, now) >= j.count))) ready.add(id)
  }
  return ready
}

/** Slots with something to collect, on one page. */
export function readyOnPage(world: TierWorld | null, now: string, page: HubPage): number {
  let n = 0
  for (const [id, f] of Object.entries(world?.facilities ?? {})) {
    if (placeById(id)?.page !== page) continue
    n += f.jobs.filter((j) => j && (jobFinished(j, now) > j.collected || jobFinished(j, now) >= j.count)).length
  }
  return n
}
