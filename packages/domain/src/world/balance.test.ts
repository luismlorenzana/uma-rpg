// The balance simulation for the world map (combat-balance.md §6.0): a five-class party built through the game's own
// rules plays every stage at its level on the current engine with the shared Auto policy. Run the full table with
// `SIM=1 npx vitest run src/world/balance.test.ts`; the always-on tests keep Auto legal and the opening stages winnable.
import { describe, expect, it } from 'vitest'
import { autoAction } from '../rpg/battle/auto'
import { applyBattleAction, battleActionsLeft, createBattle } from '../rpg/battle/engine'
import { BATTLE_LIMIT_MAX } from '../rpg/battle/limit'
import type { BattleInput, BattleState } from '../rpg/battle/types'
import type { RpgMapNode } from '../rpg/campaign/chapters'
import { balanceParty, balanceStage, type BalanceOptions } from './balance-party'
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
const regionsAt = (level: number) => worldContinent({ name: 'Sim', order: Math.ceil(level / 10) }).regions.filter((r) => r.level <= level && level <= r.levelTop)

/** Every stage at a level across a continent's regions, by stage kind. */
export function simulate(level: number, options: BalanceOptions): Record<Kind, Bucket> {
  const party = balanceParty(level, options)
  const out: Record<Kind, Bucket> = { fight: empty(), 'sub-boss': empty(), boss: empty() }
  for (const region of regionsAt(level)) {
    regionChapter(region, cast).nodes.filter((n) => n.kind !== 'camp' && n.level === level).forEach((node, i) => {
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
  })

  it('lets a fresh Lv1 party win the opening pairs', () => {
    const party = balanceParty(1)
    const meadow = regionChapter(worldContinent({ name: 'Sim', order: 1 }).regions[0]!, cast)
    const opening = meadow.nodes.filter((n: RpgMapNode) => n.kind === 'fight').slice(0, 2)
    for (const node of opening) expect(play(balanceStage(node, 7, party)).won, node.id).toBe(true)
  })

  it.skipIf(!process.env.SIM)('prints win rates by level: bare, geared (no Extra Stats) and on curve', () => {
    const rows: string[] = ['level | party | regular | elite | boss']
    // `SIM_LEVELS=5,25,50` narrows the table while tuning.
    const levels = process.env.SIM_LEVELS ? process.env.SIM_LEVELS.split(',').map(Number) : [1, 5, 10, 15, 20, 25, 30, 40, 50]
    for (const level of levels) {
      for (const [label, options] of [['bare', {}], ['geared', GEARED], ['on curve', ON_CURVE]] as const) {
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
