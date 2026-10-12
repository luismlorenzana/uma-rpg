// A balance simulation for the world map (D72, D75, D77, D86, W3): a five-class party with expected skills plays every stage
// of a region at its level with a simple policy, and we read win rates. Run the full table with `SIM=1 npx vitest run
// src/world/balance.test.ts`; the always-on tests keep the shared Auto policy legal and the opening stages winnable.
import { describe, expect, it } from 'vitest'
import { autoAction } from '../rpg/battle/auto'
import { applyBattleAction, battleActionsLeft, createBattle } from '../rpg/battle/engine'
import { BATTLE_LIMIT_MAX } from '../rpg/battle/limit'
import type { BattleAlly, BattleInput, BattleState } from '../rpg/battle/types'
import type { RpgMapNode } from '../rpg/campaign/chapters'
import { rpgNode } from '../rpg/catalog'
import { RPG_FOE_TUNING } from '../rpg/campaign/enemies'
import {
  learnRpgNode, projectRpgStats, rpgActiveSlots, rpgDefaultWeapons, rpgLearnBlock, rpgLearnedSkills, rpgProfileTrees, RPG_DEPTH_GATES,
  type RpgClass, type RpgNodeRef, type RpgProfile,
} from '../rpg/rules'
import { regionChapter, worldContinent } from './world'

const cast = Array.from({ length: 30 }, (_, i) => ({ id: `c${i}`, name: `Rival ${i}` }))
const PARTY: readonly RpgClass[] = ['brawler', 'mage', 'spellblade', 'cleric', 'summoner']
/** A stage's fight as the game starts it: engine v8, every wave (W3). */
const stage = (node: RpgMapNode, seed: number, allies: BattleAlly[]): BattleInput =>
  ({ version: 8, seed, allies, enemies: node.enemies, ...(node.waves?.length ? { waves: node.waves } : {}) })
/** The Class Rank that opens `depths` depths at this level and no more (D102): the class played all along, or a depth short. */
const rankFor = (depths: number, level: number): number =>
  depths >= RPG_DEPTH_GATES.length ? Math.max(level, RPG_DEPTH_GATES.at(-1)!) : Math.max(1, Math.min(level, RPG_DEPTH_GATES[depths]! - 1))

/** An average invented outfit of a class, at a level and class rank, with side skills learned deepest first. */
function member(classId: RpgClass, i: number, level: number, rank: number, budget: number): BattleAlly {
  let profile: RpgProfile = { outfitId: `${100 + i}`, baseStats: { speed: 110, stamina: 110, power: 110, guts: 110, wit: 110 },
    growthRates: { speed: 0.1, stamina: 0.1, power: 0.1, guts: 0, wit: 0 }, classId, weapons: rpgDefaultWeapons(classId), tier: 1, level, exp: 0,
    tree: [], legacy: [], classRank: rankFor(rank, level) }
  for (let d = 5; d >= 1; d--) for (const tree of rpgProfileTrees(profile)) if (!rpgLearnBlock(profile, `${tree}.${d}a`)) profile = learnRpgNode(profile, `${tree}.${d}a`)
  // Equip the deepest skills, one weapon at a time, so every weapon brings something.
  const known = rpgLearnedSkills(profile).sort((a, b) => rpgNode(b.id)!.depth - rpgNode(a.id)!.depth)
  const loadout: RpgNodeRef[] = []
  for (let pass = 0; pass < 5 && loadout.length < rpgActiveSlots(level); pass++) {
    for (const w of profile.weapons) {
      const next = known.find((r) => rpgNode(r.id)!.weapon === w && !loadout.includes(r))
      if (next && loadout.length < rpgActiveSlots(level)) loadout.push(next)
    }
  }
  const stats = projectRpgStats(profile)
  const boosted = Object.fromEntries(Object.entries(stats).map(([k, v]) => [k, typeof v === 'number' ? Math.round(v * budget) : v])) as unknown as typeof stats
  return { id: profile.outfitId, classId, weapons: profile.weapons, tier: 1, level, stats: boosted, tree: profile.tree, legacy: [],
    loadout, mp: boosted.mp, classRank: profile.classRank }
}

