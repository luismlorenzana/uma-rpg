// Test-only (excluded from the build): the frozen v17 replays that pin engine v17 (R2, the Tier rework's economy, live
// from H82 to H116) under weaknesses v2 (engine v18, H116, D235–D236). `v17-replays.fixture.json` holds seven engine
// v17 fights played on Auto, generated on the live v17 engine before H116 flipped it:
// - one world stage per Tier 1 continent: R2's balance party on curve on graded gear, with a Paladin in two and a
//   Cleric in three;
// - a Rift Duel champion (a third act, mixed locks) and a Rift Iron stage (the ward), each front's guided party on
//   v17's tuning.
// Each keeps its input, its action log, its final `battleStateHash` and a digest of its cues. `v17-replays.test.ts`
// replays them under the live engine, engine v18 since H116.
//
// The file regenerates only with `UPDATE_V17=1 npx vitest run src/rpg/battle/v17-replays.test.ts`, which should never
// be needed: a v17 fight replays forever. To pin another fight, add a `V17Spec` and regenerate only after confirming
// every existing entry returns byte for byte.
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { riftFrontSpecs } from '../../rift/fronts'
import { riftBattleInput, riftFight, type RiftContext } from '../../rift/generate'
import { packRoster } from '../../rift/roster.fixture'
import type { RiftFightRef } from '../../rift/state'
import { balanceMember, balanceStage, type BalanceOptions } from '../../world/balance-party'
import { regionChapter, worldContinent } from '../../world/world'
import { autoAction } from './auto'
import { applyBattleAction, battleActionsLeft, createBattle } from './engine'
import type { BattleAction, BattleAlly, BattleInput } from './types'
import { replayV14, type V14Replay } from './v14-replays.fixture'

export const V17_FIXTURE_PATH = join(__dirname, 'v17-replays.fixture.json')

export type V17Replay = V14Replay
export const replayV17 = replayV14

export const loadV17Replays = (): V17Replay[] => JSON.parse(readFileSync(V17_FIXTURE_PATH, 'utf8')) as V17Replay[]

// --- Regeneration (UPDATE_V17=1 only) ---------------------------------------------------------------------------------

const ENGINE = 17
const ON_CURVE: BalanceOptions = { gear: true, stars: true, heroes: true, engine: ENGINE }
/** Invented foe faces for the world stages, as the earlier replay fixtures use. */
const CAST = Array.from({ length: 30 }, (_, i) => ({ id: `c${i}`, name: `Rival ${i}` }))

interface V17Spec { name: string; input: () => BattleInput }

/** R2's balance party on curve at a level, on graded gear. */
const party = (level: number, healer: 'paladin' | 'cleric'): BattleAlly[] =>
  (['brawler', 'mage', 'spellblade', healer, 'summoner'] as const).map((c, i) => balanceMember(c, i, level, ON_CURVE))

/** A world stage: a continent region's boss stage, on v17. */
function world(order: number, region: number, healer: 'paladin' | 'cleric', seed: number): V17Spec {
  return {
    name: `w${order}: region ${region + 1}'s boss stage, R2's balance party on curve with a ${healer === 'paladin' ? 'Paladin' : 'Cleric'}`,
    input: () => {
      const node = regionChapter(worldContinent({ name: 'Sim', order }).regions[region]!, CAST).nodes.filter((n) => n.kind !== 'camp').at(-1)!
      return balanceStage(node, seed, party(node.level, healer), ENGINE)
    },
  }
}

/** A Rift front fight on a synthetic roster, by v17's guided party and tuning. */
function rift(name: string, ref: Extract<RiftFightRef, { kind: 'front' }>, seed: number): V17Spec {
  return { name, input: () => {
    const ctx: RiftContext = { tier: 1, runId: 't1-r2', roster: packRoster(), defeated: new Set() }
    const allies = riftFrontSpecs(ENGINE)[ref.front].party.map((c, i) => balanceMember(c, i, 50, ON_CURVE))
    return riftBattleInput(riftFight(ctx, ref, ENGINE), allies, seed, ENGINE)
  } }
}

export const V17_SPECS: readonly V17Spec[] = [
  world(1, 3, 'cleric', 17_001),
  world(2, 0, 'paladin', 17_002),
  world(3, 0, 'cleric', 17_003),
  world(4, 0, 'paladin', 17_004),
  world(5, 0, 'cleric', 17_005),
  rift('the Rift Duel champion: a third act and mixed locks', { kind: 'front', front: 'duel', stage: 12 }, 17_006),
  rift('the Rift Iron front, stage 5: the ward', { kind: 'front', front: 'iron', stage: 5 }, 17_007),
]

function playOnAuto(input: BattleInput): BattleAction[] {
  let state = createBattle(input).state
  const actions: BattleAction[] = []
  for (let n = 0; n < 2000 && state.outcome === 'active'; n++) {
    const actor = state.units.find((u) => u.side === 'ally' && u.hp > 0 && battleActionsLeft(state, u.id) > 0)
    if (!actor) break
    const action = autoAction(state, actor.id)
    const step = applyBattleAction(state, action)
    if (step.error) throw new Error(`Auto chose a refused action: ${step.error}`)
    actions.push(action)
    state = step.state
  }
  return actions
}

export function regenerateV17Replays(): V17Replay[] {
  const replays = V17_SPECS.map((spec): V17Replay => {
    const input = spec.input()
    if (input.version !== 17) throw new Error(`${spec.name}: not a v17 fight`)
    const actions = playOnAuto(input)
    const { error, ...result } = replayV17(input, actions)
    if (error) throw new Error(`${spec.name}: ${error}`)
    return { name: spec.name, input, actions, ...result }
  })
  writeFileSync(V17_FIXTURE_PATH, `${JSON.stringify(replays)}\n`)
  return replays
}
