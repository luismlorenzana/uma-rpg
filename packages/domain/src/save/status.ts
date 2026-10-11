// Where an Uma is (S3, S4): in an open fight, or working a facility job. Shared by the battle and work rules.
import type { Job } from '../economy/jobs'
import type { TierWorld } from './save'

/** True when the Uma is in a fight that hasn't ended: her party can't change until it does. */
export function isInFight(world: TierWorld, outfitId: string): boolean {
  return world.world.run.battle?.input.allies.some((a) => a.id === outfitId) ?? false
}

/** Where an Uma is working, or null. */
export function workOf(world: TierWorld, outfitId: string): { placeId: string; slot: number; job: Job } | null {
  for (const [placeId, f] of Object.entries(world.facilities)) {
    const slot = f.jobs.findIndex((j) => j?.outfitId === outfitId)
    if (slot >= 0) return { placeId, slot, job: f.jobs[slot]! }
  }
  return null
}
