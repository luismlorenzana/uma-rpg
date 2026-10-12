// Run shape and empty state are boot data; replay and turn logic live in run.ts (H16).
import type { BattleAction, BattleInput } from '../battle/types'
import { BATTLE_MAX_ACTIONS } from '../battle/caps'

export interface RpgRunBattle {
  battleId: string; nodeId: string; startedAt: string; input: BattleInput
  /** Every action taken so far; the state is replayed from input + actions. */
  actions: BattleAction[]
}
export interface RpgRun {
  /** Zero-based party index. */
  party: number
  chapterId: string
  /** Wins persist across regions in the world run. */
  wins: Record<string, number>
  /** Carried MP by outfit; an absent entry means full MP. */
  mp: Record<string, number>
  battle: RpgRunBattle | null
  /** Number of fights started, also used to derive the next seed. */
  battles: number
  clearedAt: string | null
  updatedAt: string
}
export const RPG_MAX_BATTLE_ACTIONS = BATTLE_MAX_ACTIONS
export function createRpgRun(party: number, chapterId: string, now: string): RpgRun {
  return { party, chapterId, wins: { start: 1 }, mp: {}, battle: null, battles: 0, clearedAt: null, updatedAt: now }
}