/** Plays a fight: each ally picks her best affordable skill or Attack (a Spell Blade one of each half), weakness-aware. */
function play(input: BattleInput): { won: boolean; rounds: number; hpLeft: number; mp: Record<string, number> } {
  let state: BattleState = createBattle(input).state
  for (let n = 0; n < 600 && state.outcome === 'active'; n++) {
    const ally = state.units.find((u) => u.side === 'ally' && u.hp > 0 && battleActionsLeft(state, u.id) > 0)
    if (!ally) break
    state = applyBattleAction(state, autoAction(state, ally.id)).state
  }
  const allies = state.units.filter((u) => u.side === 'ally')
  const maxHp = state.input.allies.reduce((n, a) => n + a.stats.hp, 0)
  return { won: state.outcome === 'victory', rounds: state.round, hpLeft: allies.reduce((n, u) => n + Math.max(0, u.hp), 0) / maxHp,
    mp: Object.fromEntries(allies.map((u) => [u.id, Math.max(0, u.mp)])) }
}

/** A region's twelve stages back to back with MP carried and no Spring, the party at each stage's level (D97): how
 * many fall before the first loss. Takes the regions whose climb holds `level`. */
function run(level: number, rank: number): { cleared: number[]; mpLeft: number } {
  const continent = worldContinent({ name: 'Sim', order: Math.ceil(level / 10) })
  const cleared: number[] = []
  let mpLeft = 0
  for (const region of continent.regions.filter((r) => r.level <= level && level <= r.levelTop).slice(0, 4)) {
    let mp: Record<string, number> = {}
    let full = 0
    let n = 0
    let party = PARTY.map((c, i) => member(c, i, region.level, rank, 1))
    for (const node of regionChapter(region, cast).nodes.filter((x) => x.kind !== 'camp')) {
      party = PARTY.map((c, i) => member(c, i, node.level, rank, 1)).map((a) => ({ ...a, mp: Math.min(a.mp, mp[a.id] ?? a.mp) }))
      if (n === 0) full = party.reduce((m, a) => m + a.mp, 0)
      const r = play(stage(node, 2000 + n, party))
      if (!r.won) break
      n++
      mp = Object.fromEntries(party.map((a) => [a.id, r.mp[a.id] ?? a.mp]))
      party = party.map((a) => ({ ...a, mp: mp[a.id]! }))
    }
    cleared.push(n)
    mpLeft += party.reduce((m, a) => m + a.mp, 0) / full
  }
  return { cleared, mpLeft: mpLeft / Math.max(1, cleared.length) }
}

/** Win rate over every stage at a level across a continent's regions, by stage kind. */
function simulate(level: number, rank: number, gear: boolean): Record<'fight' | 'sub-boss' | 'boss', { wins: number; fights: number; rounds: number; hp: number }> {
  const continent = worldContinent({ name: 'Sim', order: Math.ceil(level / 10) })
  const budget = gear ? 1 + RPG_FOE_TUNING.budgetPerLevel * Math.max(0, level - RPG_FOE_TUNING.budgetFrom) : 1
  const party = PARTY.map((c, i) => member(c, i, level, rank, budget))
  const out = { fight: { wins: 0, fights: 0, rounds: 0, hp: 0 }, 'sub-boss': { wins: 0, fights: 0, rounds: 0, hp: 0 }, boss: { wins: 0, fights: 0, rounds: 0, hp: 0 } }
  for (const region of continent.regions.filter((r) => r.level <= level && level <= r.levelTop)) {
    regionChapter(region, cast).nodes.filter((n) => n.kind !== 'camp' && n.level === level).forEach((node, i) => {
      const r = play(stage(node, 1000 + i, party))
      const bucket = out[node.kind as 'fight' | 'sub-boss' | 'boss']
      bucket.fights++
      bucket.wins += r.won ? 1 : 0
      bucket.rounds += r.rounds
      bucket.hp += r.hpLeft
    })
  }
  return out
}

