// Test-only (excluded from the build): the frozen v15 replays that pin engine v15 while the Tier rework's fight (engine
// v16, R1) is built dark (H64, D200). `v15-replays.fixture.json` holds eight engine v15 fights played on Auto:
// - one world stage per Tier 1 continent: the v15 balance party on curve with inherited Limit Breaks, healed by a
//   Paladin in two of them and a Cleric in three, so both kits run (Barriers on every Uma, Aegis, Regen, drain);
// - a Rift Duel champion (a third act, mixed locks) and a Rift Iron stage (the ward) on v15's tuning;
// - **what R1 changes:** one fight whose party holds every node and Limit Break R1 moves: a Spell Blade with her Katana
//   Flurry line (3B–5B, Pierce's ids in v16), a Paladin on Greatsword, Axe, Lance, Light and Blizzard Tomes with
//   Valkyrie's Oath (`paladin-lance.4b`) and her Light tree's 3B, a Summoner with her two Axe summons (renamed in v16),
//   a Learner of Choir of Angels (`cleric-1`) and one of Rampart Charge (`paladin-3`); a revive and both Limit Breaks fire.
// Each keeps its input, its action log, its final `battleStateHash` and a digest of its cues (v14's `cueDigest`, without
// labels: v16 renames some nodes). It was generated on the engine before H64 touched it. `v15-replays.test.ts` replays
// them under the live engine and `v15-replays-live16.test.ts` with the switch mocked to 16: every R1 packet keeps both
// green, and H72's switch makes the mocked twin the live case.
//
// The file regenerates only with `UPDATE_V15=1 npx vitest run src/rpg/battle/v15-replays.test.ts`, which should never be
// needed: a v15 fight replays forever. To pin another fight, add a `V15Spec` to `V15_SPECS` and regenerate once, on a
// commit where the existing fights still pass, so their entries come back byte for byte.
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { equippedMight } from '../../economy/gear'
import { riftFrontSpecs } from '../../rift/fronts'
import { riftBattleInput, riftFight, type RiftContext } from '../../rift/generate'
import { packRoster } from '../../rift/roster.fixture'
import type { RiftFightRef } from '../../rift/state'
import { balanceMember, balanceStage, onCurveGrade, type BalanceOptions } from '../../world/balance-party'
import { regionChapter, worldContinent } from '../../world/world'
import type { HeroLimitId } from '../hero-id'
import { rpgNodeIdentity as rpgNode } from '../node-identity'
import {
  learnRpgNode, rpgActiveSlots, rpgLearnBlock, rpgLearnedSkills, rpgNodeKey, rpgProfileTrees, validRpgTree, type RpgClass, type RpgDamageKind, type RpgNodeRef, type RpgWeapon,
} from '../rules'
import { autoAction } from './auto'
import { applyBattleAction, battleActionsLeft, createBattle } from './engine'
import type { BattleAction, BattleAlly, BattleInput } from './types'
import { replayV14, type V14Replay } from './v14-replays.fixture'

export const V15_FIXTURE_PATH = join(__dirname, 'v15-replays.fixture.json')

/** One pinned fight, in v14's shape: what it is, its frozen input and actions, and what replaying them must give. */
export type V15Replay = V14Replay
/** What replaying a pinned fight gives now, in the fixture's terms (v14's: the same digest, labels left out). */
export const replayV15 = replayV14

export const loadV15Replays = (): V15Replay[] => JSON.parse(readFileSync(V15_FIXTURE_PATH, 'utf8')) as V15Replay[]

// --- Regeneration (UPDATE_V15=1 only) ---------------------------------------------------------------------------------

const ENGINE = 15
const ON_CURVE: BalanceOptions = { gear: true, stars: true, heroes: true, engine: ENGINE }
/** Invented foe faces for the world stages, as H44's continent test uses. */
const CAST = Array.from({ length: 30 }, (_, i) => ({ id: `c${i}`, name: `Rival ${i}` }))

interface V15Spec { name: string; input: () => BattleInput }

