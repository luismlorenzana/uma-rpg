// The achievement hook (D161 §7; the contract from save v24, D171). The run rules (H48's `settleRiftFight`) call it when
// they settle a won Rift fight; its rules and the catalog's words come with achievements (H49). Until then it earns
// nothing. Not exported from `src/index.ts`: it reaches the app through the Rift's own subpath.
import type { BattleState } from '../rpg/battle/types'
import type { EnemyRoster } from '../world/roster'
import type { AchievementId, RiftFightRef, RiftRun } from './state'

/** A won Rift fight once the run rules have recorded it (H48's `settleRiftFight`). */
export interface RiftWin {
  tier: number
  ref: RiftFightRef
  /** The run after this win (front and Convergence fights); null for an Echo. */
  run: RiftRun | null
  /** A Convergence fight: the attempt's rounds including this one (the attempt closes on its last win); else null. */
  attemptRounds: number[] | null
  /** The finished fight: the party is `state.input.allies`, the rounds `state.round`. */
  state: BattleState
  /** The account's defeated faces after this win. */
  defeated: Readonly<Record<string, string>>
  roster: EnemyRoster
}

/** An achievement a win earns, with the run it came from (null for the Bestiary). */
export interface AchievementGrant { id: AchievementId; run: string | null }

/** What this win earns that `held` (the account's achievements) lacks, in `ACHIEVEMENT_IDS` order. */
export function achievementsEarned(win: RiftWin, held: Readonly<Record<string, unknown>>): AchievementGrant[] {
  return [] // H49
}
