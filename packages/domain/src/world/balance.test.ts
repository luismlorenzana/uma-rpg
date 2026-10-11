// A balance simulation for the world map (D72, D75, D77, D86): a five-class party with expected skills plays every stage
// of a region at its level with a simple policy, and we read win rates. Run the full table with `SIM=1 npx vitest run
// src/world/balance.test.ts`; the always-on test only checks that the opening stages are winnable at Lv1.
import { describe, expect, it } from 'vitest'
import { applyBattleAction, battleActionsLeft, battleActorSkill, battleHitIsWeak, createBattle } from '../rpg/battle/engine'
import type { BattleAction, BattleAlly, BattleHalf, BattleInput, BattleState, BattleUnit } from '../rpg/battle/types'
import { rpgNode, type RpgSkillDef } from '../rpg/catalog'
import { depthsOpen } from '../economy/training'
import { RPG_FOE_TUNING } from '../rpg/campaign/enemies'
import {
  isRpgTome, learnRpgNode, projectRpgStats, rpgActiveSlots, rpgDefaultWeapons, rpgLearnBlock, rpgLearnedSkills, rpgProfileTrees, RPG_DEPTH_GATES,
  rpgWeaponKind, type RpgClass, type RpgNodeRef, type RpgProfile, type RpgWeapon,
} from '../rpg/rules'
import { regionChapter, worldContinent } from './world'

const cast = Array.from({ length: 30 }, (_, i) => ({ id: `c${i}`, name: `Rival ${i}` }))
const PARTY: readonly RpgClass[] = ['brawler', 'mage', 'spellblade', 'cleric', 'summoner']

/** An average invented outfit of a class, at a level and class rank, with side skills learned deepest first. */
function member(classId: RpgClass, i: number, level: number, rank: number, budget: number): BattleAlly {
  let profile: RpgProfile = { outfitId: `${100 + i}`, baseStats: { speed: 110, stamina: 110, power: 110, guts: 110, wit: 110 },
    growthRates: { speed: 0.1, stamina: 0.1, power: 0.1, guts: 0, wit: 0 }, classId, weapons: rpgDefaultWeapons(classId), tier: 1, level, exp: 0,
    tree: [], legacy: [], maxDepth: depthsOpen(rank) }
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
    loadout, mp: boosted.mp, maxDepth: depthsOpen(rank) }
}

/** How good a skill or Attack is against a foe now: power, more for weaknesses and every-foe reach. */
function score(state: BattleState, def: RpgSkillDef, foe: BattleUnit, foes: BattleUnit[]): number {
  const enemy = state.input.enemies.find((e) => e.id === foe.id)!
  const weak = def.hits.some((h) => h.parts.some((p) => battleHitIsWeak(enemy, foe, p.kind)))
  const total = def.hits.reduce((n, h) => n + h.power, 0)
  return total * (weak ? 1.6 : 1) * (def.target === 'all' ? foes.length * 0.55 : 1) / (foe.shield > 0 ? 1 : 0.6) + (def.status ? 0.5 : 0)
}
const attackDef = (w: RpgWeapon): RpgSkillDef => ({ target: 'one', hits: [{ power: 1, parts: [{ kind: rpgWeaponKind(w), share: 1 }] }], mp: 0, primary: rpgWeaponKind(w) })

