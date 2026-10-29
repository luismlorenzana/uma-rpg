// Classes v2's balance (classes-v2.md §9, H60; the hybrids' mirror, H63): engine v15 measured with explicit v15 inputs
// (never the switch), on the shared balance party (`world/balance-party.ts`, `engine: 15`) and the Rift's v2 guided parties
// (`riftParty(front, 15)`). The always-on checks are small, on fixed seeds (the mirror's on one seed of its table's fights).
// The targets' tables: `SIM=1 npx vitest run src/rift/balance-v15.test.ts` (`SIM_SEEDS=4` and `SIM_TARGETS=1,4,7` narrow
// them while tuning); at `SIM_SEEDS=32` targets 1, 2 and 4 assert H63's mirror once printed. The Rift's own tables are
// `SIM_ENGINE=15` on `rift/balance.test.ts`; the campaign's are `SIM_ENGINE=15` on `world/balance.test.ts`.
import { describe, expect, it } from 'vitest'
import { AMULET_TYPES, TALISMAN_TYPES } from '../economy/gear-id'
import type { BattleAction, BattleAlly, BattleCue, BattleInput, BattleState, BattleStep } from '../rpg/battle/types'
import { RPG_V2_CLASSES, type RpgClass } from '../rpg/rules'
import { classPreset } from '../save/presets'
import { BALANCE_KIT_V2, BALANCE_PARTY, balanceMember, balanceStage, type BalanceOptions } from '../world/balance-party'
import { play, type PlayObserver } from '../world/balance-play'
import { regionChapter, worldContinent } from '../world/world'
import { add, cell, duelShields, empty, fight, guardRail, guided, partyOf, pct, planOf, rate, RUNS, seedsOf, type Bucket } from './balance-sim'
import { riftParty, riftShape, riftTuning, RIFT_TUNING } from './fronts'
import { riftSeed, type RiftFightPlan } from './generate'
import { RIFT_FRONTS, type RiftFront } from './state'

const V15 = 15
const VERSION = V15 as BattleInput['version']
const ON_CURVE_V15: BalanceOptions = { gear: true, stars: true, heroes: true, engine: V15 }
const cast = Array.from({ length: 30 }, (_, i) => ({ id: `c${i}`, name: `Rival ${i}` }))

// --- What a fight did, by class -----------------------------------------------------------------------------------------

/** One class's share of fights: damage by channel (Limit Breaks apart), farewells, turns; a healer's mends and Barriers. */
interface Tally {
  physical: number; magical: number; limitPhysical: number; limitMagical: number; farewell: number; turns: number
  heal: number; absorbed: number; fights: number
}
const tally = (): Tally => ({ physical: 0, magical: 0, limitPhysical: 0, limitMagical: 0, farewell: 0, turns: 0, heal: 0, absorbed: 0, fights: 0 })
type Tallies = Partial<Record<RpgClass, Tally>>
const HEALERS: readonly RpgClass[] = ['paladin', 'cleric']
const BARRIER = /Barrier −(\d+)/

/**
 * Reads every action of a fight into `into`, by the acting Uma's class: her hits on foes by channel (a Limit Break's
 * apart; a Summoner's farewell strikes, the hits after her `summon` cue, one per foe standing, counted too), her turns, and
 * a healer's HP restored (her `heal` cues: mends, Regen, drains, revives; not Rally or the breather) and every Barrier her
 * party's hits absorbed (she is its one source in these parties).
 */
