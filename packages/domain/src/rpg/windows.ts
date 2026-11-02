// Every Uma's stained-glass window (collections.md §3, D283): a board of six tracks of five steps and the Rift, one a
// tier. This is the catalog only, pure: its ids, the order the save keeps them in, and each step's numbers. What her state
// meets is `save/windows.ts`'s.

export const WINDOW_TRACKS = ['level', 'class', 'craft', 'gear', 'stars', 'world'] as const
export type WindowTrack = (typeof WINDOW_TRACKS)[number]
export type WindowNumeral = 1 | 2 | 3 | 4 | 5
export type WindowStepId = `${WindowTrack}-${WindowNumeral}` | 'rift'

const NUMERALS: readonly WindowNumeral[] = [1, 2, 3, 4, 5]

/** Every step in the record's order: the tracks, I to V each, then the Rift. Never reorder: the save is positional. */
export const WINDOW_STEP_IDS: readonly WindowStepId[] = [...WINDOW_TRACKS.flatMap((track) => NUMERALS.map((n) => `${track}-${n}` as const)), 'rift']
export const WINDOW_STEPS_MAX = WINDOW_STEP_IDS.length

/** Level and Craft Level n: 10n. */
export const WINDOW_LEVELS = [10, 20, 30, 40, 50] as const
/** Class n: the Class Rank of her best (I–III), second (IV) and third (V) class, I being a Tier 0's in Tier 1's world. */
export const WINDOW_CLASS_RANKS = [10, 30, 50, 50, 50] as const
/** Class n: which of her classes, by rank, has to reach it: her best, her best, her best, her second, her third. */
export const WINDOW_CLASS_NTH = [1, 1, 1, 2, 3] as const
/** Gear n: the lowest grade of her eleven worn slots. */
export const WINDOW_GRADES = [2, 4, 6, 8, 10] as const
/** Stars n: her open nodes then (every Planet and moon node numbered n or less, her moon's I from II and II from IV). */
export const WINDOW_NODES = [4, 9, 13, 18, 22] as const
/** World n: a continent's three capital champions. */
export const WINDOW_ROUTES = 3

export interface WindowStep {
  id: WindowStepId
  track: WindowTrack | 'rift'
  numeral: WindowNumeral | null
  /** The rule, on one line, for the board's inline detail and the manual. */
  rule: string
}

/** The first continent of a tier (five a tier). */
export const tierFirstContinent = (tier: number): number => 5 * (tier - 1) + 1

function rule(track: WindowTrack, n: WindowNumeral, tier: number): string {
  const i = n - 1
  switch (track) {
    case 'level': return `Uma Lv ${WINDOW_LEVELS[i]}`
    case 'craft': return `Craft Lv ${WINDOW_LEVELS[i]}`
    case 'class':
      if (n === 1) return tier === 1 ? 'A Tier 0 class at Class Rank 10' : 'A Tier 1 class at Class Rank 10'
      return n <= 3 ? `A Tier 1 class at Class Rank ${WINDOW_CLASS_RANKS[i]}` : `${n === 4 ? 'Two' : 'Three'} Tier 1 classes at Class Rank 50`
    case 'gear': return `All eleven worn slots at G${WINDOW_GRADES[i]}`
    case 'stars': return n === 5 ? 'The whole map: 22 nodes' : `Every node to ${['I', 'II', 'III', 'IV'][i]}: ${WINDOW_NODES[i]} nodes`
    case 'world': return `Continent ${tierFirstContinent(tier) + i}: its capital's three champions`
  }
}

/**
 * A tier's board: 30 steps and, in a tier with a Rift, the Rift's (31). `hasRift` is whether a tier above exists, which
 * is what gives a tier its Rift (Tiers 1 and 2 today; Tier 3 has none yet, so 30).
 */
export function windowBoard(tier: number, hasRift: boolean): WindowStep[] {
  const steps: WindowStep[] = WINDOW_TRACKS.flatMap((track) => NUMERALS.map((n) => ({ id: `${track}-${n}` as const, track, numeral: n, rule: rule(track, n, tier) })))
  return hasRift ? [...steps, { id: 'rift', track: 'rift', numeral: null, rule: 'On a won Rift run' }] : steps
}
