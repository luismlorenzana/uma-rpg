// Weaknesses v2's balance in the world (H115, D235; weaknesses-v2.md §5, WK5, WK6, WK12's fourth check): engine v18's
// generation measured with explicit inputs, never the switch, against v15 (before R1, the pace R1's H71 matched) and v17
// (live). Only the foes' lists differ between v17 and v18; the party, the engine's rules and the shields are the same.
// The always-on check is small; the tables: `SIM=1 npx vitest run src/world/balance-v18.test.ts` (`SIM_SEEDS=32` for the
// delivery; `SIM_TARGETS=1,2` and `SIM_LEVELS=30,50` narrow them).
import { describe, expect, it } from 'vitest'
import type { BattleAlly, BattleInput } from '../rpg/battle/types'
import type { RpgMapNode } from '../rpg/campaign/chapters'
import type { RpgClass } from '../rpg/rules'
import { BALANCE_PARTY, balanceMember, balanceStage, type BalanceOptions } from './balance-party'
import { play } from './balance-play'
import { byClass, fightLog, logFight, perTurn, physicalShare, type FightLog } from './balance-measure'
import { regionChapter, worldContinent } from './world'

const V15 = 15, V17 = 17, V18 = 18
const cast = Array.from({ length: 30 }, (_, i) => ({ id: `c${i}`, name: `Rival ${i}` }))
const ON_CURVE: BalanceOptions = { gear: true, stars: true, heroes: true }
type Kind = 'fight' | 'sub-boss' | 'boss'
const KINDS: readonly Kind[] = ['fight', 'sub-boss', 'boss']
const RANK = { fight: 'regular', 'sub-boss': 'sub-boss', boss: 'boss' } as const

const lifetimeOf = (level: number, tier = 1) => 50 * (tier - 1) + level
const regionsAt = (level: number, tier = 1) => {
  const lifetime = lifetimeOf(level, tier)
  return worldContinent({ name: 'Sim', order: 5 * (tier - 1) + Math.ceil(level / 10) }).regions.filter((r) => r.level <= lifetime && lifetime <= r.levelTop)
}
function stagesAt(level: number, tier: number, engine: number): Record<Kind, RpgMapNode[]> {
  const lifetime = lifetimeOf(level, tier)
  const out: Record<Kind, RpgMapNode[]> = { fight: [], 'sub-boss': [], boss: [] }
  for (const region of regionsAt(level, tier)) {
    for (const n of regionChapter(region, cast, engine).nodes) if (n.kind !== 'camp' && n.level === lifetime) out[n.kind as Kind].push(n)
  }
  return out
}
/** v17's stages wearing v15's own lists (the old generator's draws, slot for slot): the design's baseline, since only the
 * lists differ from v17's and v18's (weaknesses-v2.md §5). Played on engine v17. */
function graftedAt(level: number, tier: number): Record<Kind, RpgMapNode[]> {
  const old = new Map(Object.values(stagesAt(level, tier, V15)).flat().map((n) => [n.id, n]))
  const graft = (n: RpgMapNode): RpgMapNode => {
    const o = old.get(n.id)!
    const lists = [o.enemies, ...(o.waves ?? [])].map((w) => w.map((e) => e.weaknesses))
    const wear = (wave: RpgMapNode['enemies'], i: number) => wave.map((e, j) => ({ ...e, weaknesses: lists[i]![j]! }))
    return { ...n, enemies: wear(n.enemies, 0), ...(n.waves ? { waves: n.waves.map((w, i) => wear(w, i + 1)) } : {}) }
  }
  const now = stagesAt(level, tier, V17)
  return { fight: now.fight.map(graft), 'sub-boss': now['sub-boss'].map(graft), boss: now.boss.map(graft) }
}
const partyAt = (level: number, engine: number, options: BalanceOptions = {}, swap: Partial<Record<RpgClass, RpgClass>> = {}): BattleAlly[] =>
  BALANCE_PARTY.map((c) => swap[c] ?? c).map((c, i) => balanceMember(c, i, level, { ...ON_CURVE, ...options, engine }))
