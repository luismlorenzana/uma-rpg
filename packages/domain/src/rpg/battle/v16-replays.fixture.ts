// Test-only (excluded from the build): the frozen v16 replays that pin engine v16 (R1, the Tier rework's fight, live from
// H72 to H82) under R2's economy (engine v17, H82, D218; R2's build decision 3, D208). `v16-replays.fixture.json` holds
// seven engine v16 fights played on Auto, generated on the live v16 engine before H82 flipped it:
// - one world stage per Tier 1 continent: R1's balance party on curve on today's gear (`BALANCE_KIT_V16`: the Brawler's
//   and the Spell Blade's Vampire Talisman, the Cleric's Spring Amulet, the Paladin's Thorn Talisman, two Siphon Amulets,
//   each Orb on her first slot's kind), with inherited Limit Breaks, healed by a Paladin in two and a Cleric in three, so
//   the supports run beside both kits;
// - a Rift Duel champion (a third act, mixed locks) and a Rift Iron stage (the ward), each front's guided party on v16's
//   tuning.
// Each keeps its input, its action log, its final `battleStateHash` and a digest of its cues (v14's `cueDigest`, without
// labels). `v16-replays.test.ts` replays them under the live engine, engine v17 since H82.
//
// The file regenerates only with `UPDATE_V16=1 npx vitest run src/rpg/battle/v16-replays.test.ts`, which should never be
// needed: a v16 fight replays forever. To pin another fight, add a `V16Spec` to `V16_SPECS` and regenerate once, on a
// commit where the existing fights still pass, so their entries come back byte for byte.
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

export const V16_FIXTURE_PATH = join(__dirname, 'v16-replays.fixture.json')

/** One pinned fight, in v14's shape: what it is, its frozen input and actions, and what replaying them must give. */
export type V16Replay = V14Replay
/** What replaying a pinned fight gives now, in the fixture's terms (v14's: the same digest, labels left out). */
export const replayV16 = replayV14

export const loadV16Replays = (): V16Replay[] => JSON.parse(readFileSync(V16_FIXTURE_PATH, 'utf8')) as V16Replay[]

// --- Regeneration (UPDATE_V16=1 only) ---------------------------------------------------------------------------------

const ENGINE = 16
const ON_CURVE: BalanceOptions = { gear: true, stars: true, heroes: true, engine: ENGINE }
/** Invented foe faces for the world stages, as H44's continent test uses. */
const CAST = Array.from({ length: 30 }, (_, i) => ({ id: `c${i}`, name: `Rival ${i}` }))

interface V16Spec { name: string; input: () => BattleInput }

/** R1's balance party (Brawler, Mage, Spell Blade, a healer and a Summoner) on curve at a level, on today's gear. */
const party = (level: number, healer: 'paladin' | 'cleric'): BattleAlly[] =>
  (['brawler', 'mage', 'spellblade', healer, 'summoner'] as const).map((c, i) => balanceMember(c, i, level, ON_CURVE))

/** A world stage: a continent's region's boss stage (its last fight), on v16. */
function world(order: number, region: number, healer: 'paladin' | 'cleric', seed: number): V16Spec {
  return {
    name: `w${order}: region ${region + 1}'s boss stage, R1's balance party on curve with a ${healer === 'paladin' ? 'Paladin' : 'Cleric'}`,
    input: () => {
      const node = regionChapter(worldContinent({ name: 'Sim', order }).regions[region]!, CAST).nodes.filter((n) => n.kind !== 'camp').at(-1)!
      return balanceStage(node, seed, party(node.level, healer), ENGINE)
    },
  }
}

/** A Rift front fight on a synthetic roster, by v16's guided party on curve at Lv 50 and v16's tuning. */
function rift(name: string, ref: Extract<RiftFightRef, { kind: 'front' }>, seed: number): V16Spec {
  return { name, input: () => {
    const ctx: RiftContext = { tier: 1, runId: 't1-r1', roster: packRoster(), defeated: new Set() }
    const allies = riftFrontSpecs(ENGINE)[ref.front].party.map((c, i) => balanceMember(c, i, 50, ON_CURVE))
    return riftBattleInput(riftFight(ctx, ref, ENGINE), allies, seed, ENGINE)
  } }
}

/** The fights the fixture pins, in order. Every input is engine v16, whatever the switch says. */
export const V16_SPECS: readonly V16Spec[] = [
  world(1, 3, 'cleric', 16_001),
  world(2, 0, 'paladin', 16_002),
  world(3, 0, 'cleric', 16_003),
  world(4, 0, 'paladin', 16_004),
  world(5, 0, 'cleric', 16_005),
  rift('the Rift Duel champion: a third act and mixed locks', { kind: 'front', front: 'duel', stage: 12 }, 16_006),
  rift('the Rift Iron front, stage 5: the ward', { kind: 'front', front: 'iron', stage: 5 }, 16_007),
]

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

/** Plays every spec and writes the fixture. Only `UPDATE_V16=1` calls it. */
export function regenerateV16Replays(): V16Replay[] {
  const replays = V16_SPECS.map((spec): V16Replay => {
    const input = spec.input()
    if (input.version !== 16) throw new Error(`${spec.name}: not a v16 fight`)
    const actions = playOnAuto(input)
    const { error, ...result } = replayV16(input, actions)
    if (error) throw new Error(`${spec.name}: ${error}`)
    return { name: spec.name, input, actions, ...result }
  })
  writeFileSync(V16_FIXTURE_PATH, `${JSON.stringify(replays)}\n`)
  return replays
}