function tallyOf(allies: readonly BattleAlly[], into: Tallies): PlayObserver {
  const classOf = new Map(allies.map((a) => [a.id, a.classId]))
  const healer = allies.find((a) => HEALERS.includes(a.classId))
  for (const a of allies) into[a.classId] ??= tally()
  return (before: BattleState, action: BattleAction, step: BattleStep) => {
    // A fight's first action: one more fight for each class of the party.
    if (before.round === 1 && !before.wave && before.acted.length === 0) for (const c of new Set(allies.map((a) => a.classId))) into[c]!.fights++
    const t = into[classOf.get(action.actorId)!]!
    t.turns++
    const foes = new Set(before.units.filter((u) => u.side === 'enemy').map((u) => u.id))
    let farewells = 0, foePhase = false
    for (const c of step.cues as BattleCue[]) {
      if (c.kind === 'move') foePhase = true
      if (c.kind === 'heal' && healer && c.actorId === healer.id && c.label !== 'Rally' && c.label !== 'Breather') into[healer.classId]!.heal += c.amount ?? 0
      if (c.kind === 'hit' && healer && classOf.has(c.targetId) && c.label) {
        const m = BARRIER.exec(c.label)
        if (m) into[healer.classId]!.absorbed += Number(m[1])
      }
      if (c.kind === 'summon' && c.actorId === action.actorId) farewells = before.units.filter((u) => u.side === 'enemy' && u.hp > 0).length
      if (foePhase || c.kind !== 'hit' || c.actorId !== action.actorId || !foes.has(c.targetId) || c.channel === 'status') continue
      if (farewells > 0) { t.farewell += c.amount; farewells-- }
      if (action.kind === 'limit') t[c.channel === 'physical' ? 'limitPhysical' : 'limitMagical'] += c.amount
      else t[c.channel] += c.amount
    }
  }
}
const damage = (t: Tally) => t.physical + t.magical + t.limitPhysical + t.limitMagical
/** Physical share of her whole damage, and of her damage without Limit Breaks. */
const physicalShare = (t: Tally) => ({ all: (t.physical + t.limitPhysical) / Math.max(1, damage(t)), skills: t.physical / Math.max(1, t.physical + t.magical) })
const perTurn = (t: Tally | undefined) => (t && t.turns ? damage(t) / t.turns : 0)
const mergeTallies = (list: readonly (Tally | undefined)[]): Tally => list.reduce<Tally>((m, t) => {
  if (!t) return m
  for (const k of Object.keys(m) as (keyof Tally)[]) m[k] += t[k]
  return m
}, tally())

// --- The world's stages -------------------------------------------------------------------------------------------------

type Kind = 'fight' | 'sub-boss' | 'boss'
/** A Tier 1 level's stages of some kinds across its continent's regions (as `world/balance.test.ts`'s `simulate`). */
function worldStages(level: number, kinds: readonly Kind[]) {
  const regions = worldContinent({ name: 'Sim', order: Math.ceil(level / 10) }).regions.filter((r) => r.level <= level && level <= r.levelTop)
  // v15's foes, named (the live chapters are v16's since H72).
  return regions.flatMap((r) => regionChapter(r, cast, V15).nodes.filter((n) => kinds.includes(n.kind as Kind) && n.level === level))
}
/** The balance party on v15 at a level, a class swapped for another in her place (the Paladin for the Cleric). */
const worldParty = (level: number, swap: Partial<Record<RpgClass, RpgClass>> = {}): BattleAlly[] =>
  BALANCE_PARTY.map((c, i) => balanceMember(swap[c] ?? c, i, level, ON_CURVE_V15))
/** Plays the world's stages at a level, `seeds` times each. */
function playWorld(level: number, kinds: readonly Kind[], allies: BattleAlly[], seeds: number, observe?: PlayObserver): Bucket {
  const b = empty()
  worldStages(level, kinds).forEach((node, i) => {
    for (let s = 0; s < seeds; s++) add(b, play(balanceStage(node, 1000 + i + 100 * s, allies, VERSION), observe))
  })
  return b
}
/** Plays a front's stages with a party, every run and seed. */
function playFront(front: RiftFront, stages: readonly number[], allies: BattleAlly[], seeds: readonly number[], observe?: PlayObserver): Bucket {
  const b = empty()
  for (const stage of stages) for (const runId of RUNS) {
    const plan = planOf(runId, { kind: 'front', front, stage }, V15)
    for (const seed of seeds) add(b, fight(plan, allies, seed, V15, observe))
  }
  return b
}
const range = (a: number, z: number): number[] => Array.from({ length: z - a + 1 }, (_, i) => a + i)
const f1 = (x: number) => x.toFixed(1)

// --- H63: the hybrids' mirror -----------------------------------------------------------------------------------------------

/** The Summoner's damage a turn ÷ the Spell Blade's, in one tally of fights both played. */
const mirrorOf = (t: Tallies): number => perTurn(t.summoner) / perTurn(t.spellblade)
/** The owner's mirror (classes-v2 §3.2): level within ±5% on the world's regular stages, each 70/30 her way ± 5. */
const MIRROR = 0.05
const SPLIT = 0.05
/** By context, both in the Horde's party: ±15% on one foe (the Duel) and on the Horde; the ward tilts Iron to the Spell
 * Blade and Arcane to the Summoner, so those two may reach ±25%, none past it. */
