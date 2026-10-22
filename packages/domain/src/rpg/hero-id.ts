// Hall of Heroes ids and Bond numbers (D106), apart from the Limit Breaks themselves so the save parser stays light.
import { BATTLE_ENGINE_VERSION, RPG_V2_ENGINE, rpgV2 } from './battle/caps'
import { RPG_ALL_CLASSES, RPG_CLASSES, rpgClasses, type RpgClass } from './kinds'

export const HERO_SEATS = 4
/** A seat's id is its Limit Break's: `brawler-1` … `paladin-4`. */
export type HeroLimitId = `${RpgClass}-${1 | 2 | 3 | 4}`
const seatsOf = (classes: readonly RpgClass[]): readonly HeroLimitId[] => classes.flatMap((c) => [1, 2, 3, 4].map((n) => `${c}-${n}` as HeroLimitId))
/** Every seat of every generation (24, D179): identities. The Paladin Bastion's four join with classes v2 (engine v15). */
export const ALL_HERO_LIMIT_IDS: readonly HeroLimitId[] = seatsOf(RPG_ALL_CLASSES)
/** The live seats: 20 until the switch (H61), 24 after. */
export const HERO_LIMIT_IDS: readonly HeroLimitId[] = seatsOf(RPG_CLASSES)
const V1_SEATS = seatsOf(rpgClasses(RPG_V2_ENGINE - 1))
/** A seat of an engine's generation: a Paladin seat only from v15 (D179). The save reads the live generation's. */
export const isHeroLimitId = (id: unknown, engine: number = BATTLE_ENGINE_VERSION): id is HeroLimitId =>
  (rpgV2(engine) ? ALL_HERO_LIMIT_IDS : V1_SEATS).includes(id as HeroLimitId)
export const heroLimitClass = (id: HeroLimitId): RpgClass => id.slice(0, id.lastIndexOf('-')) as RpgClass

/** Learners per Hero, and Heroes per Learner. */
export const HERO_MAX_LEARNERS = 10
export const LEARNER_MAX_PARENTS = 2
/** Bond Levels 0–10: an inherited Limit Break works at 50% and gains 5% a level, 100% at Bond 10. */
export const BOND_MAX_LEVEL = 10
export const BOND_EXP_TO_NEXT = 12
/** Bond EXP per won fight, toward each of a Learner's Heroes, or a Hero's own seat (D112): about 55 wins bond two Heroes
 * fully, so a Learner bonds four by Lv50 on first clears alone (D106). */
export const BOND_EXP_PER_WIN = { fight: 2, 'sub-boss': 3, vanguard: 3, boss: 3 } as const
export const bondCapacity = (level: number): number => Math.round((0.5 + 0.05 * Math.max(0, Math.min(BOND_MAX_LEVEL, level))) * 100) / 100

/** Each class's Hall of Heroes: the Learning District's halls (D106). The Paladin Bastion opens with classes v2 (D179). */
export const HERO_HALLS: Readonly<Record<RpgClass, string>> = {
  brawler: 'brawler-dojo', mage: 'mage-tower', spellblade: 'spell-blade-salle', cleric: 'cleric-chapel', summoner: 'summoner-circle',
  paladin: 'paladin-bastion',
}
export const hallClass = (placeId: string): RpgClass | null =>
  (Object.entries(HERO_HALLS).find(([, id]) => id === placeId)?.[0] as RpgClass | undefined) ?? null
