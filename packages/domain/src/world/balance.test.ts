// A balance simulation for the world map (D72, D75, D77): a five-class party with expected skills plays every stage of a region
// at its level with a simple policy, and we read win rates. Run the full table with `SIM=1 npx vitest run
// src/world/balance.test.ts`; the always-on test only checks that the opening stages are winnable at Lv1.
import { describe, expect, it } from 'vitest'
import { applyBattleAction, battleActionsLeft, battleActorSkill, battleHitIsWeak, createBattle } from '../rpg/battle/engine'
import type { BattleAction, BattleAlly, BattleInput, BattleState } from '../rpg/battle/types'
import { depthsOpen } from '../economy/training'
import { RPG_FOE_TUNING } from '../rpg/campaign/enemies'
import { rpgNode } from '../rpg/catalog'
import { learnRpgNode, projectRpgStats, rpgActiveSlots, rpgLearnBlock, rpgProfileTrees, RPG_BUILD, RPG_DEPTH_GATES, type RpgBuildId, type RpgProfile } from '../rpg/rules'
import { rpgTreeNodes } from '../rpg/catalog'
import { regionChapter, worldContinent } from './world'

const cast = Array.from({ length: 30 }, (_, i) => ({ id: `c${i}`, name: `Rival ${i}` }))
const PARTY: readonly RpgBuildId[] = ['greatsword-spear', 'mage', 'spellblade', 'cleric', 'summoner']

/** An average invented outfit in a build, at a level and class rank, with its trees learned as far as points allow. */
function member(build: RpgBuildId, i: number, level: number, rank: number, budget: number): BattleAlly {
  const { classId, weapons } = RPG_BUILD[build]
  let profile: RpgProfile = { outfitId: `${100 + i}`, baseStats: { speed: 110, stamina: 110, power: 110, guts: 110, wit: 110 },
    growthRates: { speed: 0.1, stamina: 0.1, power: 0.1, guts: 0, wit: 0 }, classId, weapons: [...weapons], tier: 1, level, exp: 0, tree: [], legacy: [], maxDepth: depthsOpen(rank) }
  // Core nodes depth by depth across every branch, then side nodes, while points last.
  for (let pass = 0; pass < 2; pass++) {
    for (let d = 1; d <= 5; d++) {
      for (const tree of rpgProfileTrees(profile)) {
        for (const node of rpgTreeNodes(tree).filter((n) => n.depth === d && (pass === 0 ? n.variant === null : n.variant === 'a'))) {
          if (!rpgLearnBlock(profile, node.id)) profile = learnRpgNode(profile, node.id)
        }
      }
    }
  }
  const skills = profile.tree.filter((r) => rpgNode(r.id)?.skill).sort((a, b) => (rpgNode(b.id)!.depth - rpgNode(a.id)!.depth))
  const stats = projectRpgStats(profile)
  const boosted = Object.fromEntries(Object.entries(stats).map(([k, v]) => [k, typeof v === 'number' ? Math.round(v * budget) : v])) as unknown as typeof stats
  return { id: profile.outfitId, classId, weapons: [...weapons], tier: 1, level, stats: boosted, tree: profile.tree, legacy: [],
    loadout: skills.slice(0, rpgActiveSlots(level)), familiar: 'greatsword', mp: boosted.mp, maxDepth: depthsOpen(rank) }
}

