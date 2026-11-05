// The honeycomb's bounded first-claim/first-clear record (D295, H164). Reads stay in the main bundle; battle writes are lazy.
import type { WorldContinent } from '../world/world'
import type { TierWorld } from './save'

export interface RegionTeam { umas: string[]; at: string }
export interface RegionTeams { claim?: RegionTeam; clear?: RegionTeam }
export interface HoneyRegionState extends RegionTeams { won: number; completed: boolean }
export const REGION_TEAMS_MAX = 240

/** A real region id of this tier, including the eight appended honeycomb regions. Capitals and Drills aren't regions. */
export function regionOfTier(id: string, tier: number): boolean {
  const match = /^w([1-9]\d{0,11})-(?:([1-9]|10)-[1-4]|x-[1-8])$/.exec(id)
  return match !== null && Math.ceil(Number(match[1]) / 5) === tier
}

export const regionTeamsOf = (world: TierWorld, regionId: string): RegionTeams | undefined => world.regionTeams?.[regionId]

/** One state per region id. Replay counts never inflate progress, and only the boss win means completed. */
export function honeycombState(world: TierWorld, continent: WorldContinent): Record<string, HoneyRegionState> {
  const wins = world.world.run.wins
  return Object.fromEntries(continent.regions.map((r) => [r.id, {
    won: Array.from({ length: 12 }, (_, i) => (wins[`${r.id}-s${i + 1}`] ?? 0) > 0).filter(Boolean).length,
    ...regionTeamsOf(world, r.id), completed: (wins[`${r.id}-s12`] ?? 0) > 0,
  }]))
}
