// The balance simulation for the world map (combat-balance.md §6.0): a five-class party built through the game's own
// rules plays every stage at its level on the current engine with the shared Auto policy. Run the full table with
// `SIM=1 npx vitest run src/world/balance.test.ts`; the always-on tests keep Auto legal and the opening stages winnable.
import { describe, expect, it } from 'vitest'
import { autoAction } from '../rpg/battle/auto'
import { applyBattleAction, battleActionsLeft, createBattle } from '../rpg/battle/engine'
import { BATTLE_LIMIT_MAX } from '../rpg/battle/limit'
import type { BattleInput, BattleState } from '../rpg/battle/types'
import type { RpgMapNode } from '../rpg/campaign/chapters'
import { balanceMember, balanceParty, balanceStage, type BalanceOptions } from './balance-party'
import { rpgFoe } from '../rpg/campaign/enemies'
import { MIGHT_BY_GRADE } from '../economy/gear'
import { regionChapter, worldContinent } from './world'

const cast = Array.from({ length: 30 }, (_, i) => ({ id: `c${i}`, name: `Rival ${i}` }))

interface Played { won: boolean; rounds: number; hpLeft: number; lowest: number; kos: number; focus: number; mp: Record<string, number> }
/** Plays a fight with the shared Auto policy, and reads how it went: HP left, the lowest any Uma fell, knockouts, and the
 * share of the damage the most-hit Uma took. */
function play(input: BattleInput): Played {
  let state: BattleState = createBattle(input).state
  const taken: Record<string, number> = {}
  const allyIds = new Set(input.allies.map((a) => a.id))
  const maxOf = (id: string) => input.allies.find((a) => a.id === id)!.stats.hp
  let lowest = 1, kos = 0
  for (let n = 0; n < 800 && state.outcome === 'active'; n++) {
    const ally = state.units.find((u) => u.side === 'ally' && u.hp > 0 && battleActionsLeft(state, u.id) > 0)
    if (!ally) break
    const step = applyBattleAction(state, autoAction(state, ally.id))
    for (const c of step.cues) {
      if (c.kind === 'hit' && allyIds.has(c.targetId) && c.actorId !== c.targetId) taken[c.targetId] = (taken[c.targetId] ?? 0) + c.amount
      if (c.kind === 'ko' && allyIds.has(c.targetId)) kos++
    }
    state = step.state
    for (const u of state.units) if (u.side === 'ally') lowest = Math.min(lowest, Math.max(0, u.hp) / maxOf(u.id))
  }
  const allies = state.units.filter((u) => u.side === 'ally')
  const total = Object.values(taken).reduce((a, b) => a + b, 0)
  return { won: state.outcome === 'victory', rounds: state.round,
    hpLeft: allies.reduce((n, u) => n + Math.max(0, u.hp), 0) / input.allies.reduce((n, a) => n + a.stats.hp, 0),
    lowest, kos, focus: total ? Math.max(...Object.values(taken)) / total : 0,
    mp: Object.fromEntries(allies.map((u) => [u.id, Math.max(0, u.mp)])) }
}

type Kind = 'fight' | 'sub-boss' | 'boss'
interface Bucket { n: number; wins: number; rounds: number; hp: number; lowest: number; kos: number; focus: number }
const empty = (): Bucket => ({ n: 0, wins: 0, rounds: 0, hp: 0, lowest: 0, kos: 0, focus: 0 })
/** A tier level's lifetime level: Tier 2 Lv 1 is 51. */
const lifetimeOf = (level: number, tier = 1) => 50 * (tier - 1) + level
/** The regions holding a tier level, on its continent of that tier: Tier 2 Lv 1–10 is `w6`. */
const regionsAt = (level: number, tier = 1) => {
  const lifetime = lifetimeOf(level, tier)
  return worldContinent({ name: 'Sim', order: 5 * (tier - 1) + Math.ceil(level / 10) }).regions.filter((r) => r.level <= lifetime && lifetime <= r.levelTop)
}

