// Test-only (excluded from the build): the frozen v19 replays that pin engine v19 (Classes v3 and Halls v2, live since
// H134) under the owner's trim of the halls (engine v20, D261). `v19-replays.fixture.json` holds eight engine v19 fights
// played on Auto, generated on the live v19 engine before D261 touched it:
// - a world stage per class of healer, on the balance party, Lv 30 and Lv 50 on curve on graded gear, and a Tier 0 party;
// - a Rift Duel champion and a Rift Iron stage on v19's guided parties;
// - **what D261 changes**, on the Rift Horde front's stage 6 and a world boss: the Heroes and Learners of the four seats it
//   closes (`brawler-3`, `brawler-4`, `mage-3`, `mage-4`) and the three seats it re-kinds (`healer-2`, `healer-3`,
//   `healer-4`).
// Each keeps its input, its action log, its final `battleStateHash` and a digest of its cues (v14's `cueDigest`, without
// labels). `v19-replays.test.ts` replays them under the live engine.
//
// The file regenerates only with `UPDATE_V19=1 npx vitest run src/rpg/battle/v19-replays.test.ts`, which should never be
// needed: a v19 fight replays forever. To pin another fight, add a `V19Spec` and regenerate only after confirming every
// existing entry returns byte for byte.
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { riftFrontSpecs } from '../../rift/fronts'
import { riftBattleInput, riftFight, type RiftContext } from '../../rift/generate'
import { packRoster } from '../../rift/roster.fixture'
import type { RiftFightRef } from '../../rift/state'
import { balanceMember, balanceStage, type BalanceOptions } from '../../world/balance-party'
import { regionChapter, worldContinent } from '../../world/world'
import type { HeroLimitId } from '../hero-id'
import type { RpgClass } from '../kinds'
import { autoAction } from './auto'
import { applyBattleAction, battleActionsLeft, createBattle } from './engine'
import type { BattleAction, BattleAlly, BattleInput } from './types'
import { replayV14, type V14Replay } from './v14-replays.fixture'

export const V19_FIXTURE_PATH = join(__dirname, 'v19-replays.fixture.json')

/** One pinned fight, in v14's shape: what it is, its frozen input and actions, and what replaying them must give. */
export type V19Replay = V14Replay
/** What replaying a pinned fight gives now, in the fixture's terms (v14's: the same digest, labels left out). */
export const replayV19 = replayV14

export const loadV19Replays = (): V19Replay[] => JSON.parse(readFileSync(V19_FIXTURE_PATH, 'utf8')) as V19Replay[]

// --- Regeneration (UPDATE_V19=1 only) ---------------------------------------------------------------------------------

const ENGINE = 19
const ON_CURVE: BalanceOptions = { gear: true, stars: true, heroes: true, engine: ENGINE }
/** Invented foe faces for the world stages, as the earlier replay fixtures use. */
const CAST = Array.from({ length: 30 }, (_, i) => ({ id: `c${i}`, name: `Rival ${i}` }))

interface V19Spec { name: string; input: () => BattleInput }

const m = (c: RpgClass, i: number, level: number): BattleAlly => balanceMember(c, i, level, ON_CURVE)
const stageOf = (order: number, region: number) =>
  regionChapter(worldContinent({ name: 'Sim', order }).regions[region]!, CAST).nodes.filter((n) => n.kind !== 'camp').at(-1)!

/** A Learner of one seat at Bond 10 instead of her class's first, or the Hero of a seat (no Learners of her own). */
const learner = (a: BattleAlly, limit: HeroLimitId): BattleAlly => ({ ...a, inherits: [{ limit, bond: 10, from: `hero-${limit}` }] })
const hero = (a: BattleAlly, limit: HeroLimitId): BattleAlly => {
  const { inherits: _, ...rest } = a
  return { ...rest, hero: limit }
}

