// The Halls' coverage words (the Tier rework's R1, engine v16, CP28, class-progression.md §8.2; H70): the twin sets a
// seat's Limit Break answers ("Fire · Light"), and what a Learner would add, the sets it answers that her weapons miss
// ("Adds Light, Dark, Twilight").
import { heroLimitKinds, rpgAnsweredTwinSets, type HeroLimit, type RpgTwinSet, type RpgWeapon } from '@rpg/domain'

export const TWIN_SET_LABEL: Readonly<Record<RpgTwinSet, string>> = {
  fire: 'Fire', ice: 'Ice', lightning: 'Lightning', light: 'Light', dark: 'Dark', twilight: 'Twilight',
}

/** The twin sets a seat's Limit Break answers, in the sets' order. */
export function seatTwinSets(limit: HeroLimit): RpgTwinSet[] {
  return rpgAnsweredTwinSets(heroLimitKinds(limit))
}

/** The sets the seat answers that her weapons don't: what sitting under it adds to her coverage. */
export function learnerAdds(limit: HeroLimit, weapons: readonly RpgWeapon[]): RpgTwinSet[] {
  const seat = seatTwinSets(limit)
  const hers = new Set(rpgAnsweredTwinSets(weapons))
  return seat.filter((set) => !hers.has(set))
}
