// Test-only (excluded from the build): scaffolding for the Rift's run rules (H48). Invented outfits, Lv 50 Umas from
// outfit id 101 in balance-party classes, the synthetic pack-sized enemy roster, and helpers that make the open Rift
// fight quick to win (every foe at 1 HP) or to lose (every Uma at 1 HP), then play it on Auto.
import { packRoster } from '../rift/roster.fixture'
import type { RiftBattle } from '../rift/state'
import { autoAction } from '../rpg/battle/auto'
import { battleActionsLeft } from '../rpg/battle/engine'
import type { BattleAlly, BattleEnemy, BattleInput } from '../rpg/battle/types'
import { BALANCE_PARTY } from '../world/balance-party'
import type { BattleOutfit } from './battle'
import { actInRiftFight, riftBattleStep, type RiftFightResult } from './rift'
import { worldOf } from './rules'
import { newOwnedUma, newSave, type Save } from './save'

/** Minute `n` after the fixture's start. */
export const T = (n: number): string => new Date(Date.UTC(2026, 9, 20, 12) + n * 60_000).toISOString()
export const ROSTER = packRoster()
export const ids = (from: number, n: number): string[] => Array.from({ length: n }, (_, i) => `${from + i}`)
/** The run's twenty, outfits 101–120. */
export const TWENTY = ids(101, 20)

/** An invented outfit. */
export const outfit = (id: string): BattleOutfit => ({
  outfitId: id, baseStats: { speed: 110, stamina: 110, power: 110, guts: 110, wit: 110 },
  growthRatePercents: { speed: 10, stamina: 10, power: 10, guts: 10, wit: 10 },
  aptitudes: { strategy: { front: 'A', pace: 'G', late: 'G', end: 'G' }, distance: { sprint: 'G', mile: 'G', medium: 'A', long: 'G' } },
})
export const OUTFITS: ReadonlyMap<string, BattleOutfit> = new Map(ids(101, 40).map((id) => [id, outfit(id)]))

/** Tier 1 with `count` Umas from outfit 101 at `level`, each a balance-party class in turn, filling parties 0, 1, 2… in
 * order, five each. */
export function riftWorldSave(count = 25, level = 50): Save {
  const save = newSave('Rift rules', T(0))
  const world = save.tierWorlds['1']!
  ids(101, count).forEach((id, i) => {
    world.umas[id] = { ...newOwnedUma(T(0)), level, classId: BALANCE_PARTY[i % BALANCE_PARTY.length]! }
    const party = world.parties[Math.floor(i / 5)]
    if (party) party.slots[i % 5] = id
  })
  return save
}

function withInput(save: Save, tier: string, change: (input: BattleInput) => BattleInput): Save {
  const world = worldOf(save, tier)
  const battle = world.rift.battle!
  return { ...save, tierWorlds: { ...save.tierWorlds, [tier]: { ...world, rift: { ...world.rift, battle: { ...battle, input: change(battle.input) } } } } }
}

/** Every foe of the open Rift fight, every wave, at 1 HP: the input is data, and the parser only needs it to replay. */
export function weaken(save: Save, tier = '1'): Save {
  const soft = (e: BattleEnemy): BattleEnemy => ({ ...e, stats: { ...e.stats, hp: 1 } })
  return withInput(save, tier, (input) => ({ ...input, enemies: input.enemies.map(soft), ...(input.waves ? { waves: input.waves.map((w) => w.map(soft)) } : {}) }))
}

/** Every Uma of the open Rift fight at 1 HP. */
export function doom(save: Save, tier = '1'): Save {
  const frail = (a: BattleAlly): BattleAlly => ({ ...a, stats: { ...a.stats, hp: 1 } })
  return withInput(save, tier, (input) => ({ ...input, allies: input.allies.map(frail) }))
}

/** Plays the open Rift fight on Auto to its end, from minute `from`; `battle` is the fight with every action taken. */
export function play(save: Save, from = 100, tier = '1'): { save: Save; result: RiftFightResult; battle: RiftBattle } {
  let s = save
  for (let n = 0; n < 2000; n += 1) {
    const world = worldOf(s, tier)
    const state = riftBattleStep(world)!.state
    const ally = state.units.find((u) => u.side === 'ally' && u.hp > 0 && battleActionsLeft(state, u.id) > 0)!
    const action = autoAction(state, ally.id)
    const open = world.rift.battle!
    const acted = actInRiftFight(s, action, ROSTER, T(from + n), tier)
    s = acted.save
    if (acted.result) return { save: s, result: acted.result, battle: { ...open, actions: [...open.actions, action] } }
  }
  throw new Error('the fight never ended')
}