/** A world stage: a continent region's boss stage, on v19. */
function world(order: number, region: number, healer: 'paladin' | 'cleric', seed: number): V19Spec {
  return {
    name: `w${order}: region ${region + 1}'s boss stage, the balance party on curve with a ${healer === 'paladin' ? 'Paladin' : 'Cleric'}`,
    input: () => {
      const node = stageOf(order, region)
      const l = node.level
      return balanceStage(node, seed, [m('brawler', 0, l), m('mage', 1, l), m('spellblade', 2, l), m(healer, 3, l), m('summoner', 4, l)], ENGINE)
    },
  }
}

/** A Rift front fight on a synthetic roster, by v19's guided party and tuning. */
function rift(name: string, ref: Extract<RiftFightRef, { kind: 'front' }>, seed: number): V19Spec {
  return { name, input: () => {
    const ctx: RiftContext = { tier: 1, runId: 't1-r3', roster: packRoster(), defeated: new Set() }
    const allies = riftFrontSpecs(ENGINE)[ref.front].party.map((c, i) => balanceMember(c, i, 50, ON_CURVE))
    return riftBattleInput(riftFight(ctx, ref, ENGINE), allies, seed, ENGINE)
  } }
}

/** D261's first party: a `brawler-3` and a `mage-4` Hero, a `brawler-4` Learner, a `healer-2` Hero and a `healer-3` Learner. */
function changedHeroes(level: number): BattleAlly[] {
  return [hero(m('brawler', 0, level), 'brawler-3'), hero(m('mage', 1, level), 'mage-4'), learner(m('spellblade', 2, level), 'brawler-4'),
    hero(m('paladin', 3, level), 'healer-2'), learner(m('summoner', 4, level), 'healer-3')]
}
/** D261's second: Heroes of `brawler-4`, `mage-3`, `healer-3` and `healer-4`, and a `mage-3` Learner. */
function changedLearners(level: number): BattleAlly[] {
  return [learner(m('brawler', 0, level), 'mage-3'), hero(m('mage', 1, level), 'brawler-4'), hero(m('spellblade', 2, level), 'mage-3'),
    hero(m('cleric', 3, level), 'healer-3'), hero(m('summoner', 4, level), 'healer-4')]
}

export const V19_SPECS: readonly V19Spec[] = [
  world(1, 3, 'cleric', 19_001),
  world(2, 0, 'paladin', 19_002),
  world(3, 0, 'cleric', 19_003),
  rift('the Rift Duel champion: a third act and mixed locks', { kind: 'front', front: 'duel', stage: 12 }, 19_004),
  rift('the Rift Iron front, stage 5: the ward', { kind: 'front', front: 'iron', stage: 5 }, 19_005),
  { name: 'a Tier 0 party on a Lv 5 stage', input: () => {
    const node = stageOf(1, 0)
    return balanceStage(node, 19_006, (['recruit', 'apprentice', 'duelist', 'acolyte', 'caller'] as const).map((c, i) => m(c, i, node.level)), ENGINE)
  } },
  { name: 'what D261 changes, on the Rift Horde front, stage 6: Heroes of brawler-3, mage-4 and healer-2, Learners of brawler-4 and healer-3',
    input: () => {
      const ctx: RiftContext = { tier: 1, runId: 't1-r3', roster: packRoster(), defeated: new Set() }
      return riftBattleInput(riftFight(ctx, { kind: 'front', front: 'horde', stage: 6 }, ENGINE), changedHeroes(50), 19_007, ENGINE)
    } },
  { name: 'what D261 changes, on a world boss: Heroes of brawler-4, mage-3, healer-3 and healer-4, a Learner of mage-3',
    input: () => balanceStage(stageOf(4, 0), 19_008, changedLearners(stageOf(4, 0).level), ENGINE) },
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

export function regenerateV19Replays(): V19Replay[] {
  const replays = V19_SPECS.map((spec): V19Replay => {
    const input = spec.input()
    if (input.version !== 19) throw new Error(`${spec.name}: not a v19 fight`)
    const actions = playOnAuto(input)
    const { error, ...result } = replayV19(input, actions)
    if (error) throw new Error(`${spec.name}: ${error}`)
    return { name: spec.name, input, actions, ...result }
  })
  writeFileSync(V19_FIXTURE_PATH, `${JSON.stringify(replays)}\n`)
  return replays
}
