// The balance simulation for the world map (combat-balance.md §6.0): a five-class party built through the game's own
// rules plays every stage at its level on the current engine with the shared Auto policy. Run the full table with
// `SIM=1 npx vitest run src/world/balance.test.ts` (`SIM_ENGINE=15` plays it on classes v2 and adds H60's campaign
// check); the always-on tests keep Auto legal and the opening stages winnable.
import { describe, expect, it } from 'vitest'
import { autoAction } from '../rpg/battle/auto'
import { BATTLE_ENGINE_VERSION } from '../rpg/battle/caps'
import { applyBattleAction, battleActionsLeft, createBattle } from '../rpg/battle/engine'
import { BATTLE_LIMIT_MAX } from '../rpg/battle/limit'
import type { BattleInput } from '../rpg/battle/types'
import type { RpgMapNode } from '../rpg/campaign/chapters'
import type { RpgClass } from '../rpg/rules'
import { riftParty } from '../rift/fronts'
import { RIFT_FRONTS } from '../rift/state'
import { BALANCE_PARTY, balanceMember, balanceParty, balanceStage, type BalanceOptions } from './balance-party'
import { play } from './balance-play'
import { rpgFoe } from '../rpg/campaign/enemies'
import { MIGHT_BY_GRADE } from '../economy/gear'
import { regionChapter, worldContinent } from './world'

const cast = Array.from({ length: 30 }, (_, i) => ({ id: `c${i}`, name: `Rival ${i}` }))

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

/** Every stage at a tier level across a continent's regions, by stage kind; `options.tier` picks the tier (H45) and
 * `options.engine` the engine (H60). `classes` replaces the balance party with five others, and `seeds` plays each stage
 * that many times (the first seed as always). */
export function simulate(level: number, options: BalanceOptions, classes?: readonly RpgClass[], seeds = 1): Record<Kind, Bucket> {
  const party = classes ? classes.map((c, i) => balanceMember(c, i, level, options)) : balanceParty(level, options)
  const version = (options.engine ?? BATTLE_ENGINE_VERSION) as BattleInput['version']
  const lifetime = lifetimeOf(level, options.tier)
  const out: Record<Kind, Bucket> = { fight: empty(), 'sub-boss': empty(), boss: empty() }
  for (const region of regionsAt(level, options.tier)) {
    regionChapter(region, cast).nodes.filter((n) => n.kind !== 'camp' && n.level === lifetime).forEach((node, i) => {
      for (let s = 0; s < seeds; s++) {
        const r = play(balanceStage(node, 1000 + i + 100 * s, party, version))
        const b = out[node.kind as Kind]
        b.n++; b.wins += r.won ? 1 : 0; b.rounds += r.rounds; b.hp += r.hpLeft; b.lowest += r.lowest; b.kos += r.kos; b.focus += r.focus
      }
    })
  }
  return out
}

/** A region's twelve stages back to back with MP carried and no Spring, the party at each stage's level (D97): how many
 * fall before the first loss, and the MP left. */
