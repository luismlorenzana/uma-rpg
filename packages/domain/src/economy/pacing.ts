// The pacing model (docs/design/pacing.md, D54): every timer, curve, price and payout outside the battle engine, in one
// place so a balance pass changes numbers here and the tests say what they mean in play time.
import type { AptitudeGrade } from '@luismlorenzana/uma-data'

export const MINUTE = 60_000
export const HOUR = 60 * MINUTE

// --- Professions (design §4, §8.5) ----------------------------------------------------------------------------------

/** The two verticals, shown as **Farm Level** (farming, refining food, cooking) and **Craft Level** (gathering,
 * refining materials, crafting), D60. They share one curve (parity, §8.5). */
export const PROFESSIONS = ['farming', 'gathering'] as const
export type Profession = typeof PROFESSIONS[number]
export const PROFESSION_LABEL: Readonly<Record<Profession, string>> = { farming: 'Farm Level', gathering: 'Craft Level' }
/** Short names, as in "Farm Lv 6". */
export const PROFESSION_SHORT: Readonly<Record<Profession, string>> = { farming: 'Farm', gathering: 'Craft' }
export const PROFESSION_MAX_LEVEL = 50

/** EXP from level L to L+1 (D96): 12 base hours of work at Lv1, an eighth of an hour more each level, 18 at Lv49.
 * Lv46 (grade 10) takes 79,650 EXP in all; Lv50 takes 88,200, 735 base hours. Working without a break, an Uma with A
 * aptitude gains about 4 levels a day early on and reaches Lv50 in about 15 days; at G, 2 a day and about a month. */
export const professionExpToNext = (level: number): number => 1425 + 15 * level

/** Profession EXP per base minute of work: every job pays for its time, whatever it makes (§8.5). */
export const EXP_PER_MINUTE = 2

/** Base minutes to gather or refine one item of a grade: an hour at grade 1, 5½ hours at grade 10. Items are few and
 * slow, and every recipe needs about one of each (D65). */
export const itemMinutes = (grade: number): number => 30 + 30 * grade
/** Refining takes a quarter of gathering's time (D101), so one Pantry or Workbench keeps up with its eight sites. Like
 * every job it pays EXP for its own minutes only, so an hour of refining levels exactly as fast as an hour of gathering. */
export const REFINE_SHARE = 0.25
/** Base minutes to refine one item: 15 at grade 1, 82½ at grade 10. */
export const refineMinutes = (grade: number): number => itemMinutes(grade) * REFINE_SHARE
/** Base minutes to cook a dish or craft a piece of gear: two items' worth (S6, S7, D65). */
export const makeMinutes = (grade: number): number => 2 * itemMinutes(grade)

/** One new job makes at most this many items (D65). */
export const MAX_JOB_COUNT = 10
/** Saves from before D65 may hold jobs of up to 50. */
export const MAX_SAVED_JOB_COUNT = 50

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
  { laurels: 150, grade: 2, count: 1 },
  { laurels: 500, grade: 5, count: 2 },
] as const

// --- Laurels (§11) ---------------------------------------------------------------------------------------------

/** A cleared stage's later wins, Sweeps included, pay a quarter of its first clear (D79): EXP, Laurels and each token's
 * chance to drop. */
export const REPLAY_SHARE = 0.25
/** A stage's first clear pays its Laurels three times over (D66). */
export const FIRST_CLEAR_LAURELS = 3
/** Stages at Lv41–50 of a tier pay four times the Laurels (D82): over the band, about one and a half more full classes
 * per Uma at the Exchange, or anything else Laurels buy. */
export const LATE_LAURELS = { fromLevel: 41, factor: 4 } as const
/** Laurels per won fight, times the chapter's tier (D51 numbers, set by this model). */
export const BATTLE_LAURELS = { fight: 10, 'sub-boss': 25, vanguard: 30, boss: 50 } as const
/** Exchange prices. A raw item costs about two fights per base hour of gathering (D65); a Time Ticket takes 30 minutes
 * off any job or training (D74), at the same rate as before: an hour costs about two fights. */
export const rawItemPrice = (grade: number): number => 10 + 10 * grade
export const TIME_TICKET_PRICE = 10
export const SWEEP_TICKET_PRICE = 15
/** A Time Ticket cuts this much from a running job or training (D74). */
export const TIME_TICKET_SPAN = 30 * MINUTE
/** Time Tickets that finish a job with this much time left. */
export const timeTicketsToFinish = (remainingMs: number): number => Math.max(1, Math.ceil(remainingMs / TIME_TICKET_SPAN))
/** Reaching a chapter stocks its grade pair at the Exchange: chapter n of a tier, grades 2n − 1 and 2n. */
export const chapterGrades = (orderInTier: number): readonly [number, number] => [2 * orderInTier - 1, 2 * orderInTier]

// --- Learning District (S5, §5, §6) ------------------------------------------------------------------------------

/** Ranks 1–5: rank r opens skill depths 1–r (D77). */
export const CLASS_MAX_RANK = 5
export const MASTERY_MAX_RANK = 10
/** Base hours per class rank, the same for every rank (D68): 6 at G, 3 at A; 24 hours from rank 1 to 5 at G. Each
 * promotion also spends a Class Promotion Token of its band (D67). */
export const CLASS_RANK_HOURS = 6
export const classRankHours = (rank: number): number => (rank >= 1 && rank < CLASS_MAX_RANK ? CLASS_RANK_HOURS : Infinity)
/** Base hours per gear mastery rank, the same for every rank (D68): 3 at G, 1½ at A; 27 hours from 1 to 10 at G. */
export const MASTERY_RANK_HOURS = 3
export const masteryRankHours = (rank: number): number => (rank >= 1 && rank < MASTERY_MAX_RANK ? MASTERY_RANK_HOURS : Infinity)

// --- Extra Stats and gear (S6, S7, §7.3, §10) -----------------------------------------------------------------------

/** One Extra Stats point, as a share of the stat (or evasion, or a Limit Break head start). */
export const POINT_SHARE = 0.015
export const POINT_EVASION = 0.006
export const POINT_LIMIT = 0.4
/** Extra Stats nodes active at once: 5 at Lv1, 30 at Lv50. */
export const activeNodeSlots = (umaLevel: number): number => 5 + Math.floor(umaLevel / 2)
