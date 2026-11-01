// Test-only (excluded from the build): the frozen v20 replays that pin engine v20 (the trimmed halls, D261) under the combat
// pass (engine v21, D282). `v20-replays.fixture.json` holds six engine v20 fights played on Auto, generated before D282
// touched the engine: world bosses with guards covering their leaders, both healers and all six damage classes with their
// depth-5 riders, and a Rift stage. Each keeps its input, its action log, its final `battleStateHash` and a digest of its
// cues (v14's `cueDigest`, without labels). `v20-replays.test.ts` replays them under the live engine.
//
// The file regenerates only with `UPDATE_V20=1 npx vitest run src/rpg/battle/v20-replays.test.ts`, which should never be
// needed: a v20 fight replays forever.
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { riftFrontSpecs } from '../../rift/fronts'
import { riftBattleInput, riftFight, type RiftContext } from '../../rift/generate'
import { packRoster } from '../../rift/roster.fixture'
import { balanceMember, balanceStage, type BalanceOptions } from '../../world/balance-party'
import { regionChapter, worldContinent } from '../../world/world'
import type { RpgClass } from '../kinds'
import { autoAction } from './auto'
import { applyBattleAction, battleActionsLeft, createBattle } from './engine'
import type { BattleAction, BattleInput } from './types'
import { replayV14, type V14Replay } from './v14-replays.fixture'

export const V20_FIXTURE_PATH = join(__dirname, 'v20-replays.fixture.json')
export type V20Replay = V14Replay
export const replayV20 = replayV14
export const loadV20Replays = (): V20Replay[] => JSON.parse(readFileSync(V20_FIXTURE_PATH, 'utf8')) as V20Replay[]

// --- Regeneration (UPDATE_V20=1 only) ---------------------------------------------------------------------------------

const ENGINE = 20
const ON_CURVE: BalanceOptions = { gear: true, stars: true, heroes: true, engine: ENGINE }
/** Invented foe faces for the world stages, as the earlier replay fixtures use. */
const CAST = Array.from({ length: 30 }, (_, i) => ({ id: `c${i}`, name: `Rival ${i}` }))
interface V20Spec { name: string; input: () => BattleInput }

const stageOf = (order: number, region: number) =>
  regionChapter(worldContinent({ name: 'Sim', order }).regions[region]!, CAST, ENGINE).nodes.filter((n) => n.kind !== 'camp').at(-1)!
const PARTY_1: readonly RpgClass[] = ['brawler', 'mage', 'spellblade', 'summoner', 'paladin']
const PARTY_2: readonly RpgClass[] = ['brawler', 'mage', 'tomeblade', 'armsummoner', 'cleric']

function world(order: number, region: number, party: readonly RpgClass[], seed: number): V20Spec {
  return {
    name: `w${order}: region ${region + 1}'s boss stage, ${party.includes('paladin') ? 'the Paladin' : 'the Cleric'}'s party on curve`,
    input: () => {
      const node = stageOf(order, region)
      return balanceStage(node, seed, party.map((c, i) => balanceMember(c, i, node.level, ON_CURVE)), ENGINE)
    },
  }
}
const V20_SPECS: readonly V20Spec[] = [
  world(2, 1, PARTY_1, 20_001),
  world(3, 2, PARTY_2, 20_002),
  world(4, 3, PARTY_1, 20_003),
  world(5, 0, PARTY_2, 20_004),
  world(5, 4, PARTY_1, 20_005),
  { name: 'the Rift Iron front, stage 6: a boss and her guard', input: () => {
    const ctx: RiftContext = { tier: 1, runId: 't1-r3', roster: packRoster(), defeated: new Set() }
    const allies = riftFrontSpecs(ENGINE).iron.party.map((c, i) => balanceMember(c, i, 50, ON_CURVE))
    return riftBattleInput(riftFight(ctx, { kind: 'front', front: 'iron', stage: 6 }, ENGINE), allies, 20_006, ENGINE)
  } },
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

export function regenerateV20Replays(): V20Replay[] {
  const replays = V20_SPECS.map((spec): V20Replay => {
    const input = spec.input()
    if (input.version !== ENGINE) throw new Error(`${spec.name}: not a v20 fight`)
    const actions = playOnAuto(input)
    const { error, ...result } = replayV20(input, actions)
    if (error) throw new Error(`${spec.name}: ${error}`)
    return { name: spec.name, input, actions, ...result }
  })
  writeFileSync(V20_FIXTURE_PATH, `${JSON.stringify(replays)}\n`)
  return replays
}