describe('world balance (D72, D86)', () => {
  it('uses each class’s first valid Limit option before a regular action', () => {
    const party = PARTY.map((classId, i) => member(classId, i, 10, 2, 1))
    const node = regionChapter(worldContinent({ name: 'Sim', order: 1 }).regions.find((region) => region.levelTop === 10)!, cast).nodes.at(-1)!
    for (const ally of party) {
      const state = createBattle(stage(node, 6999, party)).state
      state.units.find((unit) => unit.id === ally.id)!.limit = BATTLE_LIMIT_MAX
      const action = autoAction(state, ally.id)
      expect(action.kind, ally.classId).toBe('limit')
      expect(applyBattleAction(state, action).error, ally.classId).toBeUndefined()
    }
  })

  it('always chooses an accepted action across one region per continent at its level', () => {
    for (let order = 1; order <= 5; order++) {
      const region = worldContinent({ name: 'Sim', order }).regions[0]!
      const rank = RPG_DEPTH_GATES.filter((gate) => region.level >= gate).length
      const budget = 1 + RPG_FOE_TUNING.budgetPerLevel * Math.max(0, region.level - RPG_FOE_TUNING.budgetFrom)
      const party = PARTY.map((classId, i) => member(classId, i, region.level, rank, budget))
      for (const node of regionChapter(region, cast).nodes.filter((candidate) => candidate.kind !== 'camp')) {
        let state = createBattle(stage(node, 7000 + node.row, party)).state
        for (let n = 0; n < 600 && state.outcome === 'active'; n++) {
          const actor = state.units.find((unit) => unit.side === 'ally' && unit.hp > 0 && battleActionsLeft(state, unit.id) > 0)
          if (!actor) break
          const action = autoAction(state, actor.id)
          const step = applyBattleAction(state, action)
          expect(step.error, `${node.id}: ${JSON.stringify(action)}`).toBeUndefined()
          state = step.state
        }
      }
    }
  })

  it('lets a fresh Lv1 party win the opening pairs', () => {
    const party = PARTY.map((c, i) => member(c, i, 1, 1, 1))
    const meadow = regionChapter(worldContinent({ name: 'Sim', order: 1 }).regions[0]!, cast)
    const opening = meadow.nodes.filter((n) => n.kind === 'fight').slice(0, 2)
    for (const node of opening) expect(play(stage(node, 7, party)).won, node.id).toBe(true)
  })

  it.skipIf(!process.env.SIM)('prints win rates by level, rank and gear', () => {
    const rows: string[] = ['level | rank | gear | regular win% (rounds, hp left) | elite | boss']
    for (const level of [1, 3, 5, 10, 15, 20, 25, 30, 40, 50]) {
      // On time: the rank that opens every depth her level allows (D77); lagging: one rank short.
      const due = RPG_DEPTH_GATES.filter((gate) => level >= gate).length
      const scenarios: [string, number][] = due > 1 ? [['lag', due - 1], ['on time', due]] : [['on time', due]]
      for (const [label, rank] of scenarios) {
        for (const gear of [false, true]) {
          const r = simulate(level, rank, gear)
          const cell = (b: { wins: number; fights: number; rounds: number; hp: number }) =>
            `${Math.round((100 * b.wins) / Math.max(1, b.fights))}% (${(b.rounds / Math.max(1, b.fights)).toFixed(1)}r, ${Math.round((100 * b.hp) / Math.max(1, b.fights))}%)`
          rows.push(`Lv${level} | ${label} ${rank} | ${gear ? 'yes' : 'no'} | ${cell(r.fight)} | ${cell(r['sub-boss'])} | ${cell(r.boss)}`)
        }
      }
    }
    rows.push('', 'level | rank | stages cleared in a row per region (of 12), MP carried, no Spring | MP left')
    for (const level of [1, 5, 10, 15, 20, 30, 40, 50]) {
      const rank = RPG_DEPTH_GATES.filter((gate) => level >= gate).length
      const r = run(level, rank)
      rows.push(`Lv${level} | ${rank} | ${r.cleared.join(', ')} | ${Math.round(100 * r.mpLeft)}%`)
    }
    console.log(rows.join('\n'))
  }, 600_000)
})
