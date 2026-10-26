// R2's balance in the Rift and the mirror by context (the Tier rework's Tier 1 economy, engine v17, H81; README §9.5 items 2
// and 3's fronts, rift.md §11): engine v17 measured with explicit v17 inputs, never the switch, on the fronts' guided builds
// (`riftGuidedBuild(front, 17)`, built by `guided(front, 17)`: each member graded on curve in WP25's form, no MP accessory).
// The always-on checks are small, on fixed seeds; the targets' tables: `SIM=1 npx vitest run src/rift/balance-v17.test.ts`
// (`SIM_SEEDS=32` for the delivery). H51's tables (the fronts, the wrong parties, the Convergence, Echoes) play v17 with
// `SIM_ENGINE=17` on `rift/balance.test.ts`.
import { describe, expect, it } from 'vitest'
import { createBattle } from '../rpg/battle/engine'
import type { BattleAlly, BattleInput } from '../rpg/battle/types'
import { RPG_ALL_CLASSES, rpgIsHealer, validRpgWeapons, type RpgClass } from '../rpg/rules'
import { BALANCE_PARTY, balanceMember, balanceStage, type BalanceOptions } from '../world/balance-party'
import { play } from '../world/balance-play'
import { byClass, fightLog, logFight, perTurn, physicalShare, type FightLog } from '../world/balance-measure'
import { regionChapter, worldContinent } from '../world/world'
import { duelShields, fight, guardRail, guided, ON_CURVE, pct, planOf, RUNS, seedsOf } from './balance-sim'
import { riftGuidedBuild, riftShape } from './fronts'
import { riftBattleInput, riftSeed } from './generate'
import { RIFT_FRONTS, type RiftFront } from './state'

const V17 = 17
const VERSION = V17 as BattleInput['version']
const cast = Array.from({ length: 30 }, (_, i) => ({ id: `c${i}`, name: `Rival ${i}` }))
const range = (a: number, z: number): number[] => Array.from({ length: z - a + 1 }, (_, i) => a + i)
const f1 = (x: number) => x.toFixed(1)

/** Plays a front's stages with a party, every run and seed, into one log. */
function playFront(front: RiftFront, stages: readonly number[], allies: BattleAlly[], seeds: readonly number[], into: FightLog = fightLog()): FightLog {
  for (const stage of stages) for (const runId of RUNS) {
    const plan = planOf(runId, { kind: 'front', front, stage }, V17)
    for (const seed of seeds) {
      const { observe, done } = logFight(allies, into)
      done(play(riftBattleInput(plan, allies, seed, VERSION), observe))
    }
  }
  return into
}
/** The world's Lv 50 boss stages (v17 foes) with a party, `seeds` times each. */
function playWorldBosses(allies: BattleAlly[], seeds: number, into: FightLog = fightLog()): FightLog {
  const nodes = worldContinent({ name: 'Sim', order: 5 }).regions.filter((r) => r.level <= 50 && 50 <= r.levelTop)
    .flatMap((r) => regionChapter(r, cast, V17).nodes.filter((n) => n.kind === 'boss' && n.level === 50))
  nodes.forEach((node, i) => {
    for (let s = 0; s < seeds; s++) {
      const { observe, done } = logFight(allies, into)
      done(play(balanceStage(node, 1000 + i + 100 * s, allies, VERSION), observe))
    }
  })
  return into
}
/** A guided build with its healer swapped for another (her defaults). */
const withHealer = (front: RiftFront, healer: RpgClass): BattleAlly[] =>
  riftGuidedBuild(front, V17).map((m, i) => balanceMember(rpgIsHealer(m.classId) ? healer : m.classId, i, 50,
    { ...ON_CURVE, engine: V17, ...(rpgIsHealer(m.classId) ? {} : { weapons: m.weapons }) }))
const healerOf = (l: FightLog) => Object.entries(l.umas).find(([, u]) => rpgIsHealer(u.classId))!
const sustain = (l: FightLog) => healerOf(l)[1].heal + l.absorbed

