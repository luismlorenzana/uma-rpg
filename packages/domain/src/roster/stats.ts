import type { RosterOutfit } from '../master/roster'

/** Original base-stat total used by the RPG's album sort. */
export function statTotal(outfit: RosterOutfit): number {
  const s = outfit.baseStats
  return s.speed + s.stamina + s.power + s.guts + s.wit
}
