// Test-only (excluded from the build): a synthetic enemy roster the size of the three locked packs (rift.md §9), with
// invented ids such as `al-boss-1`, for the Rift's generator, picker and balance tests. No real names or ids.
import type { EnemyTier, Franchise, RosterMember } from '../world/roster'

/** Bosses and sub-bosses per pack, as the locked packs hold them (enemy-roster.md). */
export const PACK_SIZES: Readonly<Record<Franchise, { prefix: string; boss: number; subboss: number }>> = {
  azurlane: { prefix: 'al', boss: 53, subboss: 52 },
  nikke: { prefix: 'nk', boss: 50, subboss: 50 },
  priconne: { prefix: 'pc', boss: 32, subboss: 34 },
}

/** Every pack's bosses and sub-bosses, `keys` key enemies each and a few regulars, in pack order. */
export function packRoster(keys = 40): RosterMember[] {
  const out: RosterMember[] = []
  for (const [franchise, size] of Object.entries(PACK_SIZES) as [Franchise, (typeof PACK_SIZES)[Franchise]][]) {
    const add = (tier: EnemyTier, n: number) => {
      for (let i = 1; i <= n; i += 1) out.push({ id: `${size.prefix}-${tier}-${i}`, name: `${size.prefix} ${tier} ${i}`, franchise, tier })
    }
    add('boss', size.boss)
    add('subboss', size.subboss)
    add('key', keys)
    add('regular', 10)
  }
  return out
}