function playInto(nodes: readonly RpgMapNode[], allies: BattleAlly[], engine: number, seeds: number, into: FightLog = fightLog()): FightLog {
  nodes.forEach((node, i) => {
    for (let s = 0; s < seeds; s++) {
      const { observe, done } = logFight(allies, into)
      done(play(balanceStage(node, 1000 + i + 100 * s, allies, engine as BattleInput['version']), observe))
    }
  })
  return into
}
/** A region's twelve stages back to back, MP carried, a Spring before stage 7 (R1's and R2's files' run). */
function regionRun(level: number, engine: number, seeds: number) {
  const cleared: number[] = []
  let lateRounds = 0, freshRounds = 0, late = 0
  for (const region of regionsAt(level).slice(0, 4)) {
    const nodes = regionChapter(region, cast, engine).nodes.filter((x) => x.kind !== 'camp')
    for (let s = 0; s < seeds; s++) {
      let mp: Record<string, number> = {}
      let n = 0
      for (const node of nodes) {
        if (n === 6) mp = {}
        const full = partyAt(node.level, engine)
        const party = full.map((a) => ({ ...a, mp: Math.min(a.mp, mp[a.id] ?? a.mp) }))
        const r = play(balanceStage(node, 2000 + n + 100 * s, party, engine as BattleInput['version']))
        if (!r.won) break
        if (n >= 8) {
          lateRounds += r.rounds; late++
          freshRounds += play(balanceStage(node, 2000 + n + 100 * s, full, engine as BattleInput['version'])).rounds
        }
        n++
        mp = Object.fromEntries(party.map((a) => [a.id, r.mp[a.id] ?? a.mp]))
      }
      cleared.push(n)
    }
  }
  const sum = cleared.reduce((a, b) => a + b, 0)
  return { mean: sum / Math.max(1, cleared.length), all: cleared.filter((n) => n === 12).length, of: cleared.length,
    lateRounds: lateRounds / Math.max(1, late), drag: lateRounds / Math.max(1, freshRounds) }
}
const pct = (x: number) => `${Math.round(100 * x)}%`
const f1 = (x: number) => x.toFixed(1)
const f2 = (x: number) => x.toFixed(2)
const winRate = (l: FightLog) => (l.fights ? l.wins / l.fights : 0)
const roundsOf = (l: FightLog) => (l.fights ? l.rounds / l.fights : 0)
const firstBreak = (l: FightLog, k: Kind) => { const b = l.breaks[RANK[k]]; return b.broke ? b.rounds / b.broke : 0 }
const broke = (l: FightLog, k: Kind) => { const b = l.breaks[RANK[k]]; return b.foes ? b.broke / b.foes : 0 }
const tick = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('weaknesses v2 in the world on engine v18 (H115)', () => {
  it('lets the v18 party win a Tier 1 Lv 30 stage on Auto', () => {
    const node = stagesAt(30, 1, V18).fight[0]!
    expect(play(balanceStage(node, 7, partyAt(30, V18), V18)).won).toBe(true)
  })

  it.skipIf(!process.env.SIM)('prints the delivery tables (weaknesses-v2.md §5)', async () => {
    const want = new Set((process.env.SIM_TARGETS ?? '1,2,5,9').split(',').map(Number))
    const seeds = Number(process.env.SIM_SEEDS ?? 8)
    const levels = process.env.SIM_LEVELS ? process.env.SIM_LEVELS.split(',').map(Number) : [10, 20, 30, 40, 50]
    const rows: string[] = [`engine v18 (weaknesses v2) against v15 and v17, world stages × ${seeds} seeds; on curve, first try on Auto`]
    const flush = () => { if (rows.length) console.log(rows.splice(0).join('\n')) }
    const logs = new Map<string, Record<Kind, FightLog>>()
    const run = async (key: string, level: number, tier: number, engine: number, allies: BattleAlly[], grafted = false) => {
      const cached = logs.get(key)
      if (cached) return cached
      const stages = grafted ? graftedAt(level, tier) : stagesAt(level, tier, engine)
      const out = { fight: fightLog(), 'sub-boss': fightLog(), boss: fightLog() } as Record<Kind, FightLog>
      for (const k of KINDS) playInto(stages[k], allies, engine, seeds, out[k])
      logs.set(key, out)
      await tick()
      return out
    }
    const cells = (r: Record<Kind, FightLog>) => KINDS.map((k) => (r[k].fights
      ? `${pct(winRate(r[k]))} ${f1(roundsOf(r[k]))}r ${f1(firstBreak(r[k], k))}b (${pct(broke(r[k], k))})` : '—')).join(' | ')
    const all = (r: Record<Kind, FightLog>): FightLog => {
      const m = fightLog()
      for (const k of KINDS) {
        m.fights += r[k].fights; m.wins += r[k].wins; m.rounds += r[k].rounds
        m.charges.armed += r[k].charges.armed; m.charges.cancelled += r[k].charges.cancelled
        for (const [id, u] of Object.entries(r[k].umas)) {
          const x = (m.umas[id] ??= { ...u, physical: 0, magical: 0, limitPhysical: 0, limitMagical: 0, farewell: 0, turns: 0, heal: 0, big: 0, bigTurns: 0, attacks: 0, flourish: 0 })
          for (const f of ['physical', 'magical', 'limitPhysical', 'limitMagical', 'farewell', 'turns', 'heal', 'big', 'bigTurns', 'attacks', 'flourish'] as const) x[f] += u[f]
        }
      }
      return m
    }

    if (want.has(1)) {
      rows.push('', 'Item 1: tier level | engine | regular | elite | boss (win, rounds a fight, rounds to her first Break, share broken) | charged moves cancelled')
      let worstRounds = 0, worstBreak = 0, worstWin = 0
      const classRows: string[] = []
      for (const level of levels) {
        const v15 = await run(`${level}:15`, level, 1, V15, partyAt(level, V15))
        const v17 = await run(`${level}:17`, level, 1, V17, partyAt(level, V17))
        const old = await run(`${level}:17old`, level, 1, V17, partyAt(level, V17), true)
        const v18 = await run(`${level}:18`, level, 1, V18, partyAt(level, V18))
        const p15 = await run(`${level}:17oldp`, level, 1, V17, partyAt(level, V17, {}, { cleric: 'paladin' }), true)
        const p18 = await run(`${level}:18p`, level, 1, V18, partyAt(level, V18, {}, { cleric: 'paladin' }))
        for (const [a, b] of [[v18, old], [p18, p15]] as const) for (const k of KINDS) {
          if (!a[k].fights) continue
          worstRounds = Math.max(worstRounds, Math.abs(roundsOf(a[k]) - roundsOf(b[k])))
          worstBreak = Math.max(worstBreak, Math.abs(firstBreak(a[k], k) - firstBreak(b[k], k)))
          worstWin = Math.max(worstWin, Math.abs(winRate(a[k]) - winRate(b[k])))
        }
        const cancelled = (r: Record<Kind, FightLog>) => { const m = all(r); return pct(m.charges.cancelled / Math.max(1, m.charges.armed)) }
        rows.push(`T1 Lv${level} | v15 (the whole engine, for reference) | ${cells(v15)} | ${cancelled(v15)}`,
          `T1 Lv${level} | v17 | ${cells(v17)} | ${cancelled(v17)}`, `T1 Lv${level} | v17 with v15's lists | ${cells(old)} | ${cancelled(old)}`,
          `T1 Lv${level} | v18 | ${cells(v18)} | ${cancelled(v18)}`, `T1 Lv${level} | v17 with v15's lists, Paladin | ${cells(p15)} | ${cancelled(p15)}`,
          `T1 Lv${level} | v18, Paladin | ${cells(p18)} | ${cancelled(p18)}`)
        const [mOld, m17, m18] = [all(old), all(v17), all(v18)]
        classRows.push(`Lv${level} | ${BALANCE_PARTY.map((c) => `${c} ${Math.round(perTurn(byClass(m17, c)))} → ${Math.round(perTurn(byClass(m18, c)))} (v15's lists ${Math.round(perTurn(byClass(mOld, c)))})`).join(', ')}`)
        flush()
      }
      rows.push(`Worst gap to v15's lists on v17 (either healer): rounds ${f2(worstRounds)}, first Break ${f2(worstBreak)}, win rate ${f1(100 * worstWin)} pts (WK12: ±0.5, ±0.5, unchanged)`)
      rows.push('', 'Item 1, by class: damage a turn, v17 → v18 (v15\'s lists on v17), every stage', ...classRows)
    }

    flush()
    if (want.has(2)) {
      rows.push('', 'Item 2: Lv | engine | Spell Blade a turn, physical share | Summoner a turn, magical share | Summoner ÷ Spell Blade (regular stages)')
      for (const level of [10, 30, 50]) for (const [label, engine, grafted] of [['v17', V17, false], ['v17, v15\'s lists', V17, true], ['v18', V18, false]] as const) {
        const r = await run(`${level}:${engine}${grafted ? 'old' : ''}`, level, 1, engine, partyAt(level, engine), grafted)
        const sb = byClass(r.fight, 'spellblade')!, su = byClass(r.fight, 'summoner')!
        rows.push(`Lv${level} | ${label} | ${f1(perTurn(sb))}, ${pct(physicalShare(sb))} | ${f1(perTurn(su))}, ${pct(1 - physicalShare(su))} | ${pct(perTurn(su) / perTurn(sb))}`)
      }
    }

    flush()
    if (want.has(5)) {
      rows.push('', 'Item 5: Lv | engine | stages cleared of 12 (mean; all 12) | rounds a stage in stages 9–12 | MP\'s drag')
      for (const level of [10, 30, 50]) for (const engine of [V15, V17, V18]) {
        const r = regionRun(level, engine, seeds)
        rows.push(`Lv${level} | v${engine} | ${f1(r.mean)}; ${r.all} of ${r.of} | ${f2(r.lateRounds)} | ${f2(r.drag)}`)
        await tick()
        flush()
      }
    }

    flush()
    if (want.has(9)) {
      rows.push('', 'Item 9, Tier 2 and 3 worlds: tier level | engine | regular | elite | boss | rounds ÷ Tier 1\'s, same engine')
      for (const level of [10, 30, 50]) {
        for (const engine of [V17, V18]) {
          const t1 = await run(`${level}:${engine}`, level, 1, engine, partyAt(level, engine))
          for (const tier of [2, 3]) {
            if (!regionsAt(level, tier).length) continue
            const r = await run(`${tier}:${level}:${engine}`, level, tier, engine, partyAt(level, engine, { tier }))
            rows.push(`T${tier} Lv${level} | v${engine} | ${cells(r)} | ${KINDS.map((k) => f2(roundsOf(r[k]) / Math.max(0.01, roundsOf(t1[k])))).join(' · ')}`)
          }
        }
        flush()
      }
    }
    flush()
  }, 14_400_000)
})
