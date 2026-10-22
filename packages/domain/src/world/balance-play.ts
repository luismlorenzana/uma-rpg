// The balance simulation's player (combat-balance.md §6.0): plays a fight to its end with the shared Auto policy and reads
// how it went. Shared by the world map's simulation (`world/balance.test.ts`) and the Rift's (`rift/balance.test.ts`,
// H51). Test support only: nothing in the game imports it.
import { autoAction } from '../rpg/battle/auto'
import { applyBattleAction, battleActionsLeft, createBattle } from '../rpg/battle/engine'
import type { BattleInput, BattleState } from '../rpg/battle/types'

export interface Played { won: boolean; rounds: number; hpLeft: number; lowest: number; kos: number; focus: number; mp: Record<string, number> }

/** Plays a fight with the shared Auto policy, and reads how it went: HP left, the lowest any Uma fell, knockouts, and the
 * share of the damage the most-hit Uma took. */
export function play(input: BattleInput): Played {
  let state: BattleState = createBattle(input).state
  const taken: Record<string, number> = {}
  const allyIds = new Set(input.allies.map((a) => a.id))
  const maxOf = (id: string) => input.allies.find((a) => a.id === id)!.stats.hp
  let lowest = 1, kos = 0
  for (let n = 0; n < 800 && state.outcome === 'active'; n++) {
    const ally = state.units.find((u) => u.side === 'ally' && u.hp > 0 && battleActionsLeft(state, u.id) > 0)
    if (!ally) break
    const step = applyBattleAction(state, autoAction(state, ally.id))
    for (const c of step.cues) {
      if (c.kind === 'hit' && allyIds.has(c.targetId) && c.actorId !== c.targetId) taken[c.targetId] = (taken[c.targetId] ?? 0) + c.amount
      if (c.kind === 'ko' && allyIds.has(c.targetId)) kos++
    }
    state = step.state
    for (const u of state.units) if (u.side === 'ally') lowest = Math.min(lowest, Math.max(0, u.hp) / maxOf(u.id))
  }
  const allies = state.units.filter((u) => u.side === 'ally')
  const total = Object.values(taken).reduce((a, b) => a + b, 0)
  return { won: state.outcome === 'victory', rounds: state.round,
    hpLeft: allies.reduce((n, u) => n + Math.max(0, u.hp), 0) / input.allies.reduce((n, a) => n + a.stats.hp, 0),
    lowest, kos, focus: total ? Math.max(...Object.values(taken)) / total : 0,
    mp: Object.fromEntries(allies.map((u) => [u.id, Math.max(0, u.mp)])) }
}
