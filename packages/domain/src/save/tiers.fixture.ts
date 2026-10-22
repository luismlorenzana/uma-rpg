// A synthetic two-tier save for tests (H35): Tier 1 as given, plus a Tier 2 world that owns two other invented outfits and
// has its own Laurels. No promotion exists yet, so tests build the second world by hand.
import { newOwnedUma, newTierWorld, type Save } from './save'

export const TIER2_UMAS = ['201', '202'] as const
export const TIER2_LAURELS = 5000

export function withTierTwo(save: Save, now: string): Save {
  const world = newTierWorld(now, 0)
  return {
    ...save,
    tierWorlds: {
      ...save.tierWorlds,
      '2': { ...world, wallet: { ...world.wallet, laurels: TIER2_LAURELS }, umas: Object.fromEntries(TIER2_UMAS.map((id) => [id, newOwnedUma(now)])) },
    },
  }
}