/** The v15 balance party (Brawler, Mage, Spell Blade, Summoner and a healer) on curve at a level. */
const party = (level: number, healer: 'paladin' | 'cleric'): BattleAlly[] =>
  (['brawler', 'mage', 'spellblade', healer, 'summoner'] as const).map((c, i) => balanceMember(c, i, level, ON_CURVE))

/** A world stage: a continent's region's boss stage (its last fight), on v15. */
function world(order: number, region: number, healer: 'paladin' | 'cleric', seed: number): V15Spec {
  return {
    name: `w${order}: region ${region + 1}'s boss stage, the v15 balance party on curve with a ${healer === 'paladin' ? 'Paladin' : 'Cleric'}`,
    input: () => {
      const node = regionChapter(worldContinent({ name: 'Sim', order }).regions[region]!, CAST).nodes.filter((n) => n.kind !== 'camp').at(-1)!
      return balanceStage(node, seed, party(node.level, healer), ENGINE)
    },
  }
}

/** A Rift front fight on a synthetic roster, by v15's guided party on curve at Lv 50 and v15's tuning. */
function rift(name: string, ref: Extract<RiftFightRef, { kind: 'front' }>, seed: number): V15Spec {
  return { name, input: () => {
    const ctx: RiftContext = { tier: 1, runId: 't1-r1', roster: packRoster(), defeated: new Set() }
    const allies = riftFrontSpecs(ENGINE)[ref.front].party.map((c, i) => balanceMember(c, i, 50, ON_CURVE))
    return riftBattleInput(riftFight(ctx, ref, ENGINE), allies, seed, ENGINE)
  } }
}

/**
 * A balance member re-specced: other weapons (her weapon Might follows them, her Orb's stays); the named side skills
 * learned first, then `balanceMember`'s A sides while her points last; the named skills equipped first and the rest of
 * her slots by depth as `balanceMember` fills them (or, `only`, nothing else); the Heroes she learns under (Bond 10); the
 * MP she carries in.
 */
function respec(a: BattleAlly, change: { weapons?: RpgWeapon[]; sides?: string[]; equip?: string[]; only?: boolean; inherits?: HeroLimitId[]; mp?: number }): BattleAlly {
  const weapons = change.weapons ?? a.weapons
  const grade = onCurveGrade(a.level)
  const pieces = (list: readonly RpgWeapon[]) => Object.fromEntries(list.map((w) => [w, `${w}-g${grade}`]))
  const before = equippedMight(pieces(a.weapons), a.weapons), after = equippedMight(pieces(weapons), weapons)
  const might: Partial<Record<RpgDamageKind, number>> = { ...after }
  for (const [k, n] of Object.entries(a.might ?? {}) as [RpgDamageKind, number][]) {
    const orb = n - (before[k] ?? 0)
    if (orb > 0) might[k] = (might[k] ?? 0) + orb
  }
  // Her named sides first, then the A side at every depth, deepest first, while her points last (`balanceMember`'s order).
  let profile = { classId: a.classId, weapons, tier: a.tier, classRank: a.classRank!, tree: [] as RpgNodeRef[], legacy: a.legacy }
  for (const id of change.sides ?? []) profile = learnRpgNode(profile, id)
  for (let d = 5; d >= 1; d--) for (const tree of rpgProfileTrees(profile)) if (!rpgLearnBlock(profile, `${tree}.${d}a`)) profile = learnRpgNode(profile, `${tree}.${d}a`)
  const tree = profile.tree
  if (!validRpgTree(profile)) throw new Error(`${a.id}: an invalid re-spec`)
  const known = rpgLearnedSkills(profile).sort((x, y) => rpgNode(y.id)!.depth - rpgNode(x.id)!.depth)
  const loadout: RpgNodeRef[] = (change.equip ?? []).map((id) => known.find((r) => r.id === id) ?? (() => { throw new Error(`${a.id}: ${id} unknown`) })())
  const slots = change.only ? 0 : rpgActiveSlots(a.level)
  for (let pass = 0; pass < 5 && loadout.length < slots; pass++) {
    for (const w of weapons) {
      const next = known.find((r) => rpgNode(r.id)!.weapon === w && !loadout.some((x) => rpgNodeKey(x) === rpgNodeKey(r)))
      if (next && loadout.length < slots) loadout.push(next)
    }
  }
  const inherits = change.inherits?.map((limit) => ({ limit, bond: 10, from: `hero-${limit}` }))
  return { ...a, weapons, tree, loadout, ...(Object.keys(might).length ? { might } : {}), ...(inherits ? { inherits } : {}),
    ...(change.mp !== undefined ? { mp: change.mp } : {}) }
}

