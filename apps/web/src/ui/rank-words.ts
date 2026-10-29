// Class Rank facts in one wording each (profile v2's wording list, C3, C8; classes-v3.md §14): the Exchange's Manual sheet
// and "The classes are rebuilt" share them with the profile's Class tab (H120). Interim home until H117's
// `places/stable/copy.ts` lands: that packet (or H120) moves these three builders there and this module re-exports or goes.

const num = (n: number) => n.toLocaleString('en-US')

/** A Class Rank: "R34". */
export const classRankWord = (rank: number): string => `R${rank}`
/** A Tier 0's Class Rank on its ladder to the promotion: "R7/10". */
export const tier0RankWord = (rank: number): string => `R${rank}/10`
/** EXP a Tier 0 at Rank 10 holds for her next promotion: "+17,400 EXP waiting". */
export const waitingWord = (exp: number): string => `+${num(exp)} EXP waiting`
