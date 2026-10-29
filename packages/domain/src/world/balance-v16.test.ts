// R1's balance in the world (the Tier rework's Tier 1 fight, engine v16, H71; README §9.5 items 1–5 and R1's item 7,
// Tier 2 and 3 worlds on R1's shape; stat-balance §12):
// engine v16 measured with explicit v16 inputs, never the switch, against the same measurement on v15 ("today's"): the
// balance party (`world/balance-party.ts`, `engine: 16`: three default weapons, line A unless `lines`, Class Rank on the
// real pace, R1's kit on today's gear, no Flourish) on the world's v16 foes (`regionChapter(…, 16)`: twins, Tier 1's
// shields). The always-on checks are small; the targets' tables: `SIM=1 npx vitest run src/world/balance-v16.test.ts`
// (`SIM_SEEDS=32` for the delivery; `SIM_TARGETS=1,3,5` and `SIM_LEVELS=30,50` narrow them while tuning). The Rift's
// targets are `rift/balance-v16.test.ts`; H51's and H60's tables play v16 with `SIM_ENGINE=16`.
import { describe, expect, it } from 'vitest'
import type { BattleAlly, BattleInput } from '../rpg/battle/types'
import { rpgNode, rpgNodeSkill } from '../rpg/catalog'
import type { RpgMapNode } from '../rpg/campaign/chapters'
import { rpgBranchNode, rpgTreeOf, type RpgLines } from '../rpg/node-identity'
import {
  isRpgTome, RPG_V2_CLASSES, rpgBaseMpRegen, rpgDefaultWeapons, rpgHand, rpgHeldSkills, rpgOpenDepth,
  type RpgClass, type RpgWeapon,
} from '../rpg/rules'
import { classPreset } from '../save/presets'
import { BALANCE_KIT_V16, BALANCE_PARTY, balanceClassRank, balanceMember, balanceStage, type BalanceOptions } from './balance-party'
import { play } from './balance-play'
import { bigPerTurn, byClass, castsOf, damageOf, fightLog, logFight, perTurn, physicalShare, type FightLog } from './balance-measure'
import { regionChapter, worldContinent } from './world'

const V15 = 15, V16 = 16
const cast = Array.from({ length: 30 }, (_, i) => ({ id: `c${i}`, name: `Rival ${i}` }))
const ON_CURVE: BalanceOptions = { gear: true, stars: true, heroes: true }
type Kind = 'fight' | 'sub-boss' | 'boss'
const KINDS: readonly Kind[] = ['fight', 'sub-boss', 'boss']

/** A tier level's lifetime level, and the regions holding it on its tier's continent (as `world/balance.test.ts`). */
const lifetimeOf = (level: number, tier = 1) => 50 * (tier - 1) + level
const regionsAt = (level: number, tier = 1) => {
  const lifetime = lifetimeOf(level, tier)
  return worldContinent({ name: 'Sim', order: 5 * (tier - 1) + Math.ceil(level / 10) }).regions.filter((r) => r.level <= lifetime && lifetime <= r.levelTop)
}
/** Every stage at a tier level across its continent's regions, in an engine's generation, by kind. */
function stagesAt(level: number, tier: number, engine: number): Record<Kind, RpgMapNode[]> {
  const lifetime = lifetimeOf(level, tier)
  const out: Record<Kind, RpgMapNode[]> = { fight: [], 'sub-boss': [], boss: [] }
  for (const region of regionsAt(level, tier)) {
    for (const n of regionChapter(region, cast, engine).nodes) if (n.kind !== 'camp' && n.level === lifetime) out[n.kind as Kind].push(n)
  }
  return out
}
/** The balance party at a level in an engine's generation; `swap` puts a class in another's place (the Paladin for the
 * Cleric), `each` adds to one member's options by her class. */
const partyAt = (level: number, engine: number, options: BalanceOptions = {}, swap: Partial<Record<RpgClass, RpgClass>> = {},
  each: (c: RpgClass) => BalanceOptions = () => ({})): BattleAlly[] =>
  BALANCE_PARTY.map((c) => swap[c] ?? c).map((c, i) => balanceMember(c, i, level, { ...ON_CURVE, ...options, engine, ...each(c) }))
