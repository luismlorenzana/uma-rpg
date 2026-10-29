// Hall of Heroes ids and Bond numbers (D106), apart from the Limit Breaks themselves so the save parser stays light.
import { BATTLE_ENGINE_VERSION, RPG_V2_ENGINE, rpgV2 } from './battle/caps'
import { RPG_CLASSES, RPG_V2_CLASSES, rpgClasses, type RpgClass, type RpgV2Class } from './kinds'

export const HERO_SEATS = 4
/** A seat's id is its Limit Break's: `brawler-1` … `paladin-4`, the six halls' classes' (Halls v2 moves them to hall ids,
 * H129; Classes v3's seven new classes have no hall of their own: each sits in her family's, `HERO_HALLS`). */
export type HeroLimitId = `${RpgV2Class}-${1 | 2 | 3 | 4}`
const seatsOf = (classes: readonly RpgClass[]): readonly HeroLimitId[] =>
  classes.filter((c): c is RpgV2Class => (RPG_V2_CLASSES as readonly RpgClass[]).includes(c)).flatMap((c) => [1, 2, 3, 4].map((n) => `${c}-${n}` as HeroLimitId))
/** Every seat of every generation (24, D179): identities. The Paladin Bastion's four join with classes v2 (engine v15). */
export const ALL_HERO_LIMIT_IDS: readonly HeroLimitId[] = seatsOf(RPG_V2_CLASSES)
/** The live seats: 20 until the switch (H61), 24 after. */
export const HERO_LIMIT_IDS: readonly HeroLimitId[] = seatsOf(RPG_CLASSES)
const V1_SEATS = seatsOf(rpgClasses(RPG_V2_ENGINE - 1))
/** A seat of an engine's generation: a Paladin seat only from v15 (D179). The save reads the live generation's. */
export const isHeroLimitId = (id: unknown, engine: number = BATTLE_ENGINE_VERSION): id is HeroLimitId =>
  (rpgV2(engine) ? ALL_HERO_LIMIT_IDS : V1_SEATS).includes(id as HeroLimitId)
export const heroLimitClass = (id: HeroLimitId): RpgV2Class => id.slice(0, id.lastIndexOf('-')) as RpgV2Class

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

/** Each class's Hall of Heroes: the Learning District's halls (D106). The Paladin Bastion opens with classes v2 (D179).
 * Classes v3's seven (H126) each take her family hall's place, after the six so `hallClass` finds those first: the Recruit
 * the Dojo, the Initiate the Tower, the Duelist and the Tome Spellblade the Salle, the Caller and the Arms Summoner the
 * Circle, the Acolyte the Bastion (Halls v2's H129 moves the halls to hall ids). */
export const HERO_HALLS: Readonly<Record<RpgClass, string>> = {
  brawler: 'brawler-dojo', mage: 'mage-tower', spellblade: 'spell-blade-salle', cleric: 'cleric-chapel', summoner: 'summoner-circle',
  paladin: 'paladin-bastion',
  recruit: 'brawler-dojo', apprentice: 'mage-tower', duelist: 'spell-blade-salle', tomeblade: 'spell-blade-salle', caller: 'summoner-circle',
  armsummoner: 'summoner-circle', acolyte: 'paladin-bastion',
}
export const hallClass = (placeId: string): RpgClass | null =>
  (Object.entries(HERO_HALLS).find(([, id]) => id === placeId)?.[0] as RpgClass | undefined) ?? null
/** The class whose hall's seats a class sits in (H126): her own for the six, her family hall's class for Classes v3's
 * seven (`HERO_HALLS`). */
export const heroHallClass = (classId: RpgClass): RpgV2Class => hallClass(HERO_HALLS[classId]) as RpgV2Class
