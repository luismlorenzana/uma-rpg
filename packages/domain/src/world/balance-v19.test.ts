// Classes v3's and Halls v2's balance in the world (H131; classes-v3.md §12, CV34; halls-v2.md §3, HV-D): engine v19's
// generation measured with explicit inputs, never the switch, against v18 (live) on the same seeds. The balance party is
// `BALANCE_PARTY` on its v3 names (Brawler, Sorcerer, Arms Spellblade, Cleric, Tome Summoner); the mirror party swaps in the
// Tome Spellblade and the Arms Summoner; the Paladin party is H115's swap (the Paladin in the Cleric's place), with CV §11's
// (Brawler, Sorcerer, Tome Spellblade, Arms Summoner, Paladin) printed beside; the Tier 0 party is the five Tier 0s.
// The always-on checks are small; the tables: `SIM=1 npx vitest run src/world/balance-v19.test.ts` (`SIM_SEEDS=32` for the
// delivery; `SIM_TARGETS=s1,s6,lines,s10,h1,s3,s4,s5,s7,h2` and `SIM_LEVELS=30,50` narrow them).
import { describe, expect, it } from 'vitest'
import { rpgRework } from '../rpg/battle/caps'
import { applyBattleAction, createBattle } from '../rpg/battle/engine'
import { battleLimitPlan, type BattleLimitPlan } from '../rpg/battle/limit'
import type { BattleAlly, BattleEnemy, BattleInput } from '../rpg/battle/types'
import type { RpgMapNode } from '../rpg/campaign/chapters'
import { RPG_VOLLEY } from '../rpg/catalog'
import { heroLimitFor, heroLimitIds, heroLimitScale, heroLimitSkills, heroSeatHome } from '../rpg/heroes'
import { rpgBranchNode, rpgTreeOf, type RpgLines } from '../rpg/node-identity'
import {
  RPG_ALL_CLASSES, RPG_DEPTH_GATES, RPG_TIER0_CLASSES, rpgDefaultWeapons, rpgIsHealer, rpgIsTier0, rpgOpenDepth, rpgOpenDepthOf,
  type RpgClass, type RpgWeapon,
} from '../rpg/rules'
import { rpgChapterReach } from '../rpg/campaign/chapters'
import { classPresetV3 } from '../save/presets'
import { capitalChapter } from './capital'
import { BALANCE_PARTY, balanceClassRank, balanceClassRankOf, balanceMember, balanceSeat, balanceStage, type BalanceOptions } from './balance-party'
import { play } from './balance-play'
import {
  actPerTurn, bigPerTurn, byClass, castsOf, damageOf, fightLog, limitDamage, logFight, merged, perTurn, physicalShare, treeDamage,
  type FightLog, type UmaLog,
} from './balance-measure'
import { regionChapter, worldContinent } from './world'

const V18 = 18, V19 = 19
const cast = Array.from({ length: 30 }, (_, i) => ({ id: `c${i}`, name: `Rival ${i}` }))
const ON_CURVE: BalanceOptions = { gear: true, stars: true, heroes: true }
type Kind = 'fight' | 'sub-boss' | 'boss'
const KINDS: readonly Kind[] = ['fight', 'sub-boss', 'boss']
const RANK = { fight: 'regular', 'sub-boss': 'sub-boss', boss: 'boss' } as const
type Swap = Partial<Record<RpgClass, RpgClass>>
/** The mirror party (decision 3): the Tome Spellblade and the Arms Summoner in their pairs' places. */
const MIRROR: Swap = { spellblade: 'tomeblade', summoner: 'armsummoner' }
/** H115's swap: the Paladin in the Cleric's place. */
const PALADIN: Swap = { cleric: 'paladin' }
/** CV §11's default party with a Paladin (all ten kinds). */
const CV11_PALADIN: readonly RpgClass[] = ['brawler', 'mage', 'tomeblade', 'armsummoner', 'paladin']

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
const partyOf = (classes: readonly RpgClass[], level: number, engine: number, each: (c: RpgClass) => BalanceOptions = () => ({})): BattleAlly[] =>
  classes.map((c, i) => balanceMember(c, i, level, { ...ON_CURVE, engine, ...each(c) }))
const partyAt = (level: number, engine: number, swap: Swap = {}, each: (c: RpgClass) => BalanceOptions = () => ({})): BattleAlly[] =>
  partyOf(BALANCE_PARTY.map((c) => swap[c] ?? c), level, engine, each)
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
const firstBreak = (l: FightLog, k: Kind) => { const b = l.breaks[RANK[k]]; return b.broke ? b.rounds / b.broke : 0 }
const tick = () => new Promise((resolve) => setTimeout(resolve, 0))
const uma = (l: FightLog, c: RpgClass): UmaLog => byClass(l, c)!

// --- The act-worth check (S6, decision 8) -------------------------------------------------------------------------------