/** Plays a fight: each ally uses her strongest affordable skill that hits a living foe's weakness, else attacks. */
function play(input: BattleInput): { won: boolean; rounds: number; hpLeft: number; mp: Record<string, number> } {
  let state: BattleState = createBattle(input).state
  for (let n = 0; n < 600 && state.outcome === 'active'; n++) {
    const ally = state.units.find((u) => u.side === 'ally' && u.hp > 0 && battleActionsLeft(state, u.id) > 0)
    if (!ally) break
    const foes = state.units.filter((u) => u.side === 'enemy' && u.hp > 0)
    const enemyOf = (id: string) => state.input.enemies.find((e) => e.id === id)!
    const source = state.input.allies.find((a) => a.id === ally.id)!
    let action: BattleAction | null = null
    if (source.classId === 'summoner' && state.familiars.includes(ally.id)) {
      const friend = state.units.find((u) => u.side === 'ally' && u.hp > 0 && u.id !== ally.id)
      if (friend && source.loadout.length === 0) action = { kind: 'guard', actorId: ally.id, targetId: friend.id }
    }
    let best = -1
    for (const ref of source.loadout) {
      const skill = battleActorSkill(state, ally.id, ref)
      if (!skill || skill.mp > ally.mp) continue
      for (const foe of foes) {
        const weak = skill.def.hits.some((h) => h.parts.some((p) => battleHitIsWeak(enemyOf(foe.id), foe, p.kind)))
        const score = skill.power * (weak ? 1.6 : 1) * (skill.def.target === 'all' ? foes.length * 0.55 : 1) / (foe.shield > 0 ? 1 : 0.6)
        if (score > best) { best = score; action = { kind: 'skill', actorId: ally.id, targetId: foe.id, skill: ref } }
      }
    }
    if (!action) {
      const foe = [...foes].sort((a, b) => a.shield - b.shield || a.hp - b.hp)[0]!
      action = source.classId === 'summoner' && state.familiars.includes(ally.id)
        ? { kind: 'guard', actorId: ally.id, targetId: state.units.find((u) => u.side === 'ally' && u.hp > 0 && u.id !== ally.id)?.id ?? ally.id }
        : { kind: 'attack', actorId: ally.id, targetId: foe.id }
    }
    const step = applyBattleAction(state, action)
    if (step.error) {
      const fallback = applyBattleAction(state, { kind: 'guard', actorId: ally.id, targetId: ally.id })
      state = fallback.state
    } else {
      state = step.state
    }
  }
  const allies = state.units.filter((u) => u.side === 'ally')
  const maxHp = state.input.allies.reduce((n, a) => n + a.stats.hp, 0)
  return { won: state.outcome === 'victory', rounds: state.round, hpLeft: allies.reduce((n, u) => n + Math.max(0, u.hp), 0) / maxHp,
    mp: Object.fromEntries(allies.map((u) => [u.id, Math.max(0, u.mp)])) }
}

/** A region's twelve stages back to back with MP carried and no Spring: how many fall before the first loss. */
function run(level: number, rank: number): { cleared: number[]; mpLeft: number } {
  const continent = worldContinent({ name: 'Sim', order: Math.ceil(level / 10) })
  const cleared: number[] = []
  let mpLeft = 0
  for (const region of continent.regions.filter((r) => r.level === level)) {
    let party = PARTY.map((b, i) => member(b, i, level, rank, 1))
    const full = party.reduce((n, a) => n + a.mp, 0)
    let n = 0
    for (const node of regionChapter(region, cast).nodes.filter((x) => x.kind !== 'camp')) {
      const r = play({ version: 5, seed: 2000 + n, allies: party, enemies: node.enemies })
      if (!r.won) break
      n++
      party = party.map((a) => ({ ...a, mp: r.mp[a.id] ?? a.mp }))
    }
    cleared.push(n)
    mpLeft += party.reduce((m, a) => m + a.mp, 0) / full
  }
  return { cleared, mpLeft: mpLeft / Math.max(1, cleared.length) }
}

/** Win rate over every stage of the four regions at a level, by stage kind. */
function simulate(level: number, rank: number, gear: boolean): Record<'fight' | 'sub-boss' | 'boss', { wins: number; fights: number; rounds: number; hp: number }> {
  const order = Math.ceil(level / 10)
  const continent = worldContinent({ name: 'Sim', order })
  const budget = gear ? 1 + RPG_FOE_TUNING.budgetPerLevel * Math.max(0, level - RPG_FOE_TUNING.budgetFrom) : 1
  const party = PARTY.map((b, i) => member(b, i, level, rank, budget))
  const out = { fight: { wins: 0, fights: 0, rounds: 0, hp: 0 }, 'sub-boss': { wins: 0, fights: 0, rounds: 0, hp: 0 }, boss: { wins: 0, fights: 0, rounds: 0, hp: 0 } }
  for (const region of continent.regions.filter((r) => r.level === level)) {
    const chapter = regionChapter(region, cast)
    chapter.nodes.filter((n) => n.kind !== 'camp').forEach((node, i) => {
      const r = play({ version: 5, seed: 1000 + i, allies: party, enemies: node.enemies })
      const bucket = out[node.kind as 'fight' | 'sub-boss' | 'boss']
      bucket.fights++
      bucket.wins += r.won ? 1 : 0
      bucket.rounds += r.rounds
      bucket.hp += r.hpLeft
    })
  }
  return out
}

describe('world balance (D72)', () => {
  it('lets a fresh Lv1 party win the opening pairs', () => {
    const party = PARTY.map((b, i) => member(b, i, 1, 1, 1))
    const meadow = regionChapter(worldContinent({ name: 'Sim', order: 1 }).regions[0]!, cast)
    const opening = meadow.nodes.filter((n) => n.kind === 'fight').slice(0, 2)
    for (const node of opening) expect(play({ version: 5, seed: 7, allies: party, enemies: node.enemies }).won, node.id).toBe(true)
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
