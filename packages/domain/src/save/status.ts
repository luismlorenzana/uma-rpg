// Where an Uma is (S3, S4): in an open fight, or holding a facility slot. Shared by the battle and work rules.
import type { TierWorld } from './save'

/** True when the Uma is in a fight that hasn't ended: her party can't change until it does. */
export function isInFight(world: TierWorld, outfitId: string): boolean {
  return world.world.run.battle?.input.allies.some((a) => a.id === outfitId) ?? false
}

/** The slot she works in (SC3: her work row holds it until Collect or Recall frees her), or null. */
export function workOf(world: TierWorld, outfitId: string): { placeId: string; slot: number } | null {
  const row = world.work[outfitId]
  return row?.slot && row.entries.length > 0 ? { placeId: row.slot.building, slot: row.slot.slot } : null
}