describe('R2\'s balance in the Rift on engine v17 (H81)', () => {
  it('builds every v17 guided party legally: three weapons by channel, one healer, a fight the engine accepts', () => {
    for (const front of RIFT_FRONTS) {
      const allies = guided(front, V17)
      expect(allies.map((a) => a.classId)).toEqual(riftGuidedBuild(front, V17).map((m) => m.classId))
      allies.forEach((a, i) => {
        expect(a.weapons).toEqual(riftGuidedBuild(front, V17)[i]!.weapons)
        expect(validRpgWeapons(a.classId, a.weapons, V17), `${front} ${a.classId}`).toBe(true)
        expect(a.tree).toEqual([])
      })
      expect(allies.filter((a) => rpgIsHealer(a.classId))).toHaveLength(1)
      const plan = planOf('t1-r1', { kind: 'front', front, stage: 1 }, V17)
      expect(() => createBattle(riftBattleInput(plan, allies, 7, VERSION))).not.toThrow()
    }
  })

  it('keeps v17\'s faces, ranks and counts v15\'s (the picker\'s allocation holds)', () => {
    const skeleton = (engine: number) => RIFT_FRONTS.flatMap((front) => range(1, 12).map((stage) =>
      riftShape(front, stage, engine).map((wave) => wave.map((s) => `${s.face}:${s.rank}:${s.role}:${s.pair ?? ''}`))))
    expect(skeleton(V17)).toEqual(skeleton(15))
  })

  it('lets Iron\'s v17 guided party win Iron\'s stage 1', () => {
    const plan = planOf('t1-r1', { kind: 'front', front: 'iron', stage: 1 }, V17)
    expect(fight(plan, guided('iron', V17), riftSeed('rift:t1:1'), V17).won).toBe(true)
  })

  it('has Arcane\'s v17 guided party lose Iron\'s champion', () => {
    const plan = planOf('t1-r1', { kind: 'front', front: 'iron', stage: 12 }, V17)
    expect(fight(plan, guided('arcane', V17), riftSeed('rift:t1:1'), V17).won).toBe(false)
  })

  it('keeps all six classes\' best single act at Rank 5, Pierce included, below the Duel\'s lowest v17 shield (the guard rail)', () => {
    const lowest = Math.min(...duelShields(V17))
    for (const classId of RPG_ALL_CLASSES) {
      const rail = guardRail(classId, V17)
      expect(rail.own.chips, `${classId}: ${rail.own.act}`).toBeLessThan(lowest)
      expect(rail.limit.chips, `${classId}: ${rail.limit.act}`).toBeLessThan(lowest)
    }
  }, 60_000)

  it.skipIf(!process.env.SIM)('prints R2\'s targets in the Rift: the mirror by context, the healers, the guard rail', async () => {
    const tick = () => new Promise((resolve) => setTimeout(resolve, 0))
    const want = new Set((process.env.SIM_TARGETS ?? '2,3').split(',').map(Number))
    const n = Number(process.env.SIM_SEEDS ?? 8)
    const seeds = seedsOf(n)
    const worldSeeds = Math.max(1, Math.round(n / 2))
    const rows: string[] = [`engine v17; fronts ${RUNS.length} runs × ${seeds.length} seeds a stage, world stages × ${worldSeeds}; on curve, first try on Auto`]
    if (want.has(2)) {
      // The mirror by context (H63's measure): both hybrids in the Horde's guided build on every front's stages 1–11.
      rows.push('', 'Target 2, by context: front | Spell Blade a turn, physical | Summoner a turn, magical | Summoner ÷ Spell Blade')
      const both = guided('horde', V17)
      for (const front of RIFT_FRONTS) {
        const l = playFront(front, range(1, 11), both, seeds)
        const sb = byClass(l, 'spellblade')!, su = byClass(l, 'summoner')!
        rows.push(`${front} 1–11 | ${f1(perTurn(sb))}, ${pct(physicalShare(sb))} | ${f1(perTurn(su))}, ${pct(1 - physicalShare(su))} | ${pct(perTurn(su) / perTurn(sb))}`)
        await tick()
      }
      // Paladin ÷ Cleric: a fight's healing plus Barrier absorbed, the same party with each healer.
      rows.push('', 'Target 2, the healers: fights | Paladin a fight (heal + absorbed) | Cleric | Paladin ÷ Cleric a fight | a round | win P / C')
      const sums = { paladin: { s: 0, f: 0, r: 0 }, cleric: { s: 0, f: 0, r: 0 } }
      const line = (label: string, run: (healer: 'paladin' | 'cleric') => FightLog) => {
        const [p, c] = (['paladin', 'cleric'] as const).map((h) => {
          const l = run(h)
          sums[h].s += sustain(l); sums[h].f += l.fights; sums[h].r += l.rounds
          return l
        })
        const a = (l: FightLog) => sustain(l) / l.fights
        rows.push(`${label} | ${Math.round(a(p!))} (${Math.round(healerOf(p!)[1].heal / p!.fights)} + ${Math.round(p!.absorbed / p!.fights)}) | ` +
          `${Math.round(a(c!))} (${Math.round(healerOf(c!)[1].heal / c!.fights)} + ${Math.round(c!.absorbed / c!.fights)}) | ${pct(a(p!) / a(c!))} | ` +
          `${pct((sustain(p!) / p!.rounds) / (sustain(c!) / c!.rounds))} | ${pct(p!.wins / p!.fights)} / ${pct(c!.wins / c!.fights)}`)
      }
      line('World Lv 50 bosses, the balance party', (h) => playWorldBosses(BALANCE_PARTY.map((c, i) => balanceMember(c === 'cleric' ? h : c, i, 50,
        { ...ON_CURVE, engine: V17 } as BalanceOptions)), worldSeeds))
      await tick()
      for (const front of RIFT_FRONTS) for (const stage of [8, 12]) {
        line(`${front} stage ${stage}`, (h) => playFront(front, [stage], withHealer(front, h), seeds))
        await tick()
      }
      rows.push(`All | ${Math.round(sums.paladin.s / sums.paladin.f)} | ${Math.round(sums.cleric.s / sums.cleric.f)} | ` +
        `${pct((sums.paladin.s / sums.paladin.f) / (sums.cleric.s / sums.cleric.f))} | ${pct((sums.paladin.s / sums.paladin.r) / (sums.cleric.s / sums.cleric.r))} | —`)
    }
    if (want.has(3)) {
      rows.push('', `Target 3, the guard rail: class | best own act (Rank 5, either line) | best Limit Break | Duel shields ${duelShields(V17).join(', ')}`)
      for (const classId of RPG_ALL_CLASSES) {
        const rail = guardRail(classId, V17)
        rows.push(`${classId} | ${rail.own.chips}: ${rail.own.act} | ${rail.limit.chips}: ${rail.limit.act}`)
      }
    }
    console.log(rows.join('\n'))
  }, 3_600_000)
})
