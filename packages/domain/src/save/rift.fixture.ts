// Test-only (excluded from the build): a v24 save with the Rift in use (D163, D171). Tier 1's first run is won and
// ascended, and its twenty live in Tier 2; its second is open, with twenty Tier 1 Umas, two fronts' traces and an open
// front fight (the world's third Rift fight). The account holds two achievements, the twenty's history and two faces.
import { autoAction } from '../rpg/battle/auto'
import { applyBattleAction, BATTLE_ENGINE_VERSION, createBattle } from '../rpg/battle/engine'
import type { BattleAction, BattleInput } from '../rpg/battle/types'
import { rpgFoe } from '../rpg/campaign/enemies'
import { riftBattleId, type RiftBattle, type RiftFightRef } from '../rift/state'
import { BALANCE_PARTY, balanceMember } from '../world/balance-party'
import { newOwnedUma, newSave, newTierWorld, type Save } from './save'

export const RIFT_TIMES = ['2026-10-01T12:00:00.000Z', '2026-10-05T12:00:00.000Z', '2026-10-09T12:00:00.000Z', '2026-10-09T13:00:00.000Z', '2026-10-10T12:00:00.000Z'] as const
const [T0, T1, T2, T3, T4] = RIFT_TIMES
const twenty = (from: number): string[] => Array.from({ length: 20 }, (_, i) => `${from + i}`)
/** Tier 1's Umas, on the open run `t1-r2`. */
export const TIER1_ROSTER = twenty(101)
/** The ascended run `t1-r1`'s Umas, now in Tier 2. */
export const TIER2_ROSTER = twenty(201)

/** A Rift fight: five Lv 50 balance Umas (outfit ids `100 + first` to `104 + first`) against one boss, and two legal
 * actions, the first two allies' Auto picks. */
export function riftFight(battleId: string, ref: RiftFightRef, first: number, startedAt: string): RiftBattle {
  const input: BattleInput = {
    version: BATTLE_ENGINE_VERSION, seed: 46,
    allies: BALANCE_PARTY.map((classId, k) => balanceMember(classId, first + k, 50)),
    enemies: [rpgFoe({ id: 'f1', castId: 'boss-c', element: 'fire', role: 'champion', rank: 'boss', level: 50, shield: 6,
      weaknesses: { weapons: ['greatsword'], elements: ['ice'] } })],
  }
  let state = createBattle(input).state
  const actions: BattleAction[] = []
  for (const ally of input.allies.slice(0, 2)) {
    const action = autoAction(state, ally.id)
    actions.push(action)
    state = applyBattleAction(state, action).state
  }
  return { battleId, ref, startedAt, input, actions }
}

export function riftSave(): Save {
  const save = newSave('Rift test', T0)
  const t1 = save.tierWorlds['1']!, t2 = newTierWorld(T3, 0)
  for (const id of TIER1_ROSTER) t1.umas[id] = newOwnedUma(T0)
  for (const id of TIER2_ROSTER) t2.umas[id] = newOwnedUma(T3)
  t1.rift = {
    runs: [
      { id: 't1-r1', roster: [...TIER2_ROSTER], startedAt: T0, fronts: { iron: 12, arcane: 12, duel: 12, horde: 12 }, convergence: { attempts: 2, open: null },
        traces: { iron: ['physical'], arcane: ['magical'], duel: ['physical', 'magical'], horde: ['physical', 'magical', 'ko'] }, wonAt: T2, ascendedAt: T3 },
      { id: 't1-r2', roster: [...TIER1_ROSTER], startedAt: T4, fronts: { iron: 12, arcane: 3, duel: 0, horde: 0 }, convergence: { attempts: 0, open: null },
        traces: { iron: ['physical'], arcane: ['magical', 'ko'] }, wonAt: null, ascendedAt: null },
    ],
    echoes: { iron: { '50': T1 } },
    battle: riftFight(riftBattleId(1, 3), { kind: 'front', front: 'arcane', stage: 4 }, 1, T4),
    battles: 3,
  }
  save.tierWorlds['2'] = t2
  save.account.achievements = { 't1-rift-conquered': { at: T2, run: 't1-r1' }, bestiary: { at: T4, run: null } }
  save.account.history = Object.fromEntries(TIER2_ROSTER.map((id) => [id, [{ tier: 2, at: T3, run: 't1-r1' }]]))
  save.account.defeated = { 'boss-a': T1, 'subboss-b': T4 }
  return save
}

/** `riftSave` with every front of `t1-r2` sealed and its first Convergence attempt open: the twenty in four parties of
 * five, the first fight won in 6 rounds, and the second fight open (the world's fourth), taken by the second party. */
export function convergenceSave(): Save {
  const save = riftSave(), rift = save.tierWorlds['1']!.rift, run = rift.runs[1]!
  run.fronts = { iron: 12, arcane: 12, duel: 12, horde: 12 }
  run.convergence = { attempts: 1, open: { parties: [0, 5, 10, 15].map((i) => TIER1_ROSTER.slice(i, i + 5)), rounds: [6] } }
  rift.battle = riftFight(riftBattleId(1, 4), { kind: 'convergence', fight: 1 }, 6, T4)
  rift.battles = 4
  return save
}