const CONTEXT: Readonly<Record<RiftFront, number>> = { duel: 0.15, horde: 0.15, iron: 0.25, arcane: 0.25 }

// --- Target 6: the Spell Blade breaks, the Brawler hits the Broken ----------------------------------------------------------

/** Five of one class against a stage's captain (the first foe): rounds to her first Break (the fight's last round when she
 * never Breaks), and damage an act on her from the Break until she falls. */
function breakRun(plan: RiftFightPlan, allies: BattleAlly[], seed: number): { breakRound: number | null; rounds: number; after: number; acts: number } {
  const captain = plan.enemies[0]!.id
  let breakRound: number | null = null, after = 0, acts = 0
  const r = play({ version: VERSION, seed, allies, enemies: plan.enemies, ...(plan.waves ? { waves: plan.waves } : {}) }, (before, action, step) => {
    const foe = before.units.find((u) => u.id === captain)
    if (breakRound !== null && foe && foe.hp > 0) acts++
    for (const c of step.cues) {
      if (c.kind === 'break' && c.targetId === captain && breakRound === null) breakRound = before.round
      if (breakRound !== null && c.kind === 'hit' && c.targetId === captain && c.actorId === action.actorId && c.channel !== 'status') after += c.amount
    }
  })
  return { breakRound, rounds: r.rounds, after, acts }
}

// --- Target 7: areas over a wave ------------------------------------------------------------------------------------------

/** Five of one class through a Horde fight: damage an act while three or more foes stand, and rounds to clear the first wave. */
function waveRun(plan: RiftFightPlan, allies: BattleAlly[], seed: number): { dealt: number; acts: number; firstWave: number | null } {
  let dealt = 0, acts = 0, firstWave: number | null = null
  play({ version: VERSION, seed, allies, enemies: plan.enemies, ...(plan.waves ? { waves: plan.waves } : {}) }, (before, action, step) => {
    const standing = before.units.filter((u) => u.side === 'enemy' && u.hp > 0).length
    let foePhase = false
    if (standing >= 3) acts++
    for (const c of step.cues) {
      if (c.kind === 'move') foePhase = true
      if (c.kind === 'wave' && firstWave === null) firstWave = before.round
      if (standing >= 3 && !foePhase && c.kind === 'hit' && c.actorId === action.actorId && c.channel !== 'status' && before.units.some((u) => u.id === c.targetId && u.side === 'enemy')) dealt += c.amount
    }
  })
  return { dealt, acts, firstWave }
}

// --- The checks ---------------------------------------------------------------------------------------------------------

