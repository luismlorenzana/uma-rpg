// Hall of Heroes ids and Bond numbers (D106), apart from the Limit Breaks themselves so the save parser stays light.
import { BATTLE_ENGINE_VERSION, rpgRework, rpgV2 } from './battle/caps'
import type { RpgClass } from './kinds'

/** The most seats a hall has: from v20 (D261) the Warrior Dojo and the Mage Tower have two. */
export const HERO_SEATS = 4
/** A Hall of Heroes (Halls v2, HV20; H129): a type of its own, no longer a class. Classes v1's five halls (to engine v14),
 * classes v2's six with the Paladin Bastion (v15–v18, D179), and from v19 five by family (HV1): the Dojo, the Tower, the
 * Salle and the Circle keep their ids, and the Healer Sanctum (`healer`) takes the Paladin Bastion's and the Cleric
 * Chapel's place; those two stay as v15–v18's halls for their replays. */
export type HeroHall = 'brawler' | 'mage' | 'spellblade' | 'cleric' | 'summoner' | 'paladin' | 'healer'
/** A seat's id is its hall's and its number (HV20): `brawler-1` … `healer-4`. */
export type HeroLimitId = `${HeroHall}-${1 | 2 | 3 | 4}`
/** Every hall of every generation, in the order their seats were added (so no older list's order moves). */
const ALL_HALLS: readonly HeroHall[] = ['brawler', 'mage', 'spellblade', 'cleric', 'summoner', 'paladin', 'healer']
const HALLS_V1: readonly HeroHall[] = ['brawler', 'mage', 'spellblade', 'cleric', 'summoner']
const HALLS_V2: readonly HeroHall[] = [...HALLS_V1, 'paladin']
/** Halls v2's five in the design's order (§2.1): the Warrior Dojo, the Mage Tower, the Spellblade Salle, the Summoner
 * Circle and the Healer Sanctum. */
const HALLS_V19: readonly HeroHall[] = ['brawler', 'mage', 'spellblade', 'summoner', 'healer']
/** The halls of an engine's generation: classes v1's five to v14, six v15–v18 (the Paladin Bastion, D179), Halls v2's five
 * from v19 (H129). */
export const heroHalls = (engine: number = BATTLE_ENGINE_VERSION): readonly HeroHall[] =>
  rpgRework('classes', engine) ? HALLS_V19 : rpgV2(engine) ? HALLS_V2 : HALLS_V1
const seatsOf = (halls: readonly HeroHall[]): readonly HeroLimitId[] =>
  halls.flatMap((hall) => ([1, 2, 3, 4] as const).map((n): HeroLimitId => `${hall}-${n}`))
const SEATS_V1 = seatsOf(HALLS_V1)
const SEATS_V2 = seatsOf(HALLS_V2)
const SEATS_V19 = seatsOf(HALLS_V19)
/** The four seats the owner's trim closed (D261): the Warrior Dojo's and the Mage Tower's 3 and 4. */
const CLOSED_V20: readonly HeroLimitId[] = ['brawler-3', 'brawler-4', 'mage-3', 'mage-4']
const SEATS_V20 = SEATS_V19.filter((id) => !CLOSED_V20.includes(id))
/** The seats of an engine's generation, in seat order: 20 to v14, 24 v15–v18, Halls v2's 20 on v19, the trim's 16 from
 * v20 (D261). */
export const heroLimitIds = (engine: number = BATTLE_ENGINE_VERSION): readonly HeroLimitId[] =>
  rpgRework('halls', engine) ? SEATS_V20 : rpgRework('classes', engine) ? SEATS_V19 : rpgV2(engine) ? SEATS_V2 : SEATS_V1
/** Every seat of every generation (28): identities. The Paladin Bastion's four join with classes v2 (engine v15), the
 * Healer Sanctum's with Halls v2 (v19). */
export const ALL_HERO_LIMIT_IDS: readonly HeroLimitId[] = seatsOf(ALL_HALLS)
/** The live seats: the trim's 16 since D261. */
export const HERO_LIMIT_IDS: readonly HeroLimitId[] = heroLimitIds()
/** A seat of an engine's generation (D179): a Paladin seat only v15–v18, a Healer seat only from v19, `brawler-3` to v19.
 * The save and the engine's `validHeroes` read it (the save the live generation's, the engine the fight's). */
export const isHeroLimitId = (id: unknown, engine: number = BATTLE_ENGINE_VERSION): id is HeroLimitId =>
  heroLimitIds(engine).includes(id as HeroLimitId)
/** A seat's hall: its id's prefix. */
export const heroLimitHall = (id: HeroLimitId): HeroHall => id.slice(0, id.lastIndexOf('-')) as HeroHall

/** Halls v2's home classes (HV1, HV3): seats 1–2's, then seats 3–4's (from v20 the Dojo and the Tower have only the first). */
const HOMES_V19 = {
  brawler: ['brawler', 'brawler'], mage: ['mage', 'mage'], spellblade: ['spellblade', 'tomeblade'], summoner: ['armsummoner', 'summoner'],
  healer: ['paladin', 'cleric'],
} as const satisfies Readonly<Record<string, readonly [RpgClass, RpgClass]>>
/** The class a seat is home to in an engine's generation (HV4: the theme and the best Hero; any Uma may sit there): from
 * v19 Halls v2's table (the Salle's Arms Spellblade 1–2 and Tome Spellblade 3–4, the Circle's Arms Summoner 1–2 and Tome
 * Summoner 3–4, the Sanctum's Paladin 1–2 and Cleric 3–4), before it the hall's own class. A Healer seat always reads the
 * table and a Paladin or Cleric seat always its class: neither hall exists in the other's generations. */
export function heroSeatHome(id: HeroLimitId, engine: number = BATTLE_ENGINE_VERSION): RpgClass {
  const hall = heroLimitHall(id)
  if (hall === 'paladin' || hall === 'cleric') return hall
  if (hall !== 'healer' && !rpgRework('classes', engine)) return hall
  return HOMES_V19[hall][Number(id.slice(id.lastIndexOf('-') + 1)) <= 2 ? 0 : 1]
}
/** Each hall's Learning District place (D106, HV21): four kept from today, the Healer Sanctum's new. */
export const HERO_HALL_PLACES: Readonly<Record<HeroHall, string>> = {
  brawler: 'brawler-dojo', mage: 'mage-tower', spellblade: 'spell-blade-salle', cleric: 'cleric-chapel', summoner: 'summoner-circle',
  paladin: 'paladin-bastion', healer: 'healer-sanctum',
}
/** The hall a place is, or null. */
export const hallOfPlace = (placeId: string): HeroHall | null =>
  (Object.entries(HERO_HALL_PLACES).find(([, id]) => id === placeId)?.[0] as HeroHall | undefined) ?? null

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

// --- Kept for the live web until H133 moves the pages and the registry to the hall-based names (H134 drops these) -------

