// The Hub only needs a facility's slots, not job planning, recipes or collection (H16).
import { FACILITY_SLOTS } from '../economy/pacing'
import type { Facility } from '../economy/jobs'
import type { TierWorld } from './save'

/** A facility's state: level 1 and idle until first used. */
export function facilityOf(world: TierWorld, placeId: string): Facility {
  return world.facilities[placeId] ?? { level: 1, jobs: Array.from({ length: FACILITY_SLOTS[0] }, () => null) }
}