describe('classes v2\'s balance on engine v15 (H60)', () => {
  it('builds the v2 kit from the classes\' standard presets', () => {
    for (const c of RPG_V2_CLASSES) {
      const preset = classPreset(c, V15)
      expect(BALANCE_KIT_V2[c].accessories, c).toEqual([preset.orb, preset.support])
      expect(BALANCE_KIT_V2[c].magical.every((m) => m === (preset.armor === 'magical')), c).toBe(true)
    }
  })

  it('keeps v14\'s Rift as it was and gives v15 the same faces, ranks and counts (the picker\'s allocation holds)', () => {
    expect(riftTuning(14)).toBe(RIFT_TUNING)
    const skeleton = (engine: number) => RIFT_FRONTS.flatMap((front) => range(1, 12).map((stage) =>
      riftShape(front, stage, engine).map((wave) => wave.map((s) => `${s.face}:${s.rank}:${s.role}:${s.pair ?? ''}`))))
    expect(skeleton(V15)).toEqual(skeleton(14))
  })

  it('lets Iron\'s v2 guided party win Iron\'s stage 1', () => {
    expect(riftParty('iron', V15)).toEqual(['brawler', 'brawler', 'spellblade', 'spellblade', 'paladin'])
    const plan = planOf('t1-r1', { kind: 'front', front: 'iron', stage: 1 }, V15)
    expect(fight(plan, guided('iron', V15), riftSeed('rift:t1:1'), V15).won).toBe(true)
  })

  it('has Arcane\'s v2 guided party lose Iron\'s champion', () => {
    const plan = planOf('t1-r1', { kind: 'front', front: 'iron', stage: 12 }, V15)
    expect(fight(plan, guided('arcane', V15), riftSeed('rift:t1:1'), V15).won).toBe(false)
  })

  it('keeps all six classes\' best single act below the Duel\'s lowest v15 shield (the guard rail)', () => {
    const lowest = Math.min(...duelShields(V15))
    for (const classId of RPG_V2_CLASSES) {
      const rail = guardRail(classId, V15)
      expect(rail.own.chips, `${classId}: ${rail.own.act}`).toBeLessThan(lowest)
      expect(rail.limit.chips, `${classId}: ${rail.limit.act}`).toBeLessThan(lowest)
    }
  }, 30_000)

  // H63, the hybrids' mirror (classes-v2 §3.2, §9): the owner's rule, on one seed of the SIM table's fights.
  it('keeps the hybrids a mirror on the world\'s regular stages: level damage a turn, each 70/30 her way (H63)', () => {
    const levels = [30, 50].map((level) => {
      const into: Tallies = {}
      const allies = worldParty(level)
      playWorld(level, ['fight'], allies, 1, tallyOf(allies, into))
      return into
    })
    levels.forEach((t, k) => expect(Math.abs(mirrorOf(t) - 1), `Lv ${k ? 50 : 30}`).toBeLessThanOrEqual(MIRROR))
    const [blade, summoner] = (['spellblade', 'summoner'] as const).map((c) => mergeTallies(levels.map((t) => t[c])))
    expect(Math.abs(physicalShare(blade!).all - 0.7)).toBeLessThanOrEqual(SPLIT)
    expect(Math.abs(1 - physicalShare(summoner!).all - 0.7)).toBeLessThanOrEqual(SPLIT)
  }, 30_000)

  it('keeps the Summoner near the Spell Blade by context: one foe and the Horde, and the warded fronts (H63)', () => {
    const both = guided('horde', V15)
    for (const front of RIFT_FRONTS) {
      const into: Tallies = {}
      playFront(front, range(1, 11), both, seedsOf(1), tallyOf(both, into))
      expect(Math.abs(mirrorOf(into) - 1), front).toBeLessThanOrEqual(CONTEXT[front])
    }
  }, 60_000)

  it.skipIf(!process.env.SIM)('prints classes v2\'s targets (§9)', async () => {
    const tick = () => new Promise((resolve) => setTimeout(resolve, 0))
    const want = new Set((process.env.SIM_TARGETS ?? '1,3,4,5,6,7,10,11').split(',').map(Number))
    const n = Number(process.env.SIM_SEEDS ?? 8)
    const seeds = seedsOf(n)
    const worldSeeds = Math.max(1, Math.round(n / 2))
    const rows: string[] = [`engine v15; fronts ${RUNS.length} runs × ${seeds.length} seeds a stage, world stages × ${worldSeeds} seeds; on curve, first try on Auto`]

    // What the table asserts once it has printed (H63's targets), at the delivery's `SIM_SEEDS=32` or more: fewer seeds are
    // for tuning, and the world's few stages move a point or two.
    const checks: (() => void)[] = []

    if (want.has(1) || want.has(2) || want.has(4)) {
      // H63's mirror (classes-v2 §3.2): 1, damage a turn level within ±5% on the world's regular stages at Lv 30 and 50;
      // 2, each 70/30 her way ± 5 over all her damage, farewells included. 4 (by context, H63's 3 and 4): both in one
      // party, the Horde's guided party on every front's stages 1–11, and the balance party on all of the world's Lv 50.
      rows.push('', 'Targets 1–2 (H63\'s 1–2): hybrids\' damage, world regular stages | physical (all) | physical (skills) | farewells | damage a turn')
      const world: Record<number, Tallies> = {}
      for (const level of [30, 50]) {
        const into: Tallies = {}
        const allies = worldParty(level)
        playWorld(level, ['fight'], allies, worldSeeds, tallyOf(allies, into))
        world[level] = into
        for (const c of ['spellblade', 'summoner'] as const) {
          const t = into[c]!, s = physicalShare(t)
          rows.push(`Lv ${level} ${c} | ${pct(s.all)} | ${pct(s.skills)} | ${pct(t.farewell / Math.max(1, damage(t)))} | ${f1(perTurn(t))}`)
        }
        rows.push(`Lv ${level} Summoner ÷ Spell Blade | | | | ${pct(mirrorOf(into))}`)
        checks.push(() => expect(Math.abs(mirrorOf(into) - 1), `the mirror at Lv ${level}`).toBeLessThanOrEqual(MIRROR))
        await tick()
      }
      const both: Tallies = { spellblade: mergeTallies([world[30]!.spellblade, world[50]!.spellblade]), summoner: mergeTallies([world[30]!.summoner, world[50]!.summoner]) }
      const blade = physicalShare(both.spellblade!).all, summoner = 1 - physicalShare(both.summoner!).all
      rows.push(`Lv 30 + 50 | Spell Blade ${pct(blade)} physical; Summoner ${pct(summoner)} magical`)
      checks.push(() => expect(Math.abs(blade - 0.7), 'the Spell Blade\'s split').toBeLessThanOrEqual(SPLIT))
      checks.push(() => expect(Math.abs(summoner - 0.7), 'the Summoner\'s split').toBeLessThanOrEqual(SPLIT))
      if (want.has(4)) {
        // Like for like: both in one party on the same fights, the Horde's guided party (two of each) on every front's
        // stages 1–11, and the balance party on the world's Lv 50 stages.
        rows.push('', 'Target 4 (H63\'s 3–4): damage a turn, both in one party | Spell Blade | Summoner | Summoner ÷ Spell Blade')
        const fronts: Record<RiftFront, Tallies> = { iron: {}, arcane: {}, duel: {}, horde: {} }
        const both = guided('horde', V15)
        for (const front of RIFT_FRONTS) {
          playFront(front, range(1, 11), both, seeds, tallyOf(both, fronts[front]))
          checks.push(() => expect(Math.abs(mirrorOf(fronts[front]) - 1), front).toBeLessThanOrEqual(CONTEXT[front]))
          await tick()
        }
        const w50: Tallies = {}
        const party50 = worldParty(50)
        playWorld(50, ['fight', 'sub-boss', 'boss'], party50, worldSeeds, tallyOf(party50, w50))
        const line = (label: string, sb: Tally | undefined, su: Tally | undefined) =>
          rows.push(`${label} | ${f1(perTurn(sb))} | ${f1(perTurn(su))} | ${sb && su ? pct(perTurn(su) / perTurn(sb)) : '—'}`)
        for (const front of RIFT_FRONTS) line(`${front} 1–11, the Horde's party`, fronts[front].spellblade, fronts[front].summoner)
        line('World Lv 50, every stage, the balance party', w50.spellblade, w50.summoner)
        const all = [...RIFT_FRONTS.map((f) => fronts[f]), w50]
        line('All of them', mergeTallies(all.map((t) => t.spellblade)), mergeTallies(all.map((t) => t.summoner)))
        rows.push(`World Lv 50's damage a turn: ${RPG_V2_CLASSES.filter((c) => w50[c]).map((c) => `${c} ${f1(perTurn(w50[c]))}`).join(', ')}`)
        rows.push(`Splits: Spell Blade ${RIFT_FRONTS.map((f) => `${f} ${pct(physicalShare(fronts[f].spellblade!).all)}`).join(', ')} physical; ` +
          `Summoner ${RIFT_FRONTS.map((f) => `${f} ${pct(1 - physicalShare(fronts[f].summoner!).all)}`).join(', ')} magical`)
        checks.push(() => expect(Math.abs(mirrorOf(w50) - 1), 'the world\'s Lv 50, every stage').toBeLessThanOrEqual(MIRROR))
      }
    }

    if (want.has(3)) {
      // 3: the same party with each healer: HP restored plus Barrier absorbed a fight.
      rows.push('', 'Target 3: a fight\'s healing + Barrier absorbed | Paladin | Cleric | Paladin ÷ Cleric | a round\'s, P ÷ C | win P / C')
      const sums = { paladin: tally(), cleric: tally() }
      const rounds = { paladin: 0, cleric: 0 }
      const line = (label: string, run: (healer: 'paladin' | 'cleric', into: Tallies) => Bucket) => {
        const got = (['paladin', 'cleric'] as const).map((h) => { const into: Tallies = {}; const b = run(h, into); return { t: into[h]!, b } })
        got.forEach((g, k) => { const s = sums[k ? 'cleric' : 'paladin']; for (const key of Object.keys(s) as (keyof Tally)[]) s[key] += g.t[key]; rounds[k ? 'cleric' : 'paladin'] += g.b.rounds })
        const [p, c] = got.map((g) => (g.t.heal + g.t.absorbed) / g.t.fights)
        const [pr, cr] = got.map((g) => (g.t.heal + g.t.absorbed) / g.b.rounds)
        rows.push(`${label} | ${Math.round(p!)} (${Math.round(got[0]!.t.heal / got[0]!.t.fights)} + ${Math.round(got[0]!.t.absorbed / got[0]!.t.fights)}) | ` +
          `${Math.round(c!)} (${Math.round(got[1]!.t.heal / got[1]!.t.fights)} + ${Math.round(got[1]!.t.absorbed / got[1]!.t.fights)}) | ${pct(p! / c!)} | ${pct(pr! / cr!)} | ${pct(rate(got[0]!.b))} / ${pct(rate(got[1]!.b))}`)
      }
      line('World Lv 50 bosses, balance party', (h, into) => { const a = worldParty(50, { cleric: h }); return playWorld(50, ['boss'], a, worldSeeds, tallyOf(a, into)) })
      await tick()
      for (const front of RIFT_FRONTS) {
        for (const stage of [8, 12]) {
          line(`${front} stage ${stage}`, (h, into) => {
            const a = partyOf(riftParty(front, V15).map((c) => (HEALERS.includes(c) ? h : c)), V15)
            return playFront(front, [stage], a, seeds, tallyOf(a, into))
          })
          await tick()
        }
      }
      const [p, c] = (['paladin', 'cleric'] as const).map((h) => (sums[h].heal + sums[h].absorbed) / sums[h].fights)
      const [pr, cr] = (['paladin', 'cleric'] as const).map((h) => (sums[h].heal + sums[h].absorbed) / rounds[h])
      rows.push(`All | ${Math.round(p!)} | ${Math.round(c!)} | ${pct(p! / c!)} | ${pct(pr! / cr!)}`)
    }

    if (want.has(5)) {
      // 5: one healer through a front's bosses: won fights where an Uma fell twice.
      rows.push('', 'Target 5: guided party | stage 6 | stage 8 | champion (won; won with an Uma down twice)')
      for (const front of RIFT_FRONTS) {
        const cells = [6, 8, 12].map((stage) => {
          let won = 0, twice = 0, all = 0
          const allies = guided(front, V15)
          const ids = new Set(allies.map((a) => a.id))
          for (const runId of RUNS) {
            const plan = planOf(runId, { kind: 'front', front, stage }, V15)
            for (const seed of seeds) {
              const down: Record<string, number> = {}
              const r = fight(plan, allies, seed, V15, (_, __, step) => { for (const c of step.cues) if (c.kind === 'ko' && ids.has(c.targetId)) down[c.targetId] = (down[c.targetId] ?? 0) + 1 })
              all++
              if (r.won) { won++; if (Object.values(down).some((k) => k >= 2)) twice++ }
            }
          }
          return `${pct(won / all)}; ${twice} of ${won}`
        })
        rows.push(`${front} (${riftParty(front, V15).at(-1)}) | ${cells.join(' | ')}`)
        await tick()
      }
    }

    if (want.has(6)) {
      // 6: five Spell Blades, Brawlers or Summoners against Iron's stage 1–4 captain, weak to a Spell Blade Arm (the Summoner
      // carries two of the three; H63: the Spell Blade still Breaks sooner than her mirror).
      rows.push('', 'Target 6: five of a class on Iron 1–4, captain weak to a Spell Blade Arm | fights (Breaks) | rounds to Break (none: the fight\'s last) | damage an act after it')
      const shared = new Set(['greatsword', 'lance', 'katana'])
      for (const c of ['spellblade', 'brawler', 'summoner'] as const) {
        const allies = partyOf([c, c, c, c, c], V15)
        let fights = 0, rounds = 0, broke = 0, after = 0, acts = 0
        for (const stage of range(1, 4)) for (const runId of RUNS) {
          const plan = planOf(runId, { kind: 'front', front: 'iron', stage }, V15)
          if (!plan.enemies[0]!.weaknesses.weapons.some((w) => shared.has(w))) continue
          for (const seed of seeds) {
            const r = breakRun(plan, allies, seed)
            fights++
            rounds += r.breakRound ?? r.rounds
            if (r.breakRound !== null) { broke++; after += r.after; acts += r.acts }
          }
        }
        rows.push(`${c} | ${fights} (${broke}) | ${f1(rounds / Math.max(1, fights))} | ${f1(after / Math.max(1, acts))}`)
        await tick()
      }
    }

    if (want.has(7)) {
      // 7: five Summoners or five Mages through the Horde's waves of 4–6. Retired as a target by the owner's mirror (H63),
      // printed for the record.
      rows.push('', 'Target 7 (retired, H63): five of a class on Horde 1–11 | damage an act while 3+ foes stand | rounds to clear wave 1')
      for (const c of ['summoner', 'mage'] as const) {
        const allies = partyOf([c, c, c, c, c], V15)
        let dealt = 0, acts = 0, first = 0, cleared = 0
        for (const stage of range(1, 11)) for (const runId of RUNS) {
          const plan = planOf(runId, { kind: 'front', front: 'horde', stage }, V15)
          for (const seed of seeds) {
            const r = waveRun(plan, allies, seed)
            dealt += r.dealt; acts += r.acts
            if (r.firstWave !== null) { first += r.firstWave; cleared++ }
          }
        }
        rows.push(`${c} | ${f1(dealt / Math.max(1, acts))} | ${f1(first / Math.max(1, cleared))} (${cleared} cleared)`)
        await tick()
      }
    }

    if (want.has(10)) {
      rows.push('', `Target 10: class | best own act | best Limit Break | Duel shields ${duelShields(V15).join(', ')}`)
      for (const classId of RPG_V2_CLASSES) {
        const rail = guardRail(classId, V15)
        rows.push(`${classId} | ${rail.own.chips}: ${rail.own.act} | ${rail.limit.chips}: ${rail.limit.act}`)
      }
    }

    if (want.has(11)) {
      // 11: each support at G10 in every guided member's Support slot, on each front's stage 8 and champion: its gain in
      // win rate over an empty slot, overall and on its best front (§6.3: each a real choice for some party), against the
      // best's.
      const supports = [null, ...TALISMAN_TYPES, ...AMULET_TYPES]
      rows.push('', `Target 11: Support slot | ${RIFT_FRONTS.map((f) => `${f} 8 / 12`).join(' | ')} | win rate | gain | best front's gain | of the best`)
      const results: { support: string; cells: string[]; rate: number; fronts: number[] }[] = []
      for (const support of supports) {
        let wins = 0, all = 0
        const fronts: number[] = []
        const cells = RIFT_FRONTS.map((front) => {
          const allies = guided(front, V15, undefined, { support })
          const [eight, champ] = [8, 12].map((stage) => playFront(front, [stage], allies, seeds))
          wins += eight!.wins + champ!.wins; all += eight!.n + champ!.n
          fronts.push((eight!.wins + champ!.wins) / (eight!.n + champ!.n))
          return `${pct(rate(eight!))} / ${pct(rate(champ!))}`
        })
        results.push({ support: support ?? 'none', cells, rate: wins / all, fronts })
        await tick()
      }
      const none = results[0]!
      const frontGain = (r: (typeof results)[number]) => Math.max(...r.fronts.map((x, k) => x - none.fronts[k]!))
      const bestGain = Math.max(...results.slice(1).map(frontGain))
      for (const r of results) {
        rows.push(`${r.support} | ${r.cells.join(' | ')} | ${pct(r.rate)} | ${f1(100 * (r.rate - none.rate))} | ` +
          `${r === none ? '—' : `${f1(100 * frontGain(r))} (${RIFT_FRONTS[r.fronts.findIndex((x, k) => x - none.fronts[k]! === frontGain(r))]})`} | ` +
          `${r === none ? '—' : pct(frontGain(r) / bestGain)}`)
      }
    }
    console.log(rows.join('\n'))
    if (n >= 32) for (const check of checks) check()
  }, 3_600_000)
})
