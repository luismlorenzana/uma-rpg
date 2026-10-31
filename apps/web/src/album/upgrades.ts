// "Can upgrade" per Uma (H34): the domain's `upgradesFor`, as her active class, memoized per world. Every save change
// makes a new world object, so the world is the revision: the Stable's 30-second rerun and the profile's renders hit the
// cache, and a save change recomputes. Only the Stable and the profile ask; pickers and quick looks pay nothing.
import { activeClass, upgradesFor, type BattleOutfit, type TierWorld, type UmaUpgrades } from '@rpg/domain'
import { tabDots } from '../places/stable/profile-tabs'
import { signatureDot } from '../places/stable/template-view'
import type { RpgUmaRow } from './rows'

const CACHE = new WeakMap<TierWorld, Map<string, UmaUpgrades | null>>()

/** What she can upgrade now in this world (its tier's), or null when the world doesn't own her. */
export function umaUpgrades(world: TierWorld | null, outfit: BattleOutfit, tier = 1): UmaUpgrades | null {
  if (!world) return null
  let byUma = CACHE.get(world)
  if (!byUma) CACHE.set(world, (byUma = new Map()))
  let found = byUma.get(outfit.outfitId)
  if (found === undefined) {
    const uma = world.umas[outfit.outfitId]
    found = uma ? upgradesFor(world, outfit.outfitId, activeClass(outfit, uma, tier), tier) : null
    byUma.set(outfit.outfitId, found)
  }
  return found
}

/** The Stable's rows with each owned Uma's upgrades and the `upgrade` facet: the mark and the filter follow any tab's dot. */
export function withUpgrades(rows: readonly RpgUmaRow[], world: TierWorld | null, tier = 1): RpgUmaRow[] {
  return rows.map(row => {
    if (!row.uma) return row
    const found = umaUpgrades(world, row.outfit, tier)
    const signature = signatureDot(row.outfit, row.uma, activeClass(row.outfit, row.uma, tier))
    const any = Object.values(tabDots(found, signature)).some(Boolean)
    const upgrades = found && { ...found, any }
    return { ...row, upgrades, facets: { ...row.facets, upgrade: any } }
  })
}
