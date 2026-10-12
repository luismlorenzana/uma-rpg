// Hall of Heroes ids and Bond numbers (D106), apart from the Limit Breaks themselves so the save parser stays light.
import { RPG_CLASSES, type RpgClass } from './kinds'

export const HERO_SEATS = 4
/** A seat's id is its Limit Break's: `brawler-1` … `summoner-4`. */
export type HeroLimitId = `${RpgClass}-${1 | 2 | 3 | 4}`
export const HERO_LIMIT_IDS: readonly HeroLimitId[] = RPG_CLASSES.flatMap((c) => [1, 2, 3, 4].map((n) => `${c}-${n}` as HeroLimitId))
export const isHeroLimitId = (id: unknown): id is HeroLimitId => HERO_LIMIT_IDS.includes(id as HeroLimitId)
export const heroLimitClass = (id: HeroLimitId): RpgClass => id.slice(0, id.lastIndexOf('-')) as RpgClass

/** Learners per Hero, and Heroes per Learner. */
export const HERO_MAX_LEARNERS = 10
export const LEARNER_MAX_PARENTS = 2
/** Bond Levels 0–10: an inherited Limit Break works at 50% and gains 5% a level, 100% at Bond 10. */
export const BOND_MAX_LEVEL = 10
export const BOND_EXP_TO_NEXT = 12
/** Bond EXP a Learner earns toward each of her Heroes per won fight: about 55 wins bond two Heroes fully, so a Learner
 * bonds four by Lv50 on first clears alone (D106). */
export const BOND_EXP_PER_WIN = { fight: 2, 'sub-boss': 3, vanguard: 3, boss: 3 } as const
export const bondCapacity = (level: number): number => Math.round((0.5 + 0.05 * Math.max(0, Math.min(BOND_MAX_LEVEL, level))) * 100) / 100

/** Each class's Hall of Heroes: the Learning District's five halls (D106). */
export const HERO_HALLS: Readonly<Record<RpgClass, string>> = {
  brawler: 'brawler-dojo', mage: 'mage-tower', spellblade: 'spell-blade-salle', cleric: 'cleric-chapel', summoner: 'summoner-circle',
}
export const hallClass = (placeId: string): RpgClass | null =>
  (Object.entries(HERO_HALLS).find(([, id]) => id === placeId)?.[0] as RpgClass | undefined) ?? null
