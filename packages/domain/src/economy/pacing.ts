// The pacing model (docs/design/pacing.md, D54): every timer, curve, price and payout outside the battle engine, in one
// place so a balance pass changes numbers here and the tests say what they mean in play time.
import type { AptitudeGrade } from '@luismlorenzana/uma-data'

export const MINUTE = 60_000
export const HOUR = 60 * MINUTE

// --- Professions (design §4, §8.5) ----------------------------------------------------------------------------------

/** The two verticals. Farming & Cooking and Gathering & Crafting share one curve (parity, §8.5). */
export const PROFESSIONS = ['farming', 'gathering'] as const
export type Profession = typeof PROFESSIONS[number]
export const PROFESSION_LABEL: Readonly<Record<Profession, string>> = { farming: 'Farming & Cooking', gathering: 'Gathering & Crafting' }
export const PROFESSION_MAX_LEVEL = 50

/** EXP from level L to L+1. Lv46 (grade 10) takes 7,110 EXP; Lv50 takes 8,330. */
export const professionExpToNext = (level: number): number => 20 + 6 * level

/** Profession EXP per base minute of work: every job pays for its time, whatever it makes (§8.5). */
export const EXP_PER_MINUTE = 2

/** Base minutes to gather or refine one item of a grade: 4 at grade 1, 22 at grade 10. */
export const itemMinutes = (grade: number): number => 2 + 2 * grade
/** Base minutes to cook a dish or craft a piece of gear: three items' worth (S6, S7). */
export const makeMinutes = (grade: number): number => 3 * itemMinutes(grade)

/** One job makes at most this many items. */
export const MAX_JOB_COUNT = 50

// --- Aptitudes set speed (§4.1) ----------------------------------------------------------------------------------

/** Share of the base time an Uma needs, by aptitude grade: A (and S) take half the time, G all of it. */
export function aptitudeTime(grade: AptitudeGrade): number {
  const share: Record<AptitudeGrade, number> = { S: 0.5, A: 0.5, B: 7 / 12, C: 2 / 3, D: 0.75, E: 5 / 6, F: 11 / 12, G: 1 }
  return share[grade]
}

// --- Facilities (§9) -------------------------------------------------------------------------------------------

export const FACILITY_MAX_LEVEL = 3
/** Uma slots and speed by facility level: 2 slots, then 3, then 3 working a quarter faster. */
export const FACILITY_SLOTS = [2, 3, 3] as const
export const FACILITY_SPEED = [1, 1, 1.25] as const
/** Upgrading to level 2 or 3: Laurels plus refined items of the grade named, from the facility's two families. */
export const FACILITY_UPGRADE = [
  { laurels: 150, grade: 2, count: 5 },
  { laurels: 500, grade: 5, count: 5 },
] as const

// --- Laurels (§11) ---------------------------------------------------------------------------------------------

/** Laurels per won fight, times the chapter's tier (D51 numbers, set by this model). */
export const BATTLE_LAURELS = { fight: 10, 'sub-boss': 25, vanguard: 30, boss: 50 } as const
/** Exchange prices. A raw item costs a regular fight or more; a Rush Ticket buys an hour of any farm job. */
export const rawItemPrice = (grade: number): number => 5 + 5 * grade
export const RUSH_TICKET_PRICE = 20
export const SWEEP_TICKET_PRICE = 15
/** A Rush Ticket finishes up to an hour of a running job; one job uses as many as it needs. */
export const RUSH_TICKET_SPAN = HOUR
export const rushTicketsFor = (remainingMs: number): number => Math.max(1, Math.ceil(remainingMs / RUSH_TICKET_SPAN))
/** Reaching a chapter stocks its grade pair at the Exchange: chapter n of a tier, grades 2n − 1 and 2n. */
export const chapterGrades = (orderInTier: number): readonly [number, number] => [2 * orderInTier - 1, 2 * orderInTier]

// --- Learning District (S5, §5, §6) ------------------------------------------------------------------------------

export const CLASS_MAX_RANK = 6
export const MASTERY_MAX_RANK = 10
/** Base hours to train a class from rank r to r + 1: 44.5 hours from rank 1 to 6 at G, half at A. */
export const classRankHours = (rank: number): number => [0.5, 2, 6, 12, 24][rank - 1] ?? Infinity
/** Base hours to train gear mastery from rank r to r + 1: r(r + 1)/4, 82.5 hours from 1 to 10 at G. */
export const masteryRankHours = (rank: number): number => (rank >= MASTERY_MAX_RANK ? Infinity : (rank * (rank + 1)) / 4)

// --- Extra Stats and gear (S6, S7, §7.3, §10) -----------------------------------------------------------------------

/** One Extra Stats point, as a share of the stat (or evasion, or a Limit Break head start). */
export const POINT_SHARE = 0.015
export const POINT_EVASION = 0.006
export const POINT_LIMIT = 0.4
/** Extra Stats nodes active at once: 5 at Lv1, 30 at Lv50. */
export const activeNodeSlots = (umaLevel: number): number => 5 + Math.floor(umaLevel / 2)