type Shape = 'heavy' | 'double' | 'scatter' | 'sweep' | 'volley'
/** Each shape's line A tree: the Brawler's five Arms and the Sorcerer's five Tomes (§4.1). */
const SHAPES: Readonly<Record<'brawler' | 'mage', readonly (readonly [RpgWeapon, Shape])[]>> = {
  brawler: [['greatsword', 'heavy'], ['katana', 'double'], ['lance', 'scatter'], ['axe', 'sweep'], ['bow', 'volley']],
  mage: [['tome-fire', 'heavy'], ['tome-light', 'double'], ['tome-lightning', 'scatter'], ['tome-ice', 'sweep'], ['tome-dark', 'volley']],
}
/** §4.1's act-worth table, in single-target units at the act's depth, with `n` foes standing. */
const WORTH: Readonly<Record<Shape, (n: number) => number>> = {
  heavy: () => 1, double: () => 1, scatter: () => 1.05, sweep: (n) => 0.55 * n, volley: (n) => RPG_VOLLEY.target + RPG_VOLLEY.splash * (n - 1),
}
/** The fight's four others (a fight holds five Umas; only her one act is played) and a world foe to copy. */
const actScene = (() => {
  let scene: { fillers: BattleAlly[]; template: BattleEnemy } | undefined
  return () => (scene ??= { fillers: partyAt(30, V19).slice(1), template: stagesAt(30, 1, V19).fight[0]!.enemies[0]! })
})()
/** One cast of her depth 3 line A skill of a tree, without gear, on `n` identical unweak foes with HP no act can take: the
 * damage of her hits on the foes. */
function actDamage(classId: 'brawler' | 'mage', weapon: RpgWeapon, n: number, seed: number): number {
  const node = `${rpgTreeOf(classId, weapon)}.3`
  const weapons = [weapon, ...rpgDefaultWeapons(classId, V19).filter((w) => w !== weapon)].slice(0, 3)
  const base = balanceMember(classId, 0, 50, { engine: V19, weapons })
  const ally: BattleAlly = { ...base, loadout: [{ tier: 1, id: node }], mp: base.stats.mp }
  const { fillers, template } = actScene()
  // Unweak to her: weak only to a kind of the other channel (a foe is weak to one kind at least).
  const weaknesses = classId === 'brawler' ? { weapons: [], elements: ['fire' as const] } : { weapons: ['greatsword' as const], elements: [] }
  // No defense, so each hit is large and a hit's rounding stays under 1%.
  const foes: BattleEnemy[] = Array.from({ length: n }, (_, k) => ({ ...template, id: `f${k}`,
    stats: { ...template.stats, hp: 10_000_000, pdef: 0, mdef: 0 }, weaknesses }))
  const { state } = createBattle({ version: V19, seed, allies: [ally, ...fillers], enemies: foes })
  const step = applyBattleAction(state, { kind: 'skill', actorId: ally.id, targetId: 'f0', skill: { tier: 1, id: node } })
  if (step.error) throw new Error(`${node}: ${step.error}`)
  let total = 0
  for (const c of step.cues) {
    if (c.kind === 'move') break
    if (c.kind === 'hit' && c.actorId === ally.id && c.targetId.startsWith('f') && c.channel !== 'status') total += c.amount
  }
  return total
}
/** Her act's worth over 16 seeds, ÷ her heavy act's on one foe. */
const actMeans = new Map<string, number>()
function actWorth(classId: 'brawler' | 'mage', weapon: RpgWeapon, n: number): number {
  const mean = (w: RpgWeapon, k: number) => {
    const key = `${classId}:${w}:${k}`
    if (!actMeans.has(key)) actMeans.set(key, Array.from({ length: 16 }, (_, s) => actDamage(classId, w, k, 7 + s)).reduce((a, b) => a + b, 0) / 16)
    return actMeans.get(key)!
  }
  return mean(weapon, n) / mean(SHAPES[classId][0]![0], 1)
}

// --- 1-, 3- and 5-foe stages (S6, decision 9) ---------------------------------------------------------------------------

/** A regular stage with its first wave cut to its first `n` foes or padded with copies of its last, other waves dropped. */
const sized = (node: RpgMapNode, n: number): RpgMapNode => {
  const first = node.enemies
  const enemies = Array.from({ length: n }, (_, k) => ({ ...(first[Math.min(k, first.length - 1)]!), id: `${first[Math.min(k, first.length - 1)]!.id}-${k}` }))
  const { waves: _, ...rest } = node
  return { ...rest, enemies }
}

// --- H1: a Limit Break's worth (decision 10) ----------------------------------------------------------------------------

/** HV5's draft scale (the design's: the healers 0.75, every other class 1), the analytic's, whatever the tuned table says. */
const designScale = (c: RpgClass) => (rpgIsHealer(c, V19) ? 0.75 : 1)
/** A plan's worth with `n` foes standing: each cast's hits × her strength, every-foe hits on each foe (their area share is in
 * the hit), a random hit's bonus in it, a volley's splash on every other foe. */
const worthAt = (plan: BattleLimitPlan, n: number): number => plan.casts.reduce((m, c) =>
  m + c.scale * (c.def.hits.reduce((s, h) => s + h.power, 0) * (c.def.target === 'all' ? n : 1) + (c.def.splash ? c.def.splash.power * Math.max(0, n - 1) : 0)), 0)
/** Her Limit Break casts' worth in a log (the foes standing at each), by the formula (HV5: its power × her class's scale ×
 * her open depth's power × her Bond's strength, shared by its hits and their shapes), at the design's scale. */
