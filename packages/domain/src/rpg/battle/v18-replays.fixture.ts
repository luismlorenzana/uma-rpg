// Test-only (excluded from the build): the frozen v18 replays that pin engine v18 (weaknesses v2, live since H116, D237)
// while Classes v3 and Halls v2 are built dark at engine v19 (H126, D240–D241). `v18-replays.fixture.json` holds eight
// engine v18 fights played on Auto, generated on the live v18 engine before H126 touched it:
// - one world stage per Tier 1 continent: R2's balance party on curve on graded gear, with a Paladin in two and a
//   Cleric in three; the Brawler's preset Bell, and an Insignia on the Mage in w3;
// - a Rift Duel champion (a third act, mixed locks) and a Rift Iron stage (the ward), each front's guided party on v18's
//   tuning;
// - **what H128 and H129 change**, on the Rift Horde front's stage 6: a Brawler on Bow, Katana and Greatsword with her Bow on line
//   B (the splash), a Mage on Light, Dark and Fire Tomes learning under a `cleric-*` seat, a Spell Blade (her Arms half's
//   extra hit), a Summoner (her farewell; Dark, Light and Bow summons) and a Paladin, the Hero of a `paladin-*` seat.
// Each keeps its input, its action log, its final `battleStateHash` and a digest of its cues (v14's `cueDigest`, without
// labels). `v18-replays.test.ts` replays them under the live engine and `v18-replays-live19.test.ts` with the switch
// mocked to 19.
//
// The file regenerates only with `UPDATE_V18=1 npx vitest run src/rpg/battle/v18-replays.test.ts`, which should never be
// needed: a v18 fight replays forever. To pin another fight, add a `V18Spec` and regenerate only after confirming every
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

export const V18_FIXTURE_PATH = join(__dirname, 'v18-replays.fixture.json')

/** One pinned fight, in v14's shape: what it is, its frozen input and actions, and what replaying them must give. */
export type V18Replay = V14Replay
/** What replaying a pinned fight gives now, in the fixture's terms (v14's: the same digest, labels left out). */
export const replayV18 = replayV14

export const loadV18Replays = (): V18Replay[] => JSON.parse(readFileSync(V18_FIXTURE_PATH, 'utf8')) as V18Replay[]

// --- Regeneration (UPDATE_V18=1 only) ---------------------------------------------------------------------------------

const ENGINE = 18
const ON_CURVE: BalanceOptions = { gear: true, stars: true, heroes: true, engine: ENGINE }
/** Invented foe faces for the world stages, as the earlier replay fixtures use. */
const CAST = Array.from({ length: 30 }, (_, i) => ({ id: `c${i}`, name: `Rival ${i}` }))

interface V18Spec { name: string; input: () => BattleInput }

/** R2's balance party on curve at a level, on graded gear; `insignia` puts an Insignia in the Mage's accessory slot. */
const party = (level: number, healer: 'paladin' | 'cleric', insignia = false): BattleAlly[] =>
  (['brawler', 'mage', 'spellblade', healer, 'summoner'] as const).map((c, i) =>
    balanceMember(c, i, level, { ...ON_CURVE, ...(insignia && c === 'mage' ? { accessory: { family: 'insignia' } } : {}) }))

/** A world stage: a continent region's boss stage, on v18. */
function world(order: number, region: number, healer: 'paladin' | 'cleric', seed: number, insignia = false): V18Spec {
  return {
    name: `w${order}: region ${region + 1}'s boss stage, R2's balance party on curve with a ${healer === 'paladin' ? 'Paladin' : 'Cleric'}` +
      (insignia ? ', the Mage with an Insignia' : ''),
    input: () => {
      const node = regionChapter(worldContinent({ name: 'Sim', order }).regions[region]!, CAST).nodes.filter((n) => n.kind !== 'camp').at(-1)!
      return balanceStage(node, seed, party(node.level, healer, insignia), ENGINE)
    },
  }
}

/** A Rift front fight on a synthetic roster, by v18's guided party and tuning. */
function rift(name: string, ref: Extract<RiftFightRef, { kind: 'front' }>, seed: number): V18Spec {
  return { name, input: () => {
    const ctx: RiftContext = { tier: 1, runId: 't1-r3', roster: packRoster(), defeated: new Set() }
    const allies = riftFrontSpecs(ENGINE)[ref.front].party.map((c, i) => balanceMember(c, i, 50, ON_CURVE))
    return riftBattleInput(riftFight(ctx, ref, ENGINE), allies, seed, ENGINE)
  } }
}

/** A Learner of one seat at Bond 10 instead of her class's first, or the Hero of a seat (no Learners of her own). */
const learner = (a: BattleAlly, limit: HeroLimitId): BattleAlly => ({ ...a, inherits: [{ limit, bond: 10, from: `hero-${limit}` }] })
const hero = (a: BattleAlly, limit: HeroLimitId): BattleAlly => {
  const { inherits: _, ...rest } = a
  return { ...rest, hero: limit }
}

/** The party that holds what H128 (the weapon shapes) and H129 (the Limit Breaks) change, at Lv 50 on curve. */
function changesParty(): BattleAlly[] {
  const m = (c: RpgClass, i: number, more: BalanceOptions = {}) => balanceMember(c, i, 50, { ...ON_CURVE, ...more })
  return [
    m('brawler', 0, { weapons: ['bow', 'katana', 'greatsword'], lines: { bow: 'B' } }),
    learner(m('mage', 1, { weapons: ['tome-light', 'tome-dark', 'tome-fire'] }), 'cleric-1'),
    m('spellblade', 2),
    hero(m('paladin', 3), 'paladin-1'),
    m('summoner', 4),
  ]
}

export const V18_SPECS: readonly V18Spec[] = [
  world(1, 3, 'cleric', 18_001),
  world(2, 0, 'paladin', 18_002),
  world(3, 0, 'cleric', 18_003, true),
  world(4, 0, 'paladin', 18_004),
  world(5, 0, 'cleric', 18_005),
  rift('the Rift Duel champion: a third act and mixed locks', { kind: 'front', front: 'duel', stage: 12 }, 18_006),
  rift('the Rift Iron front, stage 5: the ward', { kind: 'front', front: 'iron', stage: 5 }, 18_007),
  {
    name: 'what H128 and H129 change, on the Rift Horde front, stage 6: the Brawler\'s Bow B splash, Katana, Light, Dark and Bow skills, ' +
      'the Spell Blade\'s extra hit, the Summoner\'s farewell, a cleric-1 Learner and a paladin-1 Hero',
    input: () => {
      const ctx: RiftContext = { tier: 1, runId: 't1-r3', roster: packRoster(), defeated: new Set() }
      return riftBattleInput(riftFight(ctx, { kind: 'front', front: 'horde', stage: 6 }, ENGINE), changesParty(), 18_008, ENGINE)
    },
  },
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

export function regenerateV18Replays(): V18Replay[] {
  const replays = V18_SPECS.map((spec): V18Replay => {
    const input = spec.input()
    if (input.version !== 18) throw new Error(`${spec.name}: not a v18 fight`)
    const actions = playOnAuto(input)
    const { error, ...result } = replayV18(input, actions)
    if (error) throw new Error(`${spec.name}: ${error}`)
    return { name: spec.name, input, actions, ...result }
  })
  writeFileSync(V18_FIXTURE_PATH, `${JSON.stringify(replays)}\n`)
  return replays
}
