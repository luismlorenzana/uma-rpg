// Classes v3's and Halls v2's balance in the Rift (H131; classes-v3.md §10.1, §12's S8 and S9; halls-v2.md HV15, HV-D):
// engine v19 measured with explicit inputs, never the switch, on H126's guided builds (`riftGuidedBuild(front, 19)`, built by
// `guided(front, 19)`) against v18's (`guided(front, 18)`), the same runs and seeds; the Duel's guard rail for all thirteen
// classes and Halls v2's twenty (`guardRail(c, 19)`). The always-on checks are small, on fixed seeds; the tables:
// `SIM=1 npx vitest run src/rift/balance-v19.test.ts` (`SIM_SEEDS=32` for the delivery; `SIM_TARGETS=s8,rail,s9` and
// `SIM_FRONTS=iron,duel` narrow them). H51's tables play v19 with `SIM_ENGINE=19` on `rift/balance.test.ts`.
import { describe, expect, it } from 'vitest'
import { createBattle } from '../rpg/battle/engine'
import type { BattleInput } from '../rpg/battle/types'
import { HERO_LIMIT_MAX_HITS } from '../rpg/heroes'
import { rpgClasses, rpgIsHealer, rpgIsTier0, RPG_TIER0_MAX_RANK, validRpgWeapons } from '../rpg/rules'
import { add, cell, duelShields, empty, fight, frontStages, GROUPS, guardRail, guided, merge, planOf, rate, RUNS, seedsOf } from './balance-sim'
import { riftGuidedBuild, riftShape } from './fronts'
import { riftBattleInput, riftSeed } from './generate'
import { ECHO_LEVELS, RIFT_FRONTS, type RiftFront } from './state'

const V18 = 18, V19 = 19
const VERSION = V19 as BattleInput['version']
const range = (a: number, z: number): number[] => Array.from({ length: z - a + 1 }, (_, i) => a + i)