/** Plays stages `seeds` times each (the first seed as `world/balance.test.ts`'s `simulate`), into one log. */
function playInto(nodes: readonly RpgMapNode[], allies: BattleAlly[], engine: number, seeds: number, into: FightLog = fightLog()): FightLog {
  nodes.forEach((node, i) => {
    for (let s = 0; s < seeds; s++) {
      const { observe, done } = logFight(allies, into)
      done(play(balanceStage(node, 1000 + i + 100 * s, allies, engine as BattleInput['version']), observe))
    }
  })
  return into
}
const pct = (x: number) => `${Math.round(100 * x)}%`
const f1 = (x: number) => x.toFixed(1)
const f2 = (x: number) => x.toFixed(2)
const winRate = (l: FightLog) => (l.fights ? l.wins / l.fights : 0)
const roundsOf = (l: FightLog) => (l.fights ? l.rounds / l.fights : 0)
const partyDamage = (l: FightLog) => Object.values(l.umas).reduce((n, u) => n + damageOf(u), 0)
const tick = () => new Promise((resolve) => setTimeout(resolve, 0))

/** Her deepest act's MP (the refund check): a one-half class her held skills' dearest at her deepest open depth × her hand;
 * a pair class one Arms half and one Tome half, each her dearest of its channel at that depth. */
function deepActMp(a: BattleAlly, engine: number): number {
  const depth = rpgOpenDepth(a.classRank!)
  const held = rpgHeldSkills({ classId: a.classId, weapons: a.weapons, tier: a.tier, classRank: a.classRank!, tree: [], legacy: [], ...(a.lines ? { lines: a.lines } : {}) }, engine)
    .map((r) => rpgNode(r.id)!).filter((n) => n.depth === depth)
  const hand = rpgHand({ classId: a.classId }, engine)
  const cost = (tome: boolean | null) => Math.max(0, ...held.filter((n) => tome === null || isRpgTome(n.weapon) === tome)
    .map((n) => Math.max(1, Math.round(rpgNodeSkill(n, engine).mp * hand.mp))))
  return hand.pair ? cost(false) + cost(true) : cost(null)
}
/** The base regen's share of her deepest act, at a level on the balance party (R1's kit, the real Class Rank pace). */
function refundAt(classId: RpgClass, level: number): { mp: number; regen: number; deep: number; share: number } {
  const a = balanceMember(classId, 0, level, { ...ON_CURVE, engine: V16 })
  const regen = rpgBaseMpRegen(a.stats.mp, { classId, classRank: a.classRank! }, V16)
  const deep = deepActMp(a, V16)
  return { mp: a.stats.mp, regen, deep, share: regen / deep }
}

/** A region's twelve stages back to back, MP carried, the party at each stage's level (D97), a Spring (a full bar) before
 * stage 7 (A14, A10: one a region): stages cleared before the first loss, the rounds of stages 9–12 cleared, and the same
 * stages' rounds played on a full bar (the same seed): their ratio is what MP carried over a region costs the pace. */