/** Plays a fight: each ally picks her best affordable skill or Attack (a Spell Blade one of each half), weakness-aware. */
function play(input: BattleInput): { won: boolean; rounds: number; hpLeft: number; mp: Record<string, number> } {
  let state: BattleState = createBattle(input).state
  for (let n = 0; n < 600 && state.outcome === 'active'; n++) {
    const ally = state.units.find((u) => u.side === 'ally' && u.hp > 0 && battleActionsLeft(state, u.id) > 0)
    if (!ally) break
    const foes = state.units.filter((u) => u.side === 'enemy' && u.hp > 0)
    const source = state.input.allies.find((a) => a.id === ally.id)!
    const best = (tome: boolean | null, budget: number): { half: BattleHalf; mp: number; foe: BattleUnit } => {
      let pick: { half: BattleHalf; mp: number; foe: BattleUnit; score: number } = { half: { weapon: source.weapons.find((w) => tome === null || isRpgTome(w) === tome)! }, mp: 0, foe: foes[0]!, score: -1 }
      for (const foe of foes) {
        for (const w of source.weapons.filter((x) => tome === null || isRpgTome(x) === tome)) {
          const v = score(state, attackDef(w), foe, foes)
          if (v > pick.score) pick = { half: { weapon: w }, mp: 0, foe, score: v }
        }
        for (const ref of source.loadout) {
          const skill = battleActorSkill(state, ally.id, ref)
          if (!skill || skill.mp > budget || (tome !== null && isRpgTome(skill.node.weapon) !== tome)) continue
          const v = score(state, skill.def, foe, foes)
          if (v > pick.score) pick = { half: { skill: ref }, mp: skill.mp, foe, score: v }
        }
      }
      return pick
    }
    let action: BattleAction
    if (source.classId === 'spellblade') {
      const arms = best(false, ally.mp)
      const tome = best(true, ally.mp - arms.mp)
      action = arms.half.skill
        ? { kind: 'skill', actorId: ally.id, targetId: arms.foe.id, skill: arms.half.skill, pair: tome.half }
        : { kind: 'attack', actorId: ally.id, targetId: arms.foe.id, weapon: arms.half.weapon, pair: tome.half }
    } else {
      const pick = best(null, ally.mp)
      action = pick.half.skill ? { kind: 'skill', actorId: ally.id, targetId: pick.foe.id, skill: pick.half.skill }
        : { kind: 'attack', actorId: ally.id, targetId: pick.foe.id, weapon: pick.half.weapon }
    }
    const step = applyBattleAction(state, action)
    const friend = state.units.find((u) => u.side === 'ally' && u.hp > 0 && u.id !== ally.id)?.id ?? ally.id
    state = step.error ? applyBattleAction(state, { kind: 'guard', actorId: ally.id, targetId: friend }).state : step.state
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
    let party = PARTY.map((c, i) => member(c, i, level, rank, 1))
    const full = party.reduce((n, a) => n + a.mp, 0)
    let n = 0
    for (const node of regionChapter(region, cast).nodes.filter((x) => x.kind !== 'camp')) {
      const r = play({ version: 6, seed: 2000 + n, allies: party, enemies: node.enemies })
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
  const continent = worldContinent({ name: 'Sim', order: Math.ceil(level / 10) })
  const budget = gear ? 1 + RPG_FOE_TUNING.budgetPerLevel * Math.max(0, level - RPG_FOE_TUNING.budgetFrom) : 1
  const party = PARTY.map((c, i) => member(c, i, level, rank, budget))
  const out = { fight: { wins: 0, fights: 0, rounds: 0, hp: 0 }, 'sub-boss': { wins: 0, fights: 0, rounds: 0, hp: 0 }, boss: { wins: 0, fights: 0, rounds: 0, hp: 0 } }
  for (const region of continent.regions.filter((r) => r.level === level)) {
    regionChapter(region, cast).nodes.filter((n) => n.kind !== 'camp').forEach((node, i) => {
      const r = play({ version: 6, seed: 1000 + i, allies: party, enemies: node.enemies })
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
  it('lets a fresh Lv1 party win the opening pairs', () => {
    const party = PARTY.map((c, i) => member(c, i, 1, 1, 1))
    const meadow = regionChapter(worldContinent({ name: 'Sim', order: 1 }).regions[0]!, cast)
    const opening = meadow.nodes.filter((n) => n.kind === 'fight').slice(0, 2)
    for (const node of opening) expect(play({ version: 6, seed: 7, allies: party, enemies: node.enemies }).won, node.id).toBe(true)
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
