// The pacing model (docs/design/pacing.md, D54): every timer, curve, price and payout outside the battle engine, in one
// place so a balance pass changes numbers here and the tests say what they mean in play time.

export const MINUTE = 60_000
export const HOUR = 60 * MINUTE

// --- Professions (design §4, §8.5) ----------------------------------------------------------------------------------

/** Each Uma's one profession (D60, D144): **Craft Level**, raised by every job at the Wilds sites, the Workbench, the Forge
 * and the Lapidary. */
export const CRAFT_LABEL = 'Craft Level'
/** The short name, as in "Craft Lv 6". */
export const CRAFT_SHORT = 'Craft'
export const PROFESSION_MAX_LEVEL = 50

/** EXP from level L to L+1 (D96): 12 hours of work at Lv1, an eighth of an hour more each level, 18 at Lv49. Lv46
 * (grade 10) takes 79,650 EXP in all; Lv50 takes 88,200, 735 hours. Working without a break, every Uma gains about 2
 * levels a day early on and reaches Lv50 in about a month (24 days at a level-3 facility); aptitude doesn't matter
 * (D139). */
export const professionExpToNext = (level: number): number => 1425 + 15 * level

/** Craft EXP in: levels up, banking EXP at Lv50. */
export function grantProfessionExp(p: { level: number; exp: number }, exp: number): { level: number; exp: number } {
  let { level } = p
  let bank = p.exp + Math.max(0, Math.floor(exp))
  while (level < PROFESSION_MAX_LEVEL && bank >= professionExpToNext(level)) {
    bank -= professionExpToNext(level)
    level += 1
  }
  return { level, exp: bank }
}

/** Profession EXP per minute of work at her level: every job pays for its time, whatever it makes (§8.5). */
export const EXP_PER_MINUTE = 2

/**
 * Minutes to gather one item (D139): the same for every grade, set by her profession level alone. 54 at Lv1, falling
 * evenly to 36 at Lv50, so a 10-item job takes 9 hours at Lv1 and 6 at Lv50 and every Uma of a level finishes
 * together. Grades open with levels (grade k at Lv 5k − 4): a new grade arrives at the speed its level gives.
 */
export const GATHER_MINUTES = { atFirst: 54, atMax: 36 } as const
export const itemMinutes = (level: number): number => {
  const l = Math.min(PROFESSION_MAX_LEVEL, Math.max(1, Math.floor(level)))
  return GATHER_MINUTES.atFirst - ((GATHER_MINUTES.atFirst - GATHER_MINUTES.atMax) * (l - 1)) / (PROFESSION_MAX_LEVEL - 1)
}
/** Refining takes a quarter of gathering's time (D101), so the Workbench keeps up with the eight sites. Like
 * every job it pays EXP for its own minutes only, so an hour of refining levels exactly as fast as an hour of gathering. */
export const REFINE_SHARE = 0.25
/** Minutes to refine one item at a profession level: 13½ at Lv1, 9 at Lv50. */
export const refineMinutes = (level: number): number => itemMinutes(level) * REFINE_SHARE
/** The Wilds' trios (D230, FL28): each v4 step takes 36 minutes at Lv1, falling evenly to 24 at Lv50. */
export const STEP_MINUTES = { atFirst: 36, atMax: 24 } as const
export const stepMinutes = (level: number): number => {
  const l = Math.min(PROFESSION_MAX_LEVEL, Math.max(1, Math.floor(level)))
  return STEP_MINUTES.atFirst - ((STEP_MINUTES.atFirst - STEP_MINUTES.atMax) * (l - 1)) / (PROFESSION_MAX_LEVEL - 1)
}
/** Minutes to make an item from `refined` refined items under the Wilds' trios. */
export const makeMinutesV4 = (level: number, refined: number): number => stepMinutes(level) * refined
/** Minutes to craft a piece of gear or cut a Star Gem at a Craft Level: two items' worth (S7, D65, D144). */
export const makeMinutes = (level: number): number => 2 * itemMinutes(level)
/** Profession EXP a job pays per item: 2 a minute of its time at her level, before a facility's speed (D96, D139). */
export const jobExp = (minutes: number): number => Math.round(minutes * EXP_PER_MINUTE)

