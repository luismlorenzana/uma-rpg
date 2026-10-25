// The Halls' coverage words from engine v16 (the Tier rework's R1, CP28, class-progression.md §8.2; H70): the twin sets a
// seat's Limit Break answers ("Fire · Light"), and what a Learner would add, the sets it answers that her weapons miss
// ("Adds Light, Dark, Twilight"). Null before v16, where foes aren't weak to twins.
import {
  BATTLE_ENGINE_VERSION, heroLimitKinds, rpgAnsweredTwinSets, rpgRework, type HeroLimit, type RpgTwinSet, type RpgWeapon,
} from '@rpg/domain'

export const TWIN_SET_LABEL: Readonly<Record<RpgTwinSet, string>> = {
  fire: 'Fire', ice: 'Ice', lightning: 'Lightning', light: 'Light', dark: 'Dark', twilight: 'Twilight',
}

/** The twin sets a seat's Limit Break answers, in the sets' order. */
export function seatTwinSets(limit: HeroLimit, engine: number = BATTLE_ENGINE_VERSION): RpgTwinSet[] | null {
  return rpgRework('fight', engine) ? rpgAnsweredTwinSets(heroLimitKinds(limit)) : null
}

/** The sets the seat answers that her weapons don't: what sitting under it adds to her coverage. */
export function learnerAdds(limit: HeroLimit, weapons: readonly RpgWeapon[], engine: number = BATTLE_ENGINE_VERSION): RpgTwinSet[] | null {
  const seat = seatTwinSets(limit, engine)
  if (!seat) return null
  const hers = new Set(rpgAnsweredTwinSets(weapons))
  return seat.filter((set) => !hers.has(set))
}