/**
 * The party that holds every node and Limit Break R1 moves, at Lv 50 on curve: a Brawler learning under Rampart Charge's
 * seat, a Mage under Choir of Angels', and three re-specced so Auto casts each node. The Spell Blade equips only her
 * Flurry line, wears a Spring Amulet and carries 24 MP in, so she steps down 5B, 4B, 3B; the Paladin equips only
 * Valkyrie's Oath and her Light 3B; the Summoner, with no Siphon and 50 MP, a Fire summon and her two Axe summons.
 */
function r1Party(): BattleAlly[] {
  const m = (c: RpgClass, i: number, support?: string | null) =>
    balanceMember(c, i, 50, { ...ON_CURVE, ...(support !== undefined ? { support } : {}) })
  return [
    respec(m('brawler', 0), { inherits: ['paladin-3'] }),
    respec(m('mage', 1), { inherits: ['cleric-1'] }),
    respec(m('spellblade', 2, 'amulet-spring'), { sides: ['spellblade-katana.3b', 'spellblade-katana.4b', 'spellblade-katana.5b'], only: true,
      equip: ['spellblade-katana.5b', 'spellblade-katana.4b', 'spellblade-katana.3b'], mp: 24 }),
    respec(m('paladin', 3), { weapons: ['greatsword', 'axe', 'lance', 'tome-light', 'tome-ice'], sides: ['paladin-lance.4b', 'paladin-tome-light.3b'],
      only: true, equip: ['paladin-lance.4b', 'paladin-tome-light.3b'] }),
    respec(m('summoner', 4, null), { weapons: ['tome-fire', 'tome-ice', 'tome-lightning', 'axe', 'lance'], only: true,
      equip: ['summoner-tome-fire.5', 'summoner-axe.5', 'summoner-axe.2'], mp: 50 }),
  ]
}

/** The fights the fixture pins, in order. Every input is engine v15, whatever the switch says. */
export const V15_SPECS: readonly V15Spec[] = [
  world(1, 3, 'cleric', 15_001),
  world(2, 0, 'paladin', 15_002),
  world(3, 0, 'cleric', 15_003),
  world(4, 0, 'paladin', 15_004),
  world(5, 0, 'cleric', 15_005),
  rift('the Rift Duel champion: a third act and mixed locks', { kind: 'front', front: 'duel', stage: 12 }, 15_006),
  rift('the Rift Iron front, stage 5: the ward', { kind: 'front', front: 'iron', stage: 5 }, 15_007),
  {
    name: 'what R1 changes, on the Rift Horde champion: the Flurry line, Valkyrie\'s Oath and the Light 3B, the Axe summons, Choir of Angels and Rampart Charge, a revive',
    input: () => {
      const ctx: RiftContext = { tier: 1, runId: 't1-r1', roster: packRoster(), defeated: new Set() }
      return riftBattleInput(riftFight(ctx, { kind: 'front', front: 'horde', stage: 12 }, ENGINE), r1Party(), 15_028, ENGINE)
    },
  },
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

/** Plays every spec and writes the fixture. Only `UPDATE_V15=1` calls it. */
export function regenerateV15Replays(): V15Replay[] {
  const replays = V15_SPECS.map((spec): V15Replay => {
    const input = spec.input()
    if (input.version !== 15) throw new Error(`${spec.name}: not a v15 fight`)
    const actions = playOnAuto(input)
    const { error, ...result } = replayV15(input, actions)
    if (error) throw new Error(`${spec.name}: ${error}`)
    return { name: spec.name, input, actions, ...result }
  })
  writeFileSync(V15_FIXTURE_PATH, `${JSON.stringify(replays)}\n`)
  return replays
}