function limitWorth(ally: BattleAlly, engine: number, u: UmaLog): number {
  const seat = ally.inherits?.[0]
  if (!seat) return 0
  const plan = battleLimitPlan(ally, { hero: seat.limit }, engine)!
  const scale = rpgRework('classes', engine) ? designScale(ally.classId) / heroLimitScale(ally.classId, engine) : 1
  let worth = 0
  u.limitFoes.forEach((k, n) => { if (k) worth += k * worthAt(plan, n) })
  return worth * scale
}

describe('Classes v3 and Halls v2 in the world on engine v19 (H131)', () => {
  it('reads v3\'s Class Rank pace: a Tier 0 at her level to 10, a Tier 1 class from Rank 10 at Lv 10 (S2)', () => {
    expect([1, 5, 9, 10, 12, 50].map((l) => balanceClassRankOf('recruit', l, V19))).toEqual([1, 5, 9, 10, 10, 10])
    expect([1, 9, 10].map((l) => balanceClassRank(l, V19))).toEqual([10, 10, 10])
    // The ladder: her Tier 0 (depth 1) to Lv 9, her Tier 1 class from its Rank 10 at Lv 10.
    const depthAt = (l: number) => (l < 10 ? rpgOpenDepthOf({ classId: 'recruit', classRank: balanceClassRankOf('recruit', l, V19) }, V19)
      : rpgOpenDepth(balanceClassRank(l, V19)))
    const levels = Array.from({ length: 50 }, (_, k) => k + 1)
    expect([2, 3, 4, 5].map((d) => levels.find((l) => depthAt(l) >= d))).toEqual([10, 16, 22, 29])
    expect(levels.find((l) => balanceClassRank(l, V19) === 50)).toBe(36)
    // Never after the foes expect a depth (`rpgChapterReach`: depth 2 from Lv 10, 3 from 20, 4 from 30, 5 from 40).
    for (const level of levels) {
      const want = RPG_DEPTH_GATES.filter((g) => level >= g).length
      expect(rpgChapterReach(level), `Lv ${level}`).toBeCloseTo([1.6, 2.2, 2.9, 3.7, 4.6][want - 1]! / 1.6, 5)
      expect(depthAt(level), `Lv ${level}`).toBeGreaterThanOrEqual(want)
    }
    // v18's pace unchanged (H71's).
    expect([13, 20, 27, 34].map((l) => balanceClassRank(l, V18))).toEqual([20, 30, 40, 50])
    expect([1, 2, 12, 50].map((l) => balanceClassRank(l, V18))).toEqual([1, 2, 18, 50])
    expect(balanceMember('recruit', 0, 7, { ...ON_CURVE, engine: V19 }).classRank).toBe(7)
    expect(balanceMember('mage', 0, 20, { ...ON_CURVE, engine: V19 }).classRank).toBe(balanceClassRank(20, V19))
    expect(balanceMember('mage', 0, 20, { ...ON_CURVE, engine: V18 }).classRank).toBe(30)
  })

  it('builds the v19 member: her v19 defaults, her preset form, a v19 Learner seat (decision 2)', () => {
    const seats = new Map(RPG_ALL_CLASSES.map((c) => [c, balanceSeat(c, V19)]))
    expect(Object.fromEntries(seats)).toEqual({
      brawler: 'brawler-1', mage: 'mage-1', spellblade: 'spellblade-1', cleric: 'healer-3', summoner: 'summoner-3', paladin: 'healer-1',
      recruit: 'brawler-1', duelist: 'spellblade-1', acolyte: 'healer-1', caller: 'summoner-1', apprentice: 'mage-1',
      armsummoner: 'summoner-1', tomeblade: 'spellblade-3',
    })
    for (const c of RPG_ALL_CLASSES) {
      const a = balanceMember(c, 0, 30, { ...ON_CURVE, engine: V19 })
      expect(a.weapons, c).toEqual(rpgDefaultWeapons(c, V19))
      expect(heroLimitIds(V19), c).toContain(a.inherits![0]!.limit)
      if (!rpgIsTier0(c)) expect(heroSeatHome(a.inherits![0]!.limit, V19), c).toBe(c)
      // Her form is her class's v19 preset: a Bell on its kind, an Orb's offense on its kind alone, a Pendant's on all three.
      const form = classPresetV3(c, V19).accessory
      expect(a, c).toEqual(balanceMember(c, 0, 30, { ...ON_CURVE, engine: V19, accessory: form }))
      if (form?.family === 'bell') expect(a.bell?.kind, c).toBe(form.kind)
      if (form?.family === 'orb') expect(Object.keys(a.flat ?? {}), c).toEqual([form.kind])
      if (form?.family === 'pendant') expect(Object.keys(a.flat ?? {}).sort(), c).toEqual(a.weapons.map((w) => w.replace('tome-', '')).sort())
    }
    // v18's seats unchanged.
    expect(BALANCE_PARTY.map((c) => balanceSeat(c, V18))).toEqual(['brawler-1', 'mage-1', 'spellblade-1', 'cleric-1', 'summoner-1'])
  })

  it('reads the volley\'s constants in Halls v2\'s two volley seats (brawler-4, mage-4)', () => {
    for (const id of ['brawler-4', 'mage-4'] as const) {
      const limit = heroLimitFor(id, V19)!
      const skills = heroLimitSkills(limit, 1)
      const casts = limit.casts.filter((c) => c.volley)
      expect(casts.length, id).toBe(2)
      casts.forEach((c, k) => {
        const s = skills[limit.casts.indexOf(c)]!
        expect(s.hits.reduce((m, h) => m + h.power, 0) / c.hits.reduce((m, h) => m + h.share, 0), `${id} ${k}`).toBeCloseTo(RPG_VOLLEY.target, 2)
        expect(s.splash!.power / c.splash!.share, `${id} ${k}`).toBeCloseTo(RPG_VOLLEY.splash, 2)
      })
    }
  })

  it('matches §4.1\'s act-worth table within 0.03, the volley best on two foes (S6, decision 8)', () => {
    for (const classId of ['brawler', 'mage'] as const) {
      for (let n = 1; n <= 6; n++) {
        const got = SHAPES[classId].map(([w, shape]) => ({ shape, worth: actWorth(classId, w, n) }))
        for (const g of got) expect(Math.abs(g.worth - WORTH[g.shape](n)), `${classId} ${g.shape} n=${n}: ${g.worth}`).toBeLessThanOrEqual(0.03)
        if (n === 2) expect(got.reduce((a, b) => (b.worth > a.worth ? b : a)).shape, classId).toBe('volley')
      }
    }
  }, 60_000)

  it('lets a Tier 0 party win a continent 1 Lv 5 stage, and the v19 balance party a Tier 1 Lv 30 stage, on Auto', () => {
    const tier0 = partyOf(RPG_TIER0_CLASSES, 5, V19)
    expect(tier0.map((a) => a.classRank)).toEqual([5, 5, 5, 5, 5])
    expect(tier0.every((a) => rpgOpenDepthOf({ classId: a.classId, classRank: a.classRank! }, V19) === 1)).toBe(true)
    expect(play(balanceStage(stagesAt(5, 1, V19).fight[0]!, 7, tier0, V19)).won).toBe(true)
    expect(play(balanceStage(stagesAt(30, 1, V19).fight[0]!, 7, partyAt(30, V19), V19)).won).toBe(true)
  })

  it.skipIf(!process.env.SIM)('prints Classes v3\'s and Halls v2\'s targets in the world (S1–S7, S10, H1, H2)', async () => {
    const want = new Set((process.env.SIM_TARGETS ?? 'worth,s1,s6,lines,s10,h1,s3,s4,s5,s7,h2').split(','))
    const seeds = Number(process.env.SIM_SEEDS ?? 8)
    const levels = process.env.SIM_LEVELS ? process.env.SIM_LEVELS.split(',').map(Number) : [10, 20, 30, 40, 50]
    const rows: string[] = [`engine v19 against v18, world stages × ${seeds} seeds; on curve, first try on Auto`]
    const flush = () => { if (rows.length) console.log(rows.splice(0).join('\n')) }
    // H63's practice: at the delivery's 32 seeds, every band H131 met is asserted once printed (its misses are D249's).
    const met = (ok: boolean, label: string) => { if (seeds >= 32) expect(ok, label).toBe(true) }
    const logs = new Map<string, Record<Kind, FightLog>>()
    const run = async (key: string, level: number, engine: number, allies: () => BattleAlly[]) => {
      const cached = logs.get(key)
      if (cached) return cached
      const stages = stagesAt(level, 1, engine)
      const party = allies()
      const out = { fight: fightLog(), 'sub-boss': fightLog(), boss: fightLog() } as Record<Kind, FightLog>
      for (const k of KINDS) playInto(stages[k], party, engine, seeds, out[k])
      logs.set(key, out)
      await tick()
      return out
    }
    const all = (r: Record<Kind, FightLog>): FightLog => merged(KINDS.map((k) => r[k]))
    const cells = (r: Record<Kind, FightLog>) => KINDS.map((k) => (r[k].fights ? `${pct(winRate(r[k]))} ${f1(roundsOf(r[k]))}r` : '—')).join(' | ')
    // The parties a level's tables read, each played once: the balance party, the Paladin swap and the mirror party.
    const PARTIES = { v18: [V18, {}], v19: [V19, {}], p18: [V18, PALADIN], p19: [V19, PALADIN], m19: [V19, MIRROR] } as const
    type Key = keyof typeof PARTIES
    const at = async (level: number, keys: readonly Key[] = ['v18', 'v19', 'p18', 'p19', 'm19']) => {
      const out = {} as Record<Key, Record<Kind, FightLog>>
      for (const k of keys) {
        const [engine, swap] = PARTIES[k]
        out[k] = await run(`${level}:${k}`, level, engine, () => partyAt(level, engine, swap))
      }
      return out
    }

    if (want.has('worth')) {
      rows.push('', 'S6 act worth (decision 8): class | foes | heavy | double | scatter | sweep | volley (÷ her heavy act on one foe; §4.1 in brackets)')
      for (const classId of ['brawler', 'mage'] as const) for (let n = 1; n <= 6; n++) {
        rows.push(`${classId} | ${n} | ${SHAPES[classId].map(([w, shape]) => `${f2(actWorth(classId, w, n))} (${f2(WORTH[shape](n))})`).join(' | ')}`)
      }
    }

    if (want.has('s1')) {
      // S1: the Tier 0 party (v19) against v18's balance party, continent 1's stages at their level, Lv 1–10, and the
      // capital's Finals at Lv 10 (its three routes, vanguard and champion).
      rows.push('', 'S1: stage kind | v18 balance party (win, rounds) | v19 Tier 0 party | gap (points, rounds) — continent 1, Lv 1–10')
      const kinds = ['fight', 'sub-boss', 'boss', 'finals'] as const
      const sum = () => Object.fromEntries(kinds.map((k) => [k, fightLog()])) as Record<(typeof kinds)[number], FightLog>
      const s18 = sum(), s19 = sum()
      const byLevel: string[] = []
      for (let level = 1; level <= 10; level++) {
        const a18 = partyAt(level, V18), a19 = partyOf(RPG_TIER0_CLASSES, level, V19)
        const l18 = { fight: fightLog(), 'sub-boss': fightLog(), boss: fightLog() } as Record<Kind, FightLog>
        const l19 = { fight: fightLog(), 'sub-boss': fightLog(), boss: fightLog() } as Record<Kind, FightLog>
        for (const k of KINDS) {
          playInto(stagesAt(level, 1, V18)[k], a18, V18, seeds, l18[k])
          playInto(stagesAt(level, 1, V19)[k], a19, V19, seeds, l19[k])
          s18[k] = merged([s18[k], l18[k]]); s19[k] = merged([s19[k], l19[k]])
        }
        byLevel.push(`Lv${level} | v18 ${cells(l18)} | v19 Tier 0 ${cells(l19)}`)
        await tick()
      }
      const continent = worldContinent({ name: 'Sim', order: 1 })
      const finals = (engine: number) => capitalChapter(continent, cast, engine).nodes.filter((n) => n.kind !== 'camp')
      playInto(finals(V18), partyAt(10, V18), V18, seeds, s18.finals)
      playInto(finals(V19), partyOf(RPG_TIER0_CLASSES, 10, V19), V19, seeds, s19.finals)
      for (const k of kinds) {
        const a = s18[k], b = s19[k]
        rows.push(`${k} | ${pct(winRate(a))} ${f2(roundsOf(a))}r | ${pct(winRate(b))} ${f2(roundsOf(b))}r | ` +
          `${f1(100 * (winRate(b) - winRate(a)))} pts, ${f2(roundsOf(b) - roundsOf(a))}r (±5, ±1)`)
        met(Math.abs(winRate(b) - winRate(a)) <= 0.05 && Math.abs(roundsOf(b) - roundsOf(a)) <= 1, `S1 ${k}`)
      }
      rows.push('', 'S1 by level: v18 balance party | v19 Tier 0 party (regular | elite | boss)', ...byLevel)
      const l18 = all({ fight: s18.fight, 'sub-boss': s18['sub-boss'], boss: s18.boss }), l19 = all({ fight: s19.fight, 'sub-boss': s19['sub-boss'], boss: s19.boss })
      rows.push('', 'S1 by class, damage a turn (every continent 1 stage): ' +
        RPG_TIER0_CLASSES.map((c) => `${c} ${Math.round(perTurn(byClass(l19, c)))}`).join(', ') + ' | v18: ' +
        BALANCE_PARTY.map((c) => `${c} ${Math.round(perTurn(byClass(l18, c)))}`).join(', '))
    }

    flush()

    if (want.has('s6')) {
      rows.push('', 'S6: Lv | Brawler a turn without Limit Breaks, v18 → v19 (ratio) | Sorcerer — regular stages (±5%)')
      for (const level of levels) {
        const r = await at(level, ['v18', 'v19'])
        const line = (c: RpgClass) => {
          const a = actPerTurn(uma(r.v18.fight, c)), b = actPerTurn(uma(r.v19.fight, c))
          // Lv 20 is S2's pace (depth 3 against v18's 4), out of the volley's reach: D249 records it.
          if (level !== 20) met(Math.abs(b / a - 1) <= 0.05, `S6 Lv ${level} ${c}`)
          return `${f1(a)} → ${f1(b)} (${pct(b / a)})`
        }
        rows.push(`Lv${level} | ${line('brawler')} | ${line('mage')}`)
      }
      // The Bow's and Dark's trees' share of a holder's damage on 1-, 3- and 5-foe stages (decision 9): a Brawler with her Bow
      // in her third slot and a Sorcerer with her Dark, in the balance party; the mirror party's Arms Summoner (Bow, Dark);
      // the Tome Summoner's Dark and the Cleric's Bow on their defaults.
      rows.push('', 'S6 shares: Lv | n foes | engine | Brawler (GS, Axe, Bow): Bow tree (her a turn without Limit Breaks) | Sorcerer (Fire, Ice, Dark): Dark (a turn) | Tome Summoner: Dark | ' +
        'Cleric: Bow | Arms Summoner (mirror party): Bow, Dark')
      const holders = (c: RpgClass): BalanceOptions => (c === 'brawler' ? { weapons: ['greatsword', 'axe', 'bow'] }
        : c === 'mage' ? { weapons: ['tome-fire', 'tome-ice', 'tome-dark'] } : {})
      for (const level of [30, 50].filter((l) => levels.includes(l))) {
        for (const n of [1, 3, 5]) {
          for (const engine of [V18, V19]) {
            const nodes = stagesAt(level, 1, engine).fight.map((node) => sized(node, n))
            const l = playInto(nodes, partyAt(level, engine, {}, holders), engine, seeds)
            const share = (c: RpgClass, w: RpgWeapon) => pct(treeDamage(l, rpgTreeOf(c, w)) / Math.max(1, damageOf(uma(l, c))))
            let mirror = '—'
            if (engine === V19) {
              const m = playInto(nodes, partyAt(level, engine, MIRROR), engine, seeds)
              const s = (w: RpgWeapon) => pct(treeDamage(m, rpgTreeOf('armsummoner', w)) / Math.max(1, damageOf(uma(m, 'armsummoner'))))
              mirror = `${s('bow')}, ${s('tome-dark')}`
            }
            rows.push(`Lv${level} | ${n} | v${engine} | ${share('brawler', 'bow')} (a turn ${f1(actPerTurn(uma(l, 'brawler')))}) | ` +
              `${share('mage', 'tome-dark')} (a turn ${f1(actPerTurn(uma(l, 'mage')))}) | ${share('summoner', 'tome-dark')} | ${share('cleric', 'bow')} | ${mirror}`)
            await tick()
          }
        }
        flush()
      }
    }

    flush()
    if (want.has('lines')) {
      // S6's lines (CV14; H71's Target 4 at 19): each moved B line alone on B against all A, her damage a turn in its context
      // (on the sub-bosses and bosses themselves) and elsewhere, her line's casts beside it.
      rows.push('', 'S6 lines: Lv | class, tree, line | context | in context: her a turn B ÷ A, line a cast B ÷ A (casts A/B), party rounds A → B (wins) | ' +
        'elsewhere: her a turn B ÷ A, line a cast B ÷ A')
      const LINES = [
        { classId: 'brawler', weapon: 'bow', name: 'Barrage', context: 'heavy', weapons: ['greatsword', 'axe', 'bow'] },
        { classId: 'mage', weapon: 'tome-dark', name: 'Barrage', context: 'heavy', weapons: ['tome-fire', 'tome-ice', 'tome-dark'] },
        { classId: 'mage', weapon: 'tome-light', name: 'Pierce', context: 'shielded', weapons: ['tome-fire', 'tome-ice', 'tome-light'] },
      ] as const
      const inContext = (context: 'heavy' | 'shielded', n: RpgMapNode) => (context === 'heavy' ? n.kind !== 'fight' : n.kind === 'sub-boss')
      for (const level of [30, 50].filter((l) => levels.includes(l))) {
        const stages = stagesAt(level, 1, V19)
        const every = [...stages.fight, ...stages['sub-boss'], ...stages.boss]
        for (const c of LINES) {
          const measure = (lines: RpgLines) => {
            const allies = partyAt(level, V19, {}, (k) => (k === c.classId ? { weapons: c.weapons, lines } : {}))
            return { in: playInto(every.filter((n) => inContext(c.context, n)), allies, V19, seeds),
              out: playInto(every.filter((n) => !inContext(c.context, n)), allies, V19, seeds) }
          }
          const a = measure({}), b = measure({ [c.weapon]: 'B' })
          const id = String(BALANCE_PARTY.indexOf(c.classId) + 100)
          const ids = (branch: 'A' | 'B') => [3, 4, 5].map((d) => (branch === 'A' ? `${rpgTreeOf(c.classId, c.weapon)}.${d}` : rpgBranchNode(c.classId, c.weapon, d, 'B')))
          const read = (x: FightLog, y: FightLog, big: boolean) => {
            const ca = castsOf(x, ids('A')), cb = castsOf(y, ids('B'))
            const her = big ? bigPerTurn(y.umas[id]) / bigPerTurn(x.umas[id]) : perTurn(y.umas[id]) / perTurn(x.umas[id])
            return `${f2(her)}, ${f2((cb.dmg / Math.max(1, cb.n)) / (ca.dmg / Math.max(1, ca.n)))} (${ca.n}/${cb.n}), ` +
              `${f1(roundsOf(x))} → ${f1(roundsOf(y))} (${pct(winRate(x))} → ${pct(winRate(y))})`
          }
          rows.push(`Lv${level} | ${c.classId} ${c.weapon} ${c.name} | ${c.context} | ${read(a.in, b.in, true)} | ${read(a.out, b.out, false)}`)
          // The Sorcerer's Dark Barrage meets both bounds; the Bow Barrage and the Light Pierce are D249's misses.
          if (c.weapon === 'tome-dark') {
            met(bigPerTurn(b.in.umas[id]) > bigPerTurn(a.in.umas[id]) && perTurn(b.out.umas[id]) <= perTurn(a.out.umas[id]), `S6 lines Lv ${level} ${c.name}`)
          }
          await tick()
        }
        flush()
      }
    }

    flush()
    if (want.has('s10')) {
      rows.push('', 'S10: Lv | rounds to her first Break, v18 → v19 (gap): regulars on regular stages | the sub-boss | the boss (±0.5)')
      let worst = 0
      for (const level of levels) {
        const r = await at(level, ['v18', 'v19'])
        const cell = (k: Kind) => {
          const a = firstBreak(r.v18[k], k), b = firstBreak(r.v19[k], k)
          worst = Math.max(worst, Math.abs(b - a))
          return `${f2(a)} → ${f2(b)} (${b >= a ? '+' : ''}${f2(b - a)})`
        }
        rows.push(`Lv${level} | ${KINDS.map(cell).join(' | ')}`)
      }
      rows.push(`Worst: ${f2(worst)} rounds`)
      met(worst <= 0.5, 'S10')
    }

    if (want.has('h1')) {
      // H1 (decision 10): her Limit Break damage a fight, v19 ÷ v18, against the same ratio of her casts' worth by the formula
      // at the foes standing at each (her open depth's power and her Bond in both, at the design's scale).
      rows.push('', 'H1: class (v19 seat ← v18 seat) | casts a fight v18 → v19 | foes standing at a cast | hits a cast | weak hits | hits in a kind she wields | ' +
        'damage on a Broken foe | measured v19 ÷ v18 | analytic (§3.5\'s change at her casts) | measured ÷ analytic (±5%) | by level — every stage, Lv ' +
        levels.join(', '))
      const cases: { c: RpgClass; v18: RpgClass; key19: 'v19' | 'm19' | 'p19'; key18: 'v18' | 'p18' }[] = [
        { c: 'brawler', v18: 'brawler', key19: 'v19', key18: 'v18' }, { c: 'mage', v18: 'mage', key19: 'v19', key18: 'v18' },
        { c: 'spellblade', v18: 'spellblade', key19: 'v19', key18: 'v18' }, { c: 'tomeblade', v18: 'spellblade', key19: 'm19', key18: 'v18' },
        { c: 'armsummoner', v18: 'summoner', key19: 'm19', key18: 'v18' }, { c: 'summoner', v18: 'summoner', key19: 'v19', key18: 'v18' },
        { c: 'paladin', v18: 'paladin', key19: 'p19', key18: 'p18' }, { c: 'cleric', v18: 'cleric', key19: 'v19', key18: 'v18' },
      ]
      for (const k of cases) {
        let w19 = 0, w18 = 0, f19 = 0, f18 = 0
        const m19: UmaLog[] = [], m18: UmaLog[] = [], each: string[] = []
        for (const level of levels) {
          const r = await at(level)
          const l19 = all(r[k.key19]), l18 = all(r[k.key18])
          const u19 = uma(l19, k.c), u18 = uma(l18, k.v18)
          const a19 = balanceMember(k.c, 0, level, { ...ON_CURVE, engine: V19 }), a18 = balanceMember(k.v18, 0, level, { ...ON_CURVE, engine: V18 })
          const x19 = limitWorth(a19, V19, u19), x18 = limitWorth(a18, V18, u18)
          w19 += x19; w18 += x18; f19 += l19.fights; f18 += l18.fights
          m19.push(u19); m18.push(u18)
          each.push(pct(((limitDamage(u19) / l19.fights) / (limitDamage(u18) / l18.fights)) / ((x19 / l19.fights) / (x18 / l18.fights))))
        }
        const u19 = byClass(merged(m19.map((u) => ({ ...fightLog(), umas: { x: u } }))), k.c)!
        const u18 = byClass(merged(m18.map((u) => ({ ...fightLog(), umas: { x: u } }))), k.v18)!
        const foes = (u: UmaLog) => u.limitFoes.reduce((m, x, n) => m + (x ?? 0) * n, 0) / Math.max(1, u.limits)
        const measured = (limitDamage(u19) / f19) / (limitDamage(u18) / f18), analytic = (w19 / f19) / (w18 / f18)
        const both = (g: (u: UmaLog) => string) => `${g(u18)} → ${g(u19)}`
        rows.push(`${k.c} (${balanceSeat(k.c, V19)} ← ${balanceSeat(k.v18, V18)}) | ${f2(u18.limits / f18)} → ${f2(u19.limits / f19)} | ${both((u) => f2(foes(u)))} | ` +
          `${both((u) => f1(u.limitHits / Math.max(1, u.limits)))} | ${both((u) => pct(u.limitWeak / Math.max(1, u.limitHits)))} | ${both((u) => pct(u.limitOwn / Math.max(1, u.limitHits)))} | ` +
          `${both((u) => pct(u.limitBroken / Math.max(1, limitDamage(u))))} | ${f2(measured)} | ${f2(analytic)} | ${pct(measured / analytic)} | ${each.join(' · ')}`)
        // The Brawler's meets ±5% at her band's edge; the other seven are D249's misses (their seats' kinds, not a scale).
        if (k.c === 'brawler') met(Math.abs(measured / analytic - 1) <= 0.05, `H1 ${k.c}`)
      }
    }

    flush()
    if (want.has('s3') || want.has('s4') || want.has('s5')) {
      rows.push('', 'S3–S5: Lv | Arms Spellblade a turn, physical | Tome Spellblade, magical | Tome ÷ Arms Spellblade (S3, ±5%) | ' +
        'Tome Summoner, magical | Arms Summoner, physical | Arms ÷ Tome Summoner (S4, ±5%) | Tome Summoner ÷ Arms Spellblade, ' +
        'Arms Summoner ÷ Tome Spellblade (S5, 90–110%) — regular stages; the v18 pair')
      for (const level of levels) {
        const r = await at(level, ['v18', 'v19', 'm19'])
        const sb = uma(r.v19.fight, 'spellblade'), tb = uma(r.m19.fight, 'tomeblade'), su = uma(r.v19.fight, 'summoner'), as = uma(r.m19.fight, 'armsummoner')
        const sb18 = uma(r.v18.fight, 'spellblade'), su18 = uma(r.v18.fight, 'summoner')
        // Splits to a tenth; the Arms Spellblade's also without her Limit Breaks and at v18 (her split's knobs are none of S3's).
        const p1 = (x: number) => `${(100 * x).toFixed(1)}%`
        const own = (u: UmaLog) => u.physical / Math.max(1, u.physical + u.magical)
        rows.push(`Lv${level} | ${f1(perTurn(sb))}, ${p1(physicalShare(sb))} (without Limit Breaks ${p1(own(sb))}; v18 ${p1(physicalShare(sb18))}) | ` +
          `${f1(perTurn(tb))}, ${p1(1 - physicalShare(tb))} | ${pct(perTurn(tb) / perTurn(sb))} | ` +
          `${f1(perTurn(su))}, ${p1(1 - physicalShare(su))} | ${f1(perTurn(as))}, ${p1(physicalShare(as))} | ${pct(perTurn(as) / perTurn(su))} | ` +
          `${pct(perTurn(su) / perTurn(sb))}, ${pct(perTurn(as) / perTurn(tb))} | v18 ${pct(perTurn(su18) / perTurn(sb18))}`)
        // Met: S3's ratio and the Tome Spellblade's split, S4's ratio and both splits, S5 but the Tome Summoner at Lv 10. D249's
        // misses: the Arms Spellblade's split from Lv 30, S5's Lv 10.
        const near = (x: number, band: number) => Math.abs(x - 1) <= band
        const split = (x: number) => Math.abs(x - 0.7) <= 0.05
        met(near(perTurn(tb) / perTurn(sb), 0.05) && split(1 - physicalShare(tb)), `S3 Lv ${level}`)
        met(near(perTurn(as) / perTurn(su), 0.05) && split(1 - physicalShare(su)) && split(physicalShare(as)), `S4 Lv ${level}`)
        met(near(perTurn(as) / perTurn(tb), 0.1) && (level === 10 || near(perTurn(su) / perTurn(sb), 0.1)), `S5 Lv ${level}`)
      }
    }

    if (want.has('s7')) {
      // S7: H81's sustain (the healer's mends and the Barrier absorbed, a fight) with either healer in the balance party.
      const healerOf = (l: FightLog) => Object.values(l.umas).find((u) => rpgIsHealer(u.classId, V19))!
      const sustain = (l: FightLog) => healerOf(l).heal + l.absorbed
      rows.push('', 'S7: stages | Paladin a fight (heal + absorbed) | Cleric | Paladin ÷ Cleric a fight (±10%) | a round | win P / C')
      const line = (label: string, p: FightLog, c: FightLog) => rows.push(`${label} | ${Math.round(sustain(p) / p.fights)} | ${Math.round(sustain(c) / c.fights)} | ` +
        `${pct((sustain(p) / p.fights) / (sustain(c) / c.fights))} | ${pct((sustain(p) / p.rounds) / (sustain(c) / c.rounds))} | ${pct(winRate(p))} / ${pct(winRate(c))}`)
      const ps: FightLog[] = [], cs: FightLog[] = []
      for (const level of [10, 30, 50].filter((l) => levels.includes(l))) {
        const r = await at(level, ['v19', 'p19'])
        const p = all(r.p19), c = all(r.v19)
        ps.push(p); cs.push(c)
        line(`Lv${level}, every stage`, p, c)
        if (level === 50) line('Lv50 bosses', r.p19.boss, r.v19.boss)
      }
      if (ps.length) line('All', merged(ps), merged(cs))
    }

    if (want.has('h2')) {
      rows.push('', 'H2: Lv | party | regular | elite | boss (win, rounds) | gap to its v18 row (worst kind, points; ±3)')
      let worst = 0
      for (const level of levels) {
        const r = await at(level)
        const gap = (a: Record<Kind, FightLog>, b: Record<Kind, FightLog>) => Math.max(...KINDS.filter((k) => a[k].fights).map((k) => Math.abs(winRate(a[k]) - winRate(b[k]))))
        const cv = await run(`${level}:19cv`, level, V19, () => partyOf(CV11_PALADIN, level, V19))
        worst = Math.max(worst, gap(r.v19, r.v18), gap(r.p19, r.p18))
        rows.push(`Lv${level} | v18 balance party | ${cells(r.v18)} | —`, `Lv${level} | v19 balance party | ${cells(r.v19)} | ${f1(100 * gap(r.v19, r.v18))} pts`,
          `Lv${level} | v18 Paladin for the Cleric | ${cells(r.p18)} | —`, `Lv${level} | v19 Paladin for the Cleric | ${cells(r.p19)} | ${f1(100 * gap(r.p19, r.p18))} pts`,
          `Lv${level} | v19 mirror party | ${cells(r.m19)} | ${f1(100 * gap(r.m19, r.v18))} pts`,
          `Lv${level} | v19 CV §11's Paladin party | ${cells(cv)} | ${f1(100 * gap(cv, r.p18))} pts`)
        const m18 = all(r.v18), m19 = all(r.v19)
        rows.push(`Lv${level} by class, a turn v18 → v19 (every stage): ${BALANCE_PARTY.map((c) => `${c} ${Math.round(perTurn(byClass(m18, c)))} → ${Math.round(perTurn(byClass(m19, c)))}`).join(', ')}`)
      }
      rows.push(`Worst gap (either healer): ${f1(100 * worst)} points`)
      met(worst <= 0.03, 'H2')
    }
    flush()
  }, 14_400_000)
})
