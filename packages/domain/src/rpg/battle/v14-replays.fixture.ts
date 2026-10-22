// Test-only (excluded from the build): the frozen v14 replays that pin classes v1 while classes v2 is built dark (H53,
// D179). `v14-replays.fixture.json` holds seven engine v14 fights played on Auto: one world stage per Tier 1 continent
// (the balance party on curve with inherited Limit Breaks and the presets' Orbs: Clerics' and Summoners' supports, Spell
// Blade pairs, Orb kinds and Limit Breaks all run), a Rift Duel champion (a third act, mixed locks) and a Rift Iron stage
// (the ward). Each keeps its input, its action log, its final `battleStateHash` and a digest of its cues. It was generated
// on the engine before H53 touched it. `v14-replays.test.ts` replays them under the live engine and
// `v14-replays-live15.test.ts` with the switch mocked to 15: every packet of classes v2 keeps both green.
//
// The file regenerates only with `UPDATE_V14=1 npx vitest run src/rpg/battle/v14-replays.test.ts`, which should never be
// needed: a v14 fight replays forever. To pin another fight, add a `V14Spec` to `V14_SPECS` and regenerate once, on a
// commit where the existing fights still pass, so their entries come back byte for byte.
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { RIFT_FRONT_SPECS } from '../../rift/fronts'
import { riftBattleInput, riftFight, type RiftContext } from '../../rift/generate'
import { packRoster } from '../../rift/roster.fixture'
import type { RiftFightRef } from '../../rift/state'
import { balanceMember, balanceParty, balanceStage, type BalanceOptions } from '../../world/balance-party'
import { regionChapter, worldContinent } from '../../world/world'
import { autoAction } from './auto'
import { applyBattleAction, battleActionsLeft, createBattle, replayBattle } from './engine'
import type { BattleAction, BattleAlly, BattleCue, BattleInput } from './types'

export const V14_FIXTURE_PATH = join(__dirname, 'v14-replays.fixture.json')

/** One pinned fight: what it is, its frozen input and actions, and what replaying them must give. */
export interface V14Replay {
  name: string
  input: BattleInput
  actions: BattleAction[]
  outcome: 'active' | 'victory' | 'loss'
  rounds: number
  hash: string
  cues: number
  /** sha256 of each cue's kind, actor, target, amount, channel, element and weak flag, in order. Labels are presentation
   * (a summon may be renamed by the live generation, H55), so they're left out. */
  cueDigest: string
}

/** A cue as the digest reads it. */
function cueRow(c: BattleCue): unknown[] {
  const f = c as Partial<Record<'actorId' | 'targetId' | 'amount' | 'channel' | 'element' | 'weak', unknown>>
  return [c.kind, f.actorId ?? null, f.targetId ?? null, f.amount ?? null, f.channel ?? null, f.element ?? null, f.weak ?? null]
}
export const cueDigest = (cues: readonly BattleCue[]): string =>
  createHash('sha256').update(JSON.stringify(cues.map(cueRow))).digest('hex').slice(0, 32)

/** What replaying a pinned fight gives now, in the fixture's terms. */
export function replayV14(input: BattleInput, actions: readonly BattleAction[]): Omit<V14Replay, 'name' | 'input' | 'actions'> & { error?: string } {
  const step = replayBattle(input, actions)
  return { outcome: step.state.outcome, rounds: step.state.round, hash: step.hash, cues: step.cues.length, cueDigest: cueDigest(step.cues),
    ...(step.error ? { error: step.error } : {}) }
}

export const loadV14Replays = (): V14Replay[] => JSON.parse(readFileSync(V14_FIXTURE_PATH, 'utf8')) as V14Replay[]

// --- Regeneration (UPDATE_V14=1 only) ---------------------------------------------------------------------------------

const ON_CURVE: BalanceOptions = { gear: true, stars: true, heroes: true }
/** Invented foe faces for the world stages, as H44's continent test uses. */
const CAST = Array.from({ length: 30 }, (_, i) => ({ id: `c${i}`, name: `Rival ${i}` }))

interface V14Spec { name: string; input: () => BattleInput }
/** The standard presets' Orbs (D164) on the Brawler and the Mage: an Orb's kind makes hits weak and breaks locks to v14. */
const withOrbs = (a: BattleAlly): BattleAlly =>
  a.classId === 'brawler' ? { ...a, orbs: ['fire'] } : a.classId === 'mage' ? { ...a, orbs: ['greatsword'] } : a
/** The fights the fixture pins, in order. Every input is engine v14, whatever the switch says. */
export const V14_SPECS: readonly V14Spec[] = [
  ...[1, 2, 3, 4, 5].map((order): V14Spec => ({
    name: `w${order}: the first region's boss stage, the balance party on curve with Orbs`,
    input: () => {
      const node = regionChapter(worldContinent({ name: 'Sim', order }).regions[0]!, CAST).nodes.filter((n) => n.kind !== 'camp').at(-1)!
      return { ...balanceStage(node, 14_000 + order, balanceParty(node.level, ON_CURVE).map(withOrbs)), version: 14 }
    },
  })),
  rift('the Rift Duel champion: a third act and mixed locks', { kind: 'front', front: 'duel', stage: 12 }, 14_006),
  rift('the Rift Iron front, stage 5: the ward', { kind: 'front', front: 'iron', stage: 5 }, 14_007),
]
/** A Rift front fight on a synthetic roster, by the front's guided party on curve at Lv 50. */
function rift(name: string, ref: Extract<RiftFightRef, { kind: 'front' }>, seed: number): V14Spec {
  return { name, input: () => {
    const ctx: RiftContext = { tier: 1, runId: 't1-r1', roster: packRoster(), defeated: new Set() }
    const allies = RIFT_FRONT_SPECS[ref.front].party.map((c, i) => balanceMember(c, i, 50, ON_CURVE))
    return { ...riftBattleInput(riftFight(ctx, ref), allies, seed), version: 14 }
  } }
}

/** Plays a fight to its end on Auto, keeping its actions. */
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

/** Plays every spec and writes the fixture. Only `UPDATE_V14=1` calls it. */
export function regenerateV14Replays(): V14Replay[] {
  const replays = V14_SPECS.map((spec): V14Replay => {
    const input = spec.input()
    if (input.version !== 14) throw new Error(`${spec.name}: not a v14 fight`)
    const actions = playOnAuto(input)
    const { error, ...result } = replayV14(input, actions)
    if (error) throw new Error(`${spec.name}: ${error}`)
    return { name: spec.name, input, actions, ...result }
  })
  writeFileSync(V14_FIXTURE_PATH, `${JSON.stringify(replays)}\n`)
  return replays
}