describe('Classes v3 and Halls v2 in the Rift on engine v19 (H131)', () => {
  it('builds every v19 guided party legally: H126\'s weapons, three by her slots, one healer, a fight the engine accepts', () => {
    for (const front of RIFT_FRONTS) {
      const allies = guided(front, V19)
      expect(allies.map((a) => a.classId)).toEqual(riftGuidedBuild(front, V19).map((m) => m.classId))
      allies.forEach((a, i) => {
        expect(a.weapons).toEqual(riftGuidedBuild(front, V19)[i]!.weapons)
        expect(validRpgWeapons(a.classId, a.weapons, V19), `${front} ${a.classId}`).toBe(true)
        expect(a.classRank, `${front} ${a.classId}`).toBe(50)
      })
      expect(allies.filter((a) => rpgIsHealer(a.classId, V19))).toHaveLength(1)
      const plan = planOf('t1-r1', { kind: 'front', front, stage: 1 }, V19)
      expect(() => createBattle(riftBattleInput(plan, allies, 7, VERSION))).not.toThrow()
      // S9's fresh Uma: a Tier 1 class opens at Class Rank 10 (CV8), and the engine takes her there.
      const fresh = guided(front, V19, 0)
      expect(fresh[0]!.classRank).toBe(RPG_TIER0_MAX_RANK)
      expect(() => createBattle(riftBattleInput(plan, fresh, 7, VERSION))).not.toThrow()
    }
  })

  it('keeps v19\'s faces, ranks and counts v15\'s (the picker\'s allocation holds)', () => {
    const skeleton = (engine: number) => RIFT_FRONTS.flatMap((front) => range(1, 12).map((stage) =>
      riftShape(front, stage, engine).map((wave) => wave.map((s) => `${s.face}:${s.rank}:${s.role}:${s.pair ?? ''}`))))
    expect(skeleton(V19)).toEqual(skeleton(15))
  })

  it('lets Iron\'s v19 guided build win Iron\'s stage 1, six of eight seeds a run or more', () => {
    // Its captain and guard are a coin's edge for this build on runs 1 and 3 (it wins 92% of S8's 96 fights; v18's 94%),
    // so the check counts the first eight seeds of each run rather than one seed (v17's file plays `rift:t1:1` on run 1).
    const allies = guided('iron', V19)
    for (const runId of RUNS) {
      const plan = planOf(runId, { kind: 'front', front: 'iron', stage: 1 }, V19)
      const won = range(1, 8).filter((k) => fight(plan, allies, riftSeed(`rift:t1:${k}`), V19).won).length
      expect(won, runId).toBeGreaterThanOrEqual(6)
    }
  })

  it('keeps every class\'s best single act and best Limit Break at 10 chips or fewer, below the Duel\'s lowest v19 shield (the rail)', () => {
    const lowest = Math.min(...duelShields(V19))
    expect(lowest).toBeGreaterThanOrEqual(13)
    expect(Math.max(...duelShields(V19))).toBeLessThanOrEqual(15)
    for (const classId of rpgClasses(V19)) {
      const rail = guardRail(classId, V19)
      expect(rail.own.chips, `${classId}: ${rail.own.act}`).toBeLessThanOrEqual(10)
      expect(rail.limit.chips, `${classId}: ${rail.limit.act}`).toBeLessThanOrEqual(10)
      expect(rail.own.chips, `${classId}: ${rail.own.act}`).toBeLessThan(lowest)
      expect(rail.hits!.hits, `${classId}: ${rail.hits!.act}`).toBeLessThanOrEqual(HERO_LIMIT_MAX_HITS)
    }
  }, 120_000)

  it.skipIf(!process.env.SIM)('prints the Rift\'s targets on v19: the four builds (S8), the guard rail, Echoes (S9)', async () => {
    const tick = () => new Promise((resolve) => setTimeout(resolve, 0))
    const want = new Set((process.env.SIM_TARGETS ?? 's8,rail,s9').split(','))
    const fronts = (process.env.SIM_FRONTS?.split(',') ?? RIFT_FRONTS) as RiftFront[]
    const seeds = seedsOf(Number(process.env.SIM_SEEDS ?? 8))
    const rows: string[] = [`engine v19 against v18; ${RUNS.length} runs × ${seeds.length} seeds a stage; on-curve Lv 50, first try on Auto`]
    const flush = () => { if (rows.length) console.log(rows.splice(0).join('\n')) }
    const strict = seeds.length >= 32
    if (want.has('s8')) {
      rows.push('', 'S8: front | engine | stages 1–4 | 5–8 | 9–11 | champion | gap to v18 by group (points; ±5)')
      for (const front of fronts) {
        const s18 = frontStages(front, guided(front, V18), seeds, V18)
        await tick()
        const s19 = frontStages(front, guided(front, V19), seeds, V19)
        await tick()
        const groups = (s: ReturnType<typeof frontStages>) => GROUPS.map(([a, z]) => merge(s.slice(a - 1, z)))
        const g18 = groups(s18), g19 = groups(s19)
        rows.push(`${front} | v18 | ${g18.map(cell).join(' | ')} | —`,
          `${front} | v19 | ${g19.map(cell).join(' | ')} | ${g19.map((b, i) => (100 * (rate(b) - rate(g18[i]!))).toFixed(1)).join(' · ')}`)
        // H63's practice: at 32 seeds every group H131 met is asserted; Iron's stages 9–11 are D249's miss.
        g19.forEach((b, i) => { if (strict && !(front === 'iron' && i === 2)) expect(Math.abs(rate(b) - rate(g18[i]!)), `S8 ${front} group ${i + 1}`).toBeLessThanOrEqual(0.05) })
        flush()
      }
    }
    if (want.has('rail')) {
      rows.push('', `The rail: class | best own act (Class Rank 50; a Tier 0 at 10) | best Limit Break (chips) | most hits on one foe (≤ ${HERO_LIMIT_MAX_HITS}) | ` +
        `Duel shields ${duelShields(V19).join(', ')}`)
      for (const classId of rpgClasses(V19)) {
        const rail = guardRail(classId, V19)
        rows.push(`${classId}${rpgIsTier0(classId) ? ' (Tier 0)' : ''} | ${rail.own.chips}: ${rail.own.act} | ${rail.limit.chips}: ${rail.limit.act} | ` +
          `${rail.hits!.hits}: ${rail.hits!.act}`)
        await tick()
      }
      flush()
    }
    if (want.has('s9')) {
      rows.push('', 'S9: Echo | party | Lv 45 | Lv 50 | Lv 55 (v19; the fresh Uma at Class Rank 10, v18\'s at 1)')
      for (const front of fronts) {
        for (const [label, engine, respec] of [['v18, one re-specced', V18, 0], ['v19 on curve', V19, undefined], ['v19, one fresh (Rank 10)', V19, 0]] as const) {
          const allies = guided(front, engine, respec)
          const cells = ECHO_LEVELS.map((level) => {
            const b = empty()
            const plan = planOf(null, { kind: 'echo', front, level }, engine)
            for (const seed of seeds) for (const salt of RUNS) add(b, fight(plan, allies, riftSeed(`${salt}:${seed}`), engine))
            // S9: the Lv 45 Echo still won with one fresh Uma (rift.md §11: 80% or more).
            if (strict && level === '45' && engine === V19 && respec === 0) expect(rate(b), `S9 ${front}`).toBeGreaterThanOrEqual(0.8)
            return cell(b)
          })
          rows.push(`${front} | ${label} | ${cells.join(' | ')}`)
          await tick()
        }
        flush()
      }
    }
    flush()
  }, 7_200_000)
})