/** Gathering, crafting and cutting make 1–10 items a job (D65). */
export const MAX_JOB_COUNT = 10
/** Refining, at a quarter of the time, comes in these batches (D139): a ×40 refine takes as long as a 10-item gather. */
export const REFINE_BATCHES = [1, 4, 8, 20, 40] as const
/** The Wilds' job sizes (D233): with every step the same length (FL28), a job of n steps takes about n × 24 minutes at a
 * place, so ×1 … ×20 run from about half an hour to about 8 hours (×2 one, ×5 two, ×10 four, ×20 eight). */
export const JOB_SIZES = [1, 2, 3, 5, 10, 15, 20] as const
/** A job's longest size, in steps: about 8 hours. */
export const JOB_STEPS_MOST = 20
/** The sizes offered for an item of `steps` steps (1 to gather or process; a made item's refined items): those up to
 * about 8 hours, so an Arms Gem (7) offers 1, 2 and 3, an Accessory Setting (10) 1 and 2. */
export const jobSizes = (steps: number): number[] => JOB_SIZES.filter((n) => n <= Math.max(1, Math.round(JOB_STEPS_MOST / steps)))
/** The most items one new job of a kind makes (a gather 20 since D233; a process keeps v1's 40 for queued jobs). */
export const maxJobCount = (kind: 'gather' | 'refine' | 'craft' | 'cut'): number =>
  kind === 'refine' ? REFINE_BATCHES.at(-1)! : kind === 'gather' ? JOB_SIZES.at(-1)! : MAX_JOB_COUNT

// --- Facilities (§9) -------------------------------------------------------------------------------------------

export const FACILITY_MAX_LEVEL = 3
/** Uma slots and speed by facility level: 3 slots, then 4, then 5 working a quarter faster (D144; 2, 3, 3 before). */
export const FACILITY_SLOTS = [3, 4, 5] as const
export const FACILITY_SPEED = [1, 1, 1.25] as const
/** Upgrading to level 2 or 3: Laurels plus refined items of the grade named, from the facility's two families. */
export const FACILITY_UPGRADE = [
  { laurels: 150, grade: 2, count: 1 },
  { laurels: 500, grade: 5, count: 2 },
] as const

// --- Laurels (§11) ---------------------------------------------------------------------------------------------

/** A cleared stage's later wins, Sweeps included, pay a quarter of its first clear (D79): every kind of EXP and Laurels. */
export const REPLAY_SHARE = 0.25
/** A stage's first clear pays its Laurels three times over (D66). */
export const FIRST_CLEAR_LAURELS = 3
/** Stages at Lv41–50 of a tier pay four times the Laurels (D82). */
export const LATE_LAURELS = { fromLevel: 41, factor: 4 } as const
/** Laurels per won fight, times the chapter's tier (D51 numbers, set by this model). */
export const BATTLE_LAURELS = { fight: 10, 'sub-boss': 25, vanguard: 30, boss: 50 } as const
/** Exchange prices. A raw item costs about two fights per base hour of gathering (D65); a Speed Ticket takes 30 minutes
 * off any job or training (D74), at the same rate as before: an hour costs about two fights. */
export const rawItemPrice = (grade: number): number => 10 + 10 * grade
export const TIME_TICKET_PRICE = 10
export const SWEEP_TICKET_PRICE = 15
/** A Speed Ticket cuts this much from a running job or training (D74). */
export const TIME_TICKET_SPAN = 30 * MINUTE
/** Speed Tickets that finish a job with this much time left. */
export const timeTicketsToFinish = (remainingMs: number): number => Math.max(1, Math.ceil(remainingMs / TIME_TICKET_SPAN))
/** Reaching a chapter stocks its grade pair at the Exchange: chapter n of a tier, grades 2n − 1 and 2n. */
export const chapterGrades = (orderInTier: number): readonly [number, number] => [2 * orderInTier - 1, 2 * orderInTier]

// --- Extra Stats and gear (S6, S7, §7.3, §10) -----------------------------------------------------------------------

/** One Extra Stats or armor point (D104): a flat +1 to its stat, +5 HP; a Speed point 0.6% evasion; a Limit point a
 * 0.4 head start on the Limit Break gauge. */
export const POINT_HP = 5
export const POINT_EVASION = 0.006
export const POINT_LIMIT = 0.4
/** Extra Stats nodes active at once: 5 at Lv1, 30 at Lv50. */
export const activeNodeSlots = (umaLevel: number): number => 5 + Math.floor(umaLevel / 2)