/** Every stage at a tier level across a continent's regions, by stage kind; `options.tier` picks the tier (H45). */
export function simulate(level: number, options: BalanceOptions): Record<Kind, Bucket> {
  const party = balanceParty(level, options)
  const lifetime = lifetimeOf(level, options.tier)
  const out: Record<Kind, Bucket> = { fight: empty(), 'sub-boss': empty(), boss: empty() }
  for (const region of regionsAt(level, options.tier)) {
    regionChapter(region, cast).nodes.filter((n) => n.kind !== 'camp' && n.level === lifetime).forEach((node, i) => {
      const r = play(balanceStage(node, 1000 + i, party))
      const b = out[node.kind as Kind]
      b.n++; b.wins += r.won ? 1 : 0; b.rounds += r.rounds; b.hp += r.hpLeft; b.lowest += r.lowest; b.kos += r.kos; b.focus += r.focus
    })
  }
  return out
}

/** A region's twelve stages back to back with MP carried and no Spring, the party at each stage's level (D97): how many
 * fall before the first loss, and the MP left. */
function run(level: number, options: BalanceOptions): { cleared: number[]; mpLeft: number } {
  const cleared: number[] = []
  let mpLeft = 0
  for (const region of regionsAt(level).slice(0, 4)) {
    let mp: Record<string, number> = {}
    let full = 0, n = 0
    let party = balanceParty(region.level, options)
    for (const node of regionChapter(region, cast).nodes.filter((x) => x.kind !== 'camp')) {
      party = balanceParty(node.level, options).map((a) => ({ ...a, mp: Math.min(a.mp, mp[a.id] ?? a.mp) }))
      if (n === 0) full = party.reduce((m, a) => m + a.mp, 0)
      const r = play(balanceStage(node, 2000 + n, party))
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

const ON_CURVE: BalanceOptions = { gear: true, stars: true, heroes: true }
const GEARED: BalanceOptions = { gear: true, heroes: true }
/** A freshly ascended party (tiers §5): Tier 2 Lv 1, Training gear, an empty Extra Stats map, no Heroes, Class Rank 1. */
const FRESH_T2: BalanceOptions = { tier: 2, classRank: 1 }
const pct = (x: number) => `${Math.round(100 * x)}%`
const cell = (b: Bucket) => b.n ? `${pct(b.wins / b.n)} ${(b.rounds / b.n).toFixed(1)}r hp ${pct(b.hp / b.n)} low ${pct(b.lowest / b.n)} ko ${(b.kos / b.n).toFixed(1)} focus ${pct(b.focus / b.n)}` : '—'

describe('world balance', () => {
  it('uses each Learner’s Limit Break before a regular action', () => {
    const party = balanceParty(10, ON_CURVE)
    const node = regionChapter(worldContinent({ name: 'Sim', order: 1 }).regions.find((region) => region.levelTop === 10)!, cast).nodes.at(-1)!
    for (const ally of party) {
      const state = createBattle(balanceStage(node, 6999, party)).state
      state.units.find((unit) => unit.id === ally.id)!.limit = BATTLE_LIMIT_MAX
      const action = autoAction(state, ally.id)
      expect(action.kind, ally.classId).toBe('limit')
      expect(applyBattleAction(state, action).error, ally.classId).toBeUndefined()
    }
  })

  it('always chooses an accepted action across one region per continent at its level', () => {
    for (let order = 1; order <= 5; order++) {
      const region = worldContinent({ name: 'Sim', order }).regions[0]!
      const party = balanceParty(region.level, ON_CURVE)
      for (const node of regionChapter(region, cast).nodes.filter((candidate) => candidate.kind !== 'camp')) {
        let state = createBattle(balanceStage(node, 7000 + node.row, party)).state
        for (let n = 0; n < 800 && state.outcome === 'active'; n++) {
          const actor = state.units.find((unit) => unit.side === 'ally' && unit.hp > 0 && battleActionsLeft(state, unit.id) > 0)
          if (!actor) break
          const action = autoAction(state, actor.id)
          const step = applyBattleAction(state, action)
          expect(step.error, `${node.id}: ${JSON.stringify(action)}`).toBeUndefined()
          state = step.state
        }
      }
    }
  }, 20_000) // ~0.6 s alone; over 4 s on CI's shared runner, next to the default 5 s

  it('sets each weapon grade’s Might to about 6% a grade of an on-curve Uma’s hit at the level it opens (D142)', () => {
    for (let g = 1; g <= 10; g++) {
      const level = 5 * g - 4
      const foe = rpgFoe({ id: 'f', castId: 'c', element: 'fire', role: 'striker', rank: 'regular', level, shield: 2, weaknesses: { weapons: [], elements: [] } })
      // The three offense leans: Brawler high ATK, Spell Blade even, Mage high M.ATK.
      const boosts = (['brawler', 'spellblade', 'mage'] as const).map((c) => {
        const a = balanceMember(c, 0, level, { gear: true, stars: true })
        const [o, d] = c === 'mage' ? [a.stats.matk, foe.stats.mdef] : [a.stats.atk, foe.stats.pdef]
        const f = (x: number) => (x * x) / (x + d)
        return f(o + MIGHT_BY_GRADE[g]!) / f(o) - 1
      })
      const mean = boosts.reduce((n, b) => n + b, 0) / boosts.length
      expect(Math.abs(mean - 0.06 * g), `grade ${g}`).toBeLessThan(0.02)
    }
  })

  it('lets a fresh Lv1 party win the opening pairs', () => {
    const party = balanceParty(1)
    const meadow = regionChapter(worldContinent({ name: 'Sim', order: 1 }).regions[0]!, cast)
    const opening = meadow.nodes.filter((n: RpgMapNode) => n.kind === 'fight').slice(0, 2)
    for (const node of opening) expect(play(balanceStage(node, 7, party)).won, node.id).toBe(true)
  })

  it('lets a freshly ascended Tier 2 party win w6’s Meadow’s opening pairs (Z3, H45)', () => {
    // Tier 2 Lv 1 with lifetime 51's stats, Training gear, no Extra Stats, no Heroes, Class Rank 1 (tiers §5).
    const party = balanceParty(1, FRESH_T2)
    const meadow = regionChapter(worldContinent({ name: 'Sim', order: 6 }).regions[0]!, cast)
    const opening = meadow.nodes.filter((n: RpgMapNode) => n.kind === 'fight').slice(0, 2)
    expect(opening.map((n) => n.level)).toEqual([51, 51])
    for (const node of opening) expect(play(balanceStage(node, 7, party)).won, node.id).toBe(true)
  })

  it.skipIf(!process.env.SIM)('prints win rates by level: bare, geared (no Extra Stats) and on curve', () => {
    const rows: string[] = ['level | party | regular | elite | boss']
    // `SIM_LEVELS=5,25,50` narrows the table while tuning.
    const levels = process.env.SIM_LEVELS ? process.env.SIM_LEVELS.split(',').map(Number) : [1, 5, 10, 15, 20, 25, 30, 40, 50]
    // Tier 2 (H45): a freshly ascended party on `w6`'s 40 opening stages (rows 1–5, stages 1–2, lifetime 51), then Tier 2
    // on curve beside Tier 1 at each tier level.
    const fresh = simulate(1, FRESH_T2)
    rows.push(`T2 Lv1 | fresh, ${fresh.fight.n} stages | ${cell(fresh.fight)} | ${cell(fresh['sub-boss'])} | ${cell(fresh.boss)}`)
    for (const level of levels) {
      for (const [label, options] of [['bare', {}], ['geared', GEARED], ['on curve', ON_CURVE], ['T2 on curve', { ...ON_CURVE, tier: 2 }]] as const) {
        const r = simulate(level, options)
        rows.push(`Lv${level} | ${label} | ${cell(r.fight)} | ${cell(r['sub-boss'])} | ${cell(r.boss)}`)
      }
    }
    rows.push('', 'level | stages cleared in a row per region (of 12), on curve, MP carried, no Spring | MP left')
    for (const level of process.env.SIM_LEVELS ? levels : [1, 5, 10, 20, 30, 40, 50]) {
      const r = run(level, ON_CURVE)
      rows.push(`Lv${level} | ${r.cleared.join(', ')} | ${pct(r.mpLeft)}`)
    }
    console.log(rows.join('\n'))
  }, 900_000)
})
