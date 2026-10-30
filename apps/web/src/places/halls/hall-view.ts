// The Halls' coverage words (the Tier rework's R1, engine v16, CP28, class-progression.md §8.2; H70): the twin sets a
// seat's Limit Break answers ("Fire · Light"), and what a Learner would add, the sets it answers that her weapons miss
// ("Adds Light, Dark, Twilight"). Halls v2 (engine v19, D241 HV21, HV25; H133, live since H134): each seat's card (its home
// class, its shape and power, its side effect and its lore) and the (i)'s rules, all read from the domain's data, never from
// a Limit Break's name. Every Halls v2 wording lives here (H117's `copy.ts` isn't on `main`).
import {
  BOND_EXP_PER_WIN, BOND_EXP_TO_NEXT, bondCapacity, HERO_LIMIT_SCALE, HERO_MAX_LEARNERS, heroHalls, heroLimitKinds, heroLimitsOfHall,
  heroSeatHome, LEARNER_MAX_PARENTS, rpgAnsweredTwinSets, rpgClassName, type HeroLimit, type RpgTwinSet, type RpgWeapon,
} from '@rpg/domain'
import { STATUS_LABEL } from '../../battle/labels'

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

// --- Halls v2 (H133) ----------------------------------------------------------------------------------------------------

/** A seat's card: its label, its shape, power and side effect, and its line (its lore). */
export interface SeatCard {
  /** "Seat 2 · Brawler" (its home class). */
  seat: string
  /** "One foe · 1 hit", "Every foe · 3 hits", "Random · 8 hits", "Volley · 4 + 2 a foe". */
  shape: string
  /** The Limit Break's own power: "×2.9". */
  power: string
  /** A Healer Sanctum seat's stack: "Brave 1". */
  effect: string | null
  line: string
}

const hitsIn = (limit: HeroLimit, which: (cast: HeroLimit['casts'][number]) => boolean): number =>
  limit.casts.filter(which).reduce((n, c) => n + c.hits.reduce((m, h) => m + (h.double ? 2 : 1), 0), 0)
const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`

/** Its shape in words (HV25), from its casts: a double counts as two hits; a volley's first number is its hits on the
 * tapped foe over all its volley casts, the second its splash hits on each other foe. */
export function shapeWords(limit: HeroLimit): string {
  const casts = limit.casts.filter((c) => c.hits.length > 0)
  if (casts.some((c) => c.volley)) {
    return `Volley · ${hitsIn(limit, (c) => !!c.volley)} + ${casts.filter((c) => c.volley && c.splash).length} a foe`
  }
  const target = casts[0]?.target ?? 'one'
  const n = hitsIn(limit, (c) => c.hits.length > 0)
  return `${target === 'all' ? 'Every foe' : target === 'random' ? 'Random' : 'One foe'} · ${plural(n, 'hit')}`
}

/** A Limit Break's power as the seat card and the (i) show it: "×2.9", "×2.0". */
export const powerWord = (power: number): string => `×${power.toFixed(1)}`

/** A seat's card (HV25): its home class, shape words, own power, side effect and lore (the blurb tells the shape the shape
 * line already says). Halls v2's twenty each have a power (H129); the live halls are theirs since H134. */
export function seatCard(limit: HeroLimit): SeatCard {
  const n = limit.id.slice(limit.id.lastIndexOf('-') + 1)
  const status = limit.casts.find((c) => c.status)?.status
  return {
    seat: `Seat ${n} · ${rpgClassName(heroSeatHome(limit.id))}`,
    shape: shapeWords(limit),
    power: powerWord(limit.power ?? 0),
    effect: status ? `${STATUS_LABEL[status.key]} ${status.stacks}` : null,
    line: limit.lore ?? limit.blurb,
  }
}

/** The card's shape line, one string: "One foe · 4 hits · ×2.0 · Brave 1". */
export const shapeLine = (card: SeatCard): string => [card.shape, card.power, card.effect].filter((w): w is string => !!w).join(' · ')

/** The Halls' (i), one rule a line (H133 decision 7), every number from the domain's tables: the seats' powers, the class
 * scales (H131's), the Learner caps, the Bond's strength and EXP. */
export function hallHelp(): string[] {
  const powers = heroHalls().flatMap((h) => heroLimitsOfHall(h)).map((l) => l.power ?? 0)
  const pct = (x: number) => Math.round(x * 100)
  const scale = (x: number) => `×${x}`
  return [
    'Five halls, one per family; any Uma sits in any seat.',
    'A Hero casts her seat’s Limit Break at full strength.',
    `Its power is the seat’s (${powerWord(Math.min(...powers))} to ${powerWord(Math.max(...powers))}), × her class’s scale (${scale(HERO_LIMIT_SCALE.brawler)}; a Paladin’s or a Cleric’s ${scale(HERO_LIMIT_SCALE.paladin)}; a Tier 0’s ${scale(HERO_LIMIT_SCALE.recruit)}), × her deepest skill.`,
    `Up to ${HERO_MAX_LEARNERS} Learners a Hero, ${LEARNER_MAX_PARENTS} Heroes a Learner, at ${pct(bondCapacity(0))}% + ${pct(bondCapacity(1) - bondCapacity(0))}% a Bond Level.`,
    `A won fight raises each Bond: a stage ${BOND_EXP_PER_WIN.fight}, an elite or a boss ${BOND_EXP_PER_WIN.boss}, ${BOND_EXP_TO_NEXT} a level.`,
    'A Bond stays when she leaves.',
  ]
}