function regionRun(level: number, engine: number, seeds: number, each: (c: RpgClass) => BalanceOptions = () => ({})) {
  const cleared: number[] = []
  let lateRounds = 0, freshRounds = 0, late = 0
  for (const region of regionsAt(level).slice(0, 4)) {
    const nodes = regionChapter(region, cast, engine).nodes.filter((x) => x.kind !== 'camp')
    for (let s = 0; s < seeds; s++) {
      let mp: Record<string, number> = {}
      let n = 0
      for (const node of nodes) {
        if (n === 6) mp = {}
        const full = partyAt(node.level, engine, {}, {}, each)
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
  return { cleared, mean: cleared.reduce((a, b) => a + b, 0) / Math.max(1, cleared.length), all: cleared.filter((n) => n === 12).length,
    tenPlus: cleared.filter((n) => n >= 10).length, lateRounds: lateRounds / Math.max(1, late), drag: lateRounds / Math.max(1, freshRounds) }
}
const MP_SUPPORTS = new Set(['amulet-siphon', 'amulet-spring'])

// --- Target 4: the lines -------------------------------------------------------------------------------------------------

type Context = 'waves' | 'heavy' | 'shielded'
/** A line's context (CP15, README §9.5 item 4): reach lines on the world's waves of 4–6 foes, one-foe and heavy lines on
 * sub-bosses and bosses, more-hit lines on shielded sub-bosses. */
const CONTEXT_STAGES: Readonly<Record<Context, (n: RpgMapNode) => boolean>> = {
  waves: (n) => n.kind === 'fight' && [n.enemies, ...(n.waves ?? [])].some((w) => w.length >= 4),
  heavy: (n) => n.kind !== 'fight',
  shielded: (n) => n.kind === 'sub-boss',
}
/** Every B line measured: her class, the tree's weapon, its context, and the weapons she slots (her defaults, or the tree
 * swapped into her third slot of its channel: off-default trees are rare in Tier 1, CP43). Each is read as her damage a
 * turn with that one tree on B against all A (on the sub-bosses and bosses themselves for heavy and shielded lines), her
 * line's own casts beside it; the healers' Heavy on the party (its rounds and the damage it takes). */
interface LineCase { classId: RpgClass; weapon: RpgWeapon; context: Context; name: string; weapons?: readonly RpgWeapon[] }
const LINES: readonly LineCase[] = [
  { classId: 'brawler', weapon: 'greatsword', context: 'shielded', name: 'Combo' },
  { classId: 'brawler', weapon: 'axe', context: 'waves', name: 'Reap' },
  { classId: 'brawler', weapon: 'lance', context: 'heavy', name: 'Impale' },
  { classId: 'brawler', weapon: 'bow', context: 'waves', name: 'Rain', weapons: ['greatsword', 'axe', 'bow'] },
  { classId: 'brawler', weapon: 'katana', context: 'heavy', name: 'Draw', weapons: ['greatsword', 'axe', 'katana'] },
  { classId: 'mage', weapon: 'tome-fire', context: 'waves', name: 'Wave' },
  { classId: 'mage', weapon: 'tome-ice', context: 'heavy', name: 'Spike' },
  { classId: 'mage', weapon: 'tome-lightning', context: 'heavy', name: 'Bolt' },
  { classId: 'mage', weapon: 'tome-light', context: 'waves', name: 'Cascade', weapons: ['tome-fire', 'tome-ice', 'tome-light'] },
  { classId: 'mage', weapon: 'tome-dark', context: 'heavy', name: 'Pierce', weapons: ['tome-fire', 'tome-ice', 'tome-dark'] },
  { classId: 'spellblade', weapon: 'katana', context: 'heavy', name: 'Pierce' },
  { classId: 'spellblade', weapon: 'lance', context: 'heavy', name: 'Pierce' },
  { classId: 'spellblade', weapon: 'tome-lightning', context: 'heavy', name: 'Pierce' },
  { classId: 'summoner', weapon: 'tome-dark', context: 'waves', name: 'Bonded' },
  { classId: 'summoner', weapon: 'tome-light', context: 'waves', name: 'Bonded' },
  { classId: 'summoner', weapon: 'bow', context: 'shielded', name: 'Pack' },
  { classId: 'cleric', weapon: 'tome-light', context: 'heavy', name: 'Heavy (Rebirth at D3)' },
  { classId: 'cleric', weapon: 'tome-ice', context: 'heavy', name: 'Heavy' },
  { classId: 'cleric', weapon: 'bow', context: 'heavy', name: 'Heavy' },
  { classId: 'paladin', weapon: 'greatsword', context: 'heavy', name: 'Heavy' },
  { classId: 'paladin', weapon: 'axe', context: 'heavy', name: 'Heavy' },
  { classId: 'paladin', weapon: 'tome-light', context: 'heavy', name: 'Heavy (Valkyrie\'s Oath at D3)' },
]
const HEALERS: readonly RpgClass[] = ['cleric', 'paladin']
const lineIds = (c: LineCase, branch: 'A' | 'B') => [3, 4, 5].map((d) => (branch === 'A' ? `${rpgTreeOf(c.classId, c.weapon)}.${d}` : rpgBranchNode(c.classId, c.weapon, d, 'B')))

describe('R1\'s balance in the world on engine v16 (H71)', () => {
  it('builds R1\'s kit from the classes\' v16 presets: the Orb on her first slot\'s kind, today\'s supports', () => {
    for (const c of RPG_V2_CLASSES) {
      const preset = classPreset(c, V16)
      expect(BALANCE_KIT_V16[c].accessories, c).toEqual([preset.orb, preset.support])
      expect(BALANCE_KIT_V16[c].magical.every((m) => m === (preset.armor === 'magical')), c).toBe(true)
      expect(preset.orb, c).toBe(`orb-${rpgDefaultWeapons(c, V16)[0]!.replace('tome-', '')}`)
    }
  })

  it('reads Class Rank on the real pace from v16 (2E a win, SB16), and her level to v15', () => {
    expect([13, 20, 27, 34].map(balanceClassRank)).toEqual([20, 30, 40, 50])
    expect([1, 2, 12, 50].map(balanceClassRank)).toEqual([1, 2, 18, 50])
    expect(balanceMember('mage', 0, 20, { ...ON_CURVE, engine: V16 }).classRank).toBe(30)
    expect(balanceMember('mage', 0, 20, { ...ON_CURVE, engine: V15 }).classRank).toBe(20)
    expect(balanceMember('mage', 0, 20, { ...ON_CURVE, engine: V16, classRank: 20 }).classRank).toBe(20)
  })

  it('puts a member\'s trees on B with `lines` and gives her her own weapons, her Orb on her first slot\'s kind', () => {
    const a = balanceMember('brawler', 0, 50, { ...ON_CURVE, engine: V16, lines: { greatsword: 'B' }, weapons: ['bow', 'katana', 'axe'] })
    expect(a.weapons).toEqual(['bow', 'katana', 'axe'])
    expect(a.lines).toBeUndefined()
    const b = balanceMember('brawler', 0, 50, { ...ON_CURVE, engine: V16, lines: { greatsword: 'B' } })
    expect(b.lines).toEqual({ greatsword: 'B' })
    expect(b.loadout.map((r) => r.id)).toContain('brawler-greatsword.5b')
    expect(b.might?.greatsword).toBeGreaterThan(balanceMember('brawler', 0, 50, { ...ON_CURVE, engine: V16, weapons: ['axe', 'greatsword', 'lance'] }).might?.greatsword ?? 0)
    expect(balanceMember('brawler', 0, 50, { ...ON_CURVE, engine: V16, weapons: ['bow', 'katana', 'axe'] }).might?.bow)
      .toBeGreaterThan(balanceMember('brawler', 0, 50, { ...ON_CURVE, engine: V16 }).might?.bow ?? 0)
  })

  it('never refunds a deep act by a round with the base regen alone, any class, Lv 1–50 (SB18)', () => {
    for (const c of RPG_V2_CLASSES) for (let level = 1; level <= 50; level++) {
      const r = refundAt(c, level)
      expect(r.share, `${c} Lv ${level}: ${r.regen} of ${r.deep}`).toBeLessThan(1)
    }
  })

  it('keeps the hybrids 70/30 their way on one seed of the world\'s regular stages at Lv 30 and 50', () => {
    const log = fightLog()
    for (const level of [30, 50]) playInto(stagesAt(level, 1, V16).fight, partyAt(level, V16), V16, 1, log)
    expect(Math.abs(physicalShare(byClass(log, 'spellblade')!) - 0.7)).toBeLessThanOrEqual(0.05)
    expect(Math.abs(1 - physicalShare(byClass(log, 'summoner')!) - 0.7)).toBeLessThanOrEqual(0.05)
  }, 60_000)

  it.skipIf(!process.env.SIM)('prints R1\'s targets in the world (README §9.5 items 1–5, 7)', async () => {
    const want = new Set((process.env.SIM_TARGETS ?? '1,2,3,4,5,7').split(',').map(Number))
    const seeds = Number(process.env.SIM_SEEDS ?? 8)
    const levels = process.env.SIM_LEVELS ? process.env.SIM_LEVELS.split(',').map(Number) : null
    const rows: string[] = [`engine v16 against v15, world stages × ${seeds} seeds; on curve, first try on Auto`]

    // Target 1, the re-baseline, and 3, Breaks and charges, on the same fights; 2's world part too.
    const logs = new Map<string, Record<Kind, FightLog>>()
    const run = async (key: string, level: number, tier: number, engine: number, allies: BattleAlly[]) => {
      const stages = stagesAt(level, tier, engine)
      const out = { fight: fightLog(), 'sub-boss': fightLog(), boss: fightLog() } as Record<Kind, FightLog>
      for (const k of KINDS) playInto(stages[k], allies, engine, seeds, out[k])
      logs.set(key, out)
      await tick()
      return out
    }
    const cells = (r: Record<Kind, FightLog>) => KINDS.map((k) => (r[k].fights ? `${pct(winRate(r[k]))} ${f1(roundsOf(r[k]))}r` : '—')).join(' | ')
    /** The party's damage a round, by stage kind, against another row's. */
    const pace = (r: Record<Kind, FightLog>, base: Record<Kind, FightLog>) => KINDS.map((k) => f2((partyDamage(r[k]) / Math.max(1, r[k].rounds)) /
      (partyDamage(base[k]) / Math.max(1, base[k].rounds)))).join(' · ')
    const gap = (a: Record<Kind, FightLog>, b: Record<Kind, FightLog>) => Math.max(...KINDS.filter((k) => a[k].fights).map((k) => Math.abs(winRate(a[k]) - winRate(b[k]))))
    if (want.has(1) || want.has(2) || want.has(3)) {
      rows.push('', 'Target 1: tier level | party | regular | elite | boss (win rate, rounds) | gap to its v15 row | the party\'s damage a round ÷ v15\'s (regular · elite · boss)')
      let worst = 0
      for (const level of levels ?? [10, 20, 30, 40, 50]) {
        const v15 = await run(`1:${level}:15`, level, 1, V15, partyAt(level, V15))
        const v16 = await run(`1:${level}:16`, level, 1, V16, partyAt(level, V16))
        if (!want.has(1)) continue
        const p15 = await run(`1:${level}:15p`, level, 1, V15, partyAt(level, V15, {}, { cleric: 'paladin' }))
        const p16 = await run(`1:${level}:16p`, level, 1, V16, partyAt(level, V16, {}, { cleric: 'paladin' }))
        const flat = await run(`1:${level}:16flat`, level, 1, V16, partyAt(level, V16, { classRank: level }))
        const g15 = await run(`1:${level}:15g`, level, 1, V15, partyAt(level, V15, { stars: false }))
        const g16 = await run(`1:${level}:16g`, level, 1, V16, partyAt(level, V16, { stars: false }))
        worst = Math.max(worst, gap(v16, v15), gap(p16, p15))
        rows.push(`T1 Lv${level} | balance party v15 | ${cells(v15)} | — | —`, `T1 Lv${level} | balance party v16 | ${cells(v16)} | ${f1(100 * gap(v16, v15))} pts | ${pace(v16, v15)}`,
          `T1 Lv${level} | Paladin for the Cleric v15 | ${cells(p15)} | — | —`, `T1 Lv${level} | Paladin for the Cleric v16 | ${cells(p16)} | ${f1(100 * gap(p16, p15))} pts | ${pace(p16, p15)}`,
          `T1 Lv${level} | v16, Class Rank = her level (the old pace) | ${cells(flat)} | ${f1(100 * gap(flat, v15))} pts | ${pace(flat, v15)}`,
          `T1 Lv${level} | geared, no Extra Stats v15 (for the record) | ${cells(g15)} | — | —`, `T1 Lv${level} | geared, no Extra Stats v16 | ${cells(g16)} | ${f1(100 * gap(g16, g15))} pts | ${pace(g16, g15)}`)
      }
      rows.push(`Worst gap (on curve): ${f1(100 * worst)} points`)
    }
    if (want.has(3)) {
      // Target 3: rounds to a foe's first Break from her arrival (regulars on regular stages, the sub-boss, the boss), and
      // Auto's cancelled charges ÷ armed.
      rows.push('', 'Target 3: Lv | engine | regulars: broke, rounds (all) | sub-boss | boss | charges cancelled ÷ armed: regular | elite | boss stages')
      for (const level of (levels ?? [10, 30, 50]).filter((l) => logs.has(`1:${l}:15`))) {
        for (const engine of [V15, V16]) {
          const r = logs.get(`1:${level}:${engine}`)!
          const b = (k: Kind, rank: 'regular' | 'sub-boss' | 'boss') => {
            const x = r[k].breaks[rank]
            return `${pct(x.broke / Math.max(1, x.foes))}, ${f2(x.rounds / Math.max(1, x.broke))} (${f2(x.roundsAll / Math.max(1, x.foes))})`
          }
          const c = (k: Kind) => `${pct(r[k].charges.cancelled / Math.max(1, r[k].charges.armed))} of ${r[k].charges.armed}`
          rows.push(`Lv${level} | v${engine} | ${b('fight', 'regular')} | ${b('sub-boss', 'sub-boss')} | ${b('boss', 'boss')} | ${KINDS.map(c).join(' | ')}`)
        }
      }
    }
    if (want.has(2)) {
      // Target 2's world part: the hybrids on the world's regular stages, damage a turn and splits (H63's measures).
      rows.push('', 'Target 2: Lv | engine | Spell Blade a turn, physical | Summoner a turn, magical, farewells | Summoner ÷ Spell Blade | Paladin ÷ Cleric party')
      for (const level of levels ?? [10, 30, 50]) {
        for (const engine of [V15, V16]) {
          const key = `1:${level}:${engine}`
          const r = logs.get(key) ?? await run(key, level, 1, engine, partyAt(level, engine))
          const sb = byClass(r.fight, 'spellblade')!, su = byClass(r.fight, 'summoner')!
          rows.push(`Lv${level} | v${engine} | ${f1(perTurn(sb))}, ${pct(physicalShare(sb))} | ${f1(perTurn(su))}, ${pct(1 - physicalShare(su))}, ${pct(su.farewell / Math.max(1, damageOf(su)))} | ` +
            `${pct(perTurn(su) / perTurn(sb))} | —`)
        }
      }
    }
    if (want.has(7)) {
      rows.push('', 'Target 7: tier level | party | regular | elite | boss | gap to v15 | the party\'s damage a round ÷ v15\'s')
      for (const [tier, level] of [[2, 10], [2, 30], [2, 50], [3, 10], [3, 50]] as const) {
        if (!regionsAt(level, tier).length) { rows.push(`T${tier} Lv${level} | no world`); continue }
        const v15 = await run(`${tier}:${level}:15`, level, tier, V15, partyAt(level, V15, { tier }))
        const v16 = await run(`${tier}:${level}:16`, level, tier, V16, partyAt(level, V16, { tier }))
        rows.push(`T${tier} Lv${level} | v15 | ${cells(v15)} | — | —`, `T${tier} Lv${level} | v16 | ${cells(v16)} | ${f1(100 * gap(v16, v15))} pts | ${pace(v16, v15)}`)
      }
    }
    if (want.has(5)) {
      // Target 5: a region on Auto with one Spring, with today's supports (R1), then with no MP support (R2's preview).
      rows.push('', 'Target 5: Lv | party | stages cleared of 12 (mean; all 12; 10+) | rounds a stage in stages 9–12 | v15 ÷ it (pace against today\'s) | ' +
        'MP\'s drag: those rounds ÷ the same stages on a full bar')
      for (const level of levels ?? [10, 30, 50]) {
        const v15 = regionRun(level, V15, seeds)
        await tick()
        const v16 = regionRun(level, V16, seeds)
        await tick()
        const bare = regionRun(level, V16, seeds, (c) => (MP_SUPPORTS.has(BALANCE_KIT_V16[c].accessories[1]!) ? { support: null } : {}))
        await tick()
        const line = (label: string, r: ReturnType<typeof regionRun>) => rows.push(`Lv${level} | ${label} | ${f1(r.mean)}; ${r.all} of ${r.cleared.length}; ` +
          `${r.tenPlus} | ${f2(r.lateRounds)} | ${f2(v15.lateRounds / r.lateRounds)} | ${f2(r.drag)}`)
        line('v15, today\'s supports', v15)
        line('v16, today\'s supports', v16)
        line('v16, no MP support (R2\'s preview)', bare)
      }
      rows.push('', 'Refund: class | MP, base regen a round, deepest act\'s MP, share at Lv 10 · 20 · 30 · 40 · 50 | the most, Lv 1–50')
      for (const c of RPG_V2_CLASSES) {
        const at = [10, 20, 30, 40, 50].map((l) => refundAt(c, l))
        const most = Array.from({ length: 50 }, (_, k) => ({ level: k + 1, ...refundAt(c, k + 1) })).reduce((m, x) => (x.share > m.share ? x : m))
        rows.push(`${c} | ${at.map((x) => `${x.mp}, +${x.regen}, ${x.deep}, ${pct(x.share)}`).join(' · ')} | ${pct(most.share)} at Lv ${most.level}`)
      }
    }
    if (want.has(4)) {
      // Target 4: each B line against A, the member's line alone on B, in its context and elsewhere: her line's damage a
      // cast (the healers' Heavy: the party's rounds and damage taken), her damage a turn, the party's win rate and rounds.
      rows.push('', 'Target 4: Lv | class, tree, line | context | in context: her a turn B ÷ A (on sub-bosses and bosses for heavy and shielded), ' +
        'line a cast B ÷ A (casts A/B), party rounds A → B (wins), taken a round B ÷ A | elsewhere: the same, her a turn on every foe')
      const base = new Map<string, { in: FightLog; out: FightLog }>()
      const measure = (level: number, c: LineCase, lines: RpgLines) => {
        const stages = stagesAt(level, 1, V16)
        const all = [...stages.fight, ...stages['sub-boss'], ...stages.boss]
        const inside = all.filter(CONTEXT_STAGES[c.context])
        const outside = all.filter((n) => !CONTEXT_STAGES[c.context](n))
        const allies = partyAt(level, V16, {}, c.classId === 'paladin' ? { cleric: 'paladin' } : {},
          (k) => (k === c.classId ? { lines, ...(c.weapons ? { weapons: c.weapons } : {}) } : {}))
        return { in: playInto(inside, allies, V16, seeds), out: playInto(outside, allies, V16, seeds) }
      }
      for (const level of levels ?? [30, 50]) {
        for (const c of LINES) {
          const key = `${level}:${c.classId === 'paladin' ? 'p' : 'c'}:${c.classId}:${c.weapons?.join(',') ?? ''}:${c.context}`
          if (!base.has(key)) base.set(key, measure(level, c, {}))
          const a = base.get(key)!
          const b = measure(level, c, { [c.weapon]: 'B' })
          await tick()
          const id = String(BALANCE_PARTY.indexOf(c.classId === 'paladin' ? 'cleric' : c.classId) + 100)
          const read = (x: FightLog, y: FightLog, big: boolean) => {
            const ca = castsOf(x, lineIds(c, 'A')), cb = castsOf(y, lineIds(c, 'B'))
            const cast = HEALERS.includes(c.classId) ? '—' : `${f2((cb.dmg / Math.max(1, cb.n)) / (ca.dmg / Math.max(1, ca.n)))} (${ca.n}/${cb.n})`
            const her = big ? bigPerTurn(y.umas[id]) / bigPerTurn(x.umas[id]) : perTurn(y.umas[id]) / perTurn(x.umas[id])
            return `${f2(her)}, ${cast}, ${f1(roundsOf(x))} → ${f1(roundsOf(y))} (${pct(winRate(x))} → ${pct(winRate(y))}), ` +
              `${f2((y.taken / Math.max(1, y.rounds)) / (x.taken / Math.max(1, x.rounds)))}`
          }
          rows.push(`Lv${level} | ${c.classId} ${c.weapon} ${c.name} | ${c.context} | ${read(a.in, b.in, c.context !== 'waves')} | ${read(a.out, b.out, false)}`)
        }
      }
      rows.push('', 'Mixed: Lv | party | win rate, rounds (every stage) | gap to all-A')
      for (const level of levels ?? [30, 50]) {
        const stages = stagesAt(level, 1, V16)
        const all = [...stages.fight, ...stages['sub-boss'], ...stages.boss]
        const allA = playInto(all, partyAt(level, V16), V16, seeds)
        rows.push(`Lv${level} | all A | ${pct(winRate(allA))}, ${f1(roundsOf(allA))} | —`)
        for (const slot of [0, 1, 2]) {
          const mix = playInto(all, partyAt(level, V16, {}, {}, (k) => ({ lines: { [rpgDefaultWeapons(k, V16)[slot]!]: 'B' } })), V16, seeds)
          rows.push(`Lv${level} | each member's slot ${slot + 1} on B | ${pct(winRate(mix))}, ${f1(roundsOf(mix))} | ${f1(100 * Math.abs(winRate(mix) - winRate(allA)))} pts`)
          await tick()
        }
        const every = playInto(all, partyAt(level, V16, {}, {}, (k) => ({ lines: Object.fromEntries(rpgDefaultWeapons(k, V16).map((w) => [w, 'B'])) })), V16, seeds)
        rows.push(`Lv${level} | every tree on B | ${pct(winRate(every))}, ${f1(roundsOf(every))} | ${f1(100 * Math.abs(winRate(every) - winRate(allA)))} pts`)
      }
    }
    console.log(rows.join('\n'))
  }, 7_200_000)
})
