// D220's roster-aware compatibility repair. The save stores only a calling choice while the eligibility rule is derived
// from private master data, so this runs in the web app after both have loaded instead of bumping the schema without data.
import type { CallingOutfit } from '../roster/template'
import { repairUmaCallingChoice } from '../roster/template'
import type { Save } from './save'

export type CallingRepairOutfit = CallingOutfit & { outfitId: string }

/** Reopens newly eligible choices and clears choices that became fixed, in every tier. Returns the input when unchanged. */
export function repairCallingChoices(save: Save, outfits: readonly CallingRepairOutfit[], now: string): Save {
  const byId = new Map(outfits.map((outfit) => [outfit.outfitId, outfit]))
  let changed = false
  const tierWorlds = Object.fromEntries(Object.entries(save.tierWorlds).map(([tier, world]) => {
    let worldChanged = false
    const umas = Object.fromEntries(Object.entries(world.umas).map(([outfitId, uma]) => {
      const outfit = byId.get(outfitId)
      if (!outfit) return [outfitId, uma]
      const calling = repairUmaCallingChoice(outfit, uma.calling)
      if (calling === uma.calling) return [outfitId, uma]
      changed = worldChanged = true
      return [outfitId, { ...uma, calling }]
    }))
    return [tier, worldChanged ? { ...world, umas } : world]
  }))
  return changed ? { ...save, account: { ...save.account, updatedAt: now }, tierWorlds } : save
}