function run(level: number, options: BalanceOptions, classes?: readonly RpgClass[]): { cleared: number[]; mpLeft: number } {
  const cleared: number[] = []
  const version = (options.engine ?? BATTLE_ENGINE_VERSION) as BattleInput['version']
  const partyAt = (at: number) => (classes ? classes.map((c, i) => balanceMember(c, i, at, options)) : balanceParty(at, options))
  let mpLeft = 0
  for (const region of regionsAt(level).slice(0, 4)) {
    let mp: Record<string, number> = {}
    let full = 0, n = 0
    let party = partyAt(region.level)
    for (const node of regionChapter(region, cast).nodes.filter((x) => x.kind !== 'camp')) {
      party = partyAt(node.level).map((a) => ({ ...a, mp: Math.min(a.mp, mp[a.id] ?? a.mp) }))
      if (n === 0) full = party.reduce((m, a) => m + a.mp, 0)
      const r = play(balanceStage(node, 2000 + n, party, version))
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
    const engine = Number(process.env.SIM_ENGINE ?? BATTLE_ENGINE_VERSION)
    const at = (options: BalanceOptions): BalanceOptions => (engine === BATTLE_ENGINE_VERSION ? options : { ...options, engine })
    const rows: string[] = [`level | party | regular | elite | boss${engine === BATTLE_ENGINE_VERSION ? '' : ` (engine v${engine})`}`]
    // `SIM_LEVELS=5,25,50` narrows the table while tuning.
    const levels = process.env.SIM_LEVELS ? process.env.SIM_LEVELS.split(',').map(Number) : [1, 5, 10, 15, 20, 25, 30, 40, 50]
    // Tier 2 (H45): a freshly ascended party on `w6`'s 40 opening stages (rows 1–5, stages 1–2, lifetime 51), then Tier 2
    // on curve beside Tier 1 at each tier level.
    const fresh = simulate(1, at(FRESH_T2))
    rows.push(`T2 Lv1 | fresh, ${fresh.fight.n} stages | ${cell(fresh.fight)} | ${cell(fresh['sub-boss'])} | ${cell(fresh.boss)}`)
    for (const level of levels) {
      for (const [label, options] of [['bare', {}], ['geared', GEARED], ['on curve', ON_CURVE], ['T2 on curve', { ...ON_CURVE, tier: 2 }]] as const) {
        const r = simulate(level, at(options))
        rows.push(`Lv${level} | ${label} | ${cell(r.fight)} | ${cell(r['sub-boss'])} | ${cell(r.boss)}`)
      }
    }
    rows.push('', 'level | stages cleared in a row per region (of 12), on curve, MP carried, no Spring | MP left')
    for (const level of process.env.SIM_LEVELS ? levels : [1, 5, 10, 20, 30, 40, 50]) {
      const r = run(level, at(ON_CURVE))
      rows.push(`Lv${level} | ${r.cleared.join(', ')} | ${pct(r.mpLeft)}`)
    }
    console.log(rows.join('\n'))
  }, 900_000)

  it.skipIf(!process.env.SIM || !process.env.SIM_ENGINE)('prints classes v2 against today\'s campaign (H60, classes-v2 §9)', async () => {
    // §9: today's campaign within 3 points of v14 on curve, first try on Auto: the balance party on v14 and v15, the v15
    // party with a Paladin for the Cleric, and each front's v2 guided party beside its v14 one. `SIM_SEEDS` stages each.
    // The balance party geared without Extra Stats is a looser party, for the record.
    const tick = () => new Promise((resolve) => setTimeout(resolve, 0))
    const engine = Number(process.env.SIM_ENGINE)
    const seeds = Number(process.env.SIM_SEEDS ?? 4)
    const v14: BalanceOptions = { ...ON_CURVE, engine: BATTLE_ENGINE_VERSION }, v15: BalanceOptions = { ...ON_CURVE, engine }
    const parties: [string, BalanceOptions, readonly RpgClass[]][] = [
      ['balance party v14', v14, BALANCE_PARTY], [`balance party v${engine}`, v15, BALANCE_PARTY],
      [`v${engine}, Paladin for the Cleric`, v15, BALANCE_PARTY.map((c) => (c === 'cleric' ? 'paladin' : c))],
      ...RIFT_FRONTS.flatMap((f) => [[`${f} guided v14`, v14, riftParty(f, BATTLE_ENGINE_VERSION)], [`${f} guided v${engine}`, v15, riftParty(f, engine)]] as [string, BalanceOptions, readonly RpgClass[]][]),
      ['geared v14', { ...GEARED, engine: BATTLE_ENGINE_VERSION }, BALANCE_PARTY], [`geared v${engine}`, { ...GEARED, engine }, BALANCE_PARTY],
    ]
    const rows: string[] = [`tier level | party | regular | elite | boss (win rate, ${seeds} seeds a stage) | worst gap to its v14 row`]
    let worst = 0
    for (const [tier, level] of [[1, 10], [1, 20], [1, 30], [1, 40], [1, 50], [2, 10]] as const) {
      const results: { label: string; r: Record<Kind, Bucket> }[] = []
      for (const [label, options, classes] of parties) {
        results.push({ label, r: simulate(level, { ...options, tier }, classes, seeds) })
        await tick()
      }
      const baseOf = (label: string) => results.find((x) => x.label === (label.startsWith('balance') || label.startsWith('v') ? 'balance party v14' : label.replace(/v\d+$/, 'v14')))!.r
      for (const { label, r } of results) {
        const base = baseOf(label)
        const gap = Math.max(...(['fight', 'sub-boss', 'boss'] as const).filter((k) => r[k].n).map((k) => Math.abs(r[k].wins / r[k].n - base[k].wins / base[k].n)))
        if (!label.includes('v14') && !label.startsWith('geared')) worst = Math.max(worst, gap)
        rows.push(`T${tier} Lv${level} | ${label} | ${(['fight', 'sub-boss', 'boss'] as const).map((k) => (r[k].n ? `${pct(r[k].wins / r[k].n)} ${(r[k].rounds / r[k].n).toFixed(1)}r` : '—')).join(' | ')} | ${label.includes('v14') ? '—' : `${(100 * gap).toFixed(1)} pts`}`)
      }
    }
    rows.push('', `Worst gap: ${(100 * worst).toFixed(1)} points`, '', 'level | party | stages cleared in a row per region, MP carried | MP left')
    for (const level of [10, 30, 50]) {
      for (const [label, options] of [['v14', v14], [`v${engine}`, v15]] as const) {
        const r = run(level, options)
        rows.push(`Lv${level} | balance party ${label} | ${r.cleared.join(', ')} | ${pct(r.mpLeft)}`)
        await tick()
      }
    }
    console.log(rows.join('\n'))
  }, 1_800_000)
})
