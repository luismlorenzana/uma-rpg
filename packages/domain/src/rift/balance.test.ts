// The Rift's balance simulation (rift.md §11, H51): on-curve Lv 50 parties built through the game's own rules
// (`world/balance-party.ts`) play the Rift's fights on Auto (`world/balance-play.ts`, the shared policy), with the shared
// support in `rift/balance-sim.ts`. The full tables: `SIM=1 npx vitest run src/rift/balance.test.ts`; `SIM_FRONTS=iron,duel`
// and `SIM_SEEDS=4` narrow them while tuning, and `SIM_ENGINE=15` plays them on classes v2 with v2's guided parties (H60),
// `SIM_ENGINE=16` on the Tier rework's R1 with its guided builds (H71). The always-on checks are small and use fixed seeds;
// classes v2's are in `rift/balance-v15.test.ts`, R1's in `rift/balance-v16.test.ts`.
import { describe, expect, it } from 'vitest'
import { BATTLE_ENGINE_VERSION } from '../rpg/battle/caps'
import type { BattleAlly } from '../rpg/battle/types'
import { rpgBattleExp } from '../rpg/campaign/rewards'
import { RPG_CLASSES, RPG_TIER_MAX_LEVEL, rpgClasses, rpgDefaultWeapons } from '../rpg/rules'
import { CLASS_EXP_SHARE, classExpToNext, grantTrack, weaponExpShares, type RankTrack } from '../economy/ranks'
import { echoFoeLevel, ECHO_RANK_PAY } from '../save/rift'
import {
  add, cell, ctx, defaultLoadoutAt, duelShields, empty, fight, frontStages, GROUPS, guardRail, guided, merge, pct, planOf, rate, roster, RUNS,
  seedsOf, WRONG,
} from './balance-sim'
import { riftConvergence, riftSeed } from './generate'
import { RIFT_RUN_FIGHTS, riftRunFaces } from './picker'
import { CONVERGENCE_FIGHTS, ECHO_LEVELS, RIFT_FRONTS, riftRefKey, type EchoLevel, type RiftFront } from './state'

const tierOf = new Map(roster.map((m) => [m.id, m.tier]))

// --- Echo pacing (rift.md §8, R6) ---------------------------------------------------------------------------------------

/** Class EXP an Echo win pays a Lv 50 Uma (D174): `ECHO_RANK_PAY` × a stage's `CLASS_EXP_SHARE` × E. */
const echoClassExp = (level: EchoLevel): number => ECHO_RANK_PAY * CLASS_EXP_SHARE * rpgBattleExp('fight', echoFoeLevel(1, level), RPG_TIER_MAX_LEVEL)
/** Echo wins that raise a fresh class from Rank 1 to `rank`. */
function echoWinsTo(rank: number, level: EchoLevel): number {
  let track: RankTrack = { rank: 1, exp: 0 }
  let wins = 0
  while (track.rank < rank) { track = grantTrack(track, 'class', echoClassExp(level)).track; wins++ }
  return wins
}
/** Echo wins that raise her first weapon from Rank 1 to `rank` when she uses `used` of her five a fight (0: a Sweep,
 * whose five share evenly). */
function echoWeaponWinsTo(rank: number, level: EchoLevel, used: number): number {
  const weapons = rpgDefaultWeapons('brawler')
  const exp = ECHO_RANK_PAY * weaponExpShares(weapons, new Set(weapons.slice(0, used)), rpgBattleExp('fight', echoFoeLevel(1, level), RPG_TIER_MAX_LEVEL))[weapons[0]!]!
  let track: RankTrack = { rank: 1, exp: 0 }
  let wins = 0
  while (track.rank < rank) { track = grantTrack(track, 'weapon', exp).track; wins++ }
  return wins
}

// --- The Bestiary (rift.md §9) ------------------------------------------------------------------------------------------

/** Runs until every boss and every sub-boss of the pack-sized roster has been defeated, each run winning every fight
 * once and preferring the faces defeated before it started. */
function bestiaryRuns(): { boss: number; subboss: number; slots: { boss: number; subboss: number } } {
  const all = { boss: roster.filter((m) => m.tier === 'boss').length, subboss: roster.filter((m) => m.tier === 'subboss').length }
  const defeated = new Set<string>()
  const done: { boss: number; subboss: number } = { boss: 0, subboss: 0 }
  let slots = { boss: 0, subboss: 0 }
  for (let run = 1; run <= 10 && (!done.boss || !done.subboss); run++) {
    const faces = riftRunFaces(roster, 1, `t1-r${run}`, new Set(defeated))
    const ids = RIFT_RUN_FIGHTS.flatMap((ref) => [...faces.get(riftRefKey(ref))!])
    if (run === 1) slots = { boss: ids.filter((id) => tierOf.get(id) === 'boss').length, subboss: ids.filter((id) => tierOf.get(id) === 'subboss').length }
    for (const id of ids) if (tierOf.get(id) === 'boss' || tierOf.get(id) === 'subboss') defeated.add(id)
    for (const tier of ['boss', 'subboss'] as const) {
      if (!done[tier] && [...defeated].filter((id) => tierOf.get(id) === tier).length === all[tier]) done[tier] = run
    }
  }
  return { ...done, slots }
}

// --- The checks ---------------------------------------------------------------------------------------------------------

describe('the Rift\'s balance (H51)', () => {
  it('lets Iron\'s guided party win Iron\'s stage 1', () => {
    const plan = planOf('t1-r1', { kind: 'front', front: 'iron', stage: 1 })
    expect(fight(plan, guided('iron'), riftSeed('rift:t1:1')).won).toBe(true)
  })

  it('has Arcane\'s guided party (all magic) lose Iron\'s champion', () => {
    const plan = planOf('t1-r1', { kind: 'front', front: 'iron', stage: 12 })
    expect(fight(plan, guided('arcane'), riftSeed('rift:t1:1')).won).toBe(false)
  })

  it('keeps every class\'s best single act below the Duel\'s lowest shield (the guard rail)', () => {
    const lowest = Math.min(...duelShields())
    for (const classId of RPG_CLASSES) {
      const rail = guardRail(classId)
      expect(rail.own.chips, `${classId}: ${rail.own.act}`).toBeLessThan(lowest)
      expect(rail.limit.chips, `${classId}: ${rail.limit.act}`).toBeLessThan(lowest)
    }
  }, 20_000)

  it('raises a fresh class to Rank 30 in the documented number of Echo wins', () => {
    let need = 0
    for (let r = 1; r < 30; r++) need += classExpToNext(r)
    expect(need).toBe(10_440)
    expect([echoWinsTo(30, '45'), echoWinsTo(30, '50'), echoWinsTo(30, '55')]).toEqual([17, 9, 9])
  })

  it.skipIf(!process.env.SIM)('prints the Rift\'s tables: fronts, the Convergence, the guard rail, Echoes, the Bestiary and a run', async () => {
    // Yields between long loops, so Vitest's worker keeps answering its runner.
    const tick = () => new Promise((resolve) => setTimeout(resolve, 0))
    const engine = Number(process.env.SIM_ENGINE ?? BATTLE_ENGINE_VERSION)
    const party = (front: RiftFront, respec?: number): BattleAlly[] => guided(front, engine, respec)
    const fronts = (process.env.SIM_FRONTS?.split(',') ?? RIFT_FRONTS) as RiftFront[]
    const seeds = seedsOf(Number(process.env.SIM_SEEDS ?? 8))
    const rows: string[] = [`${RUNS.length} runs × ${seeds.length} seeds a stage; on-curve Lv 50, first try on Auto, engine v${engine}`, '',
      'front | party | stages 1–4 | 5–8 | 9–11 | champion']
    const firstTry: Partial<Record<RiftFront, number[]>> = {}
    for (const front of fronts) {
      for (const [label, partyOf] of [['right', front], ['wrong', WRONG[front]]] as const) {
        const stages = frontStages(front, party(partyOf), seeds, engine)
        await tick()
        if (label === 'right') firstTry[front] = stages.map(rate)
        rows.push(`${front} | ${label} (${partyOf}'s) | ${GROUPS.map(([a, z]) => cell(merge(stages.slice(a - 1, z)))).join(' | ')}`)
      }
    }
    // The same guided parties with the game's default loadout, for the record: what a save fights with before she picks.
    for (const front of fronts) {
      const stages = frontStages(front, party(front).map(defaultLoadoutAt(engine)), seeds, engine)
      await tick()
      rows.push(`${front} | right, default loadout | ${GROUPS.map(([a, z]) => cell(merge(stages.slice(a - 1, z)))).join(' | ')}`)
    }
    // The Convergence: the four guided parties, an attempt won when all four fights are; then with default loadouts.
    const convergence = (loadout: (a: BattleAlly) => BattleAlly) => {
      const conv = Array.from({ length: CONVERGENCE_FIGHTS }, empty)
      let attempts = 0, won = 0
      for (const runId of RUNS) {
        const plans = riftConvergence(ctx(runId), engine)
        for (const seed of seeds) {
          attempts++
          const results = plans.map((plan, i) => fight(plan, party(RIFT_FRONTS[i]!).map(loadout), riftSeed(`${seed}:${i}`), engine))
          results.forEach((r, i) => add(conv[i]!, r))
          if (results.every((r) => r.won)) won++
        }
      }
      return { conv, attempts, won }
    }
    const { conv, attempts, won } = convergence((a) => a)
    const product = conv.reduce((p, b) => p * rate(b), 1)
    const byDefault = convergence(defaultLoadoutAt(engine))
    rows.push('', 'Convergence | Iron | Arcane | Duel | Horde | attempt', `fights | ${conv.map(cell).join(' | ')} | ${pct(won / attempts)} (${won}/${attempts}; product ${pct(product)})`,
      `default loadouts | ${byDefault.conv.map(cell).join(' | ')} | ${pct(byDefault.won / byDefault.attempts)} (${byDefault.won}/${byDefault.attempts})`)
    // The guard rail.
    rows.push('', `class | best own act | best Limit Break | Duel shields ${duelShields(engine).join(', ')}`)
    for (const classId of rpgClasses(engine)) {
      const rail = guardRail(classId, engine)
      rows.push(`${classId} | ${rail.own.chips}: ${rail.own.act} | ${rail.limit.chips}: ${rail.limit.act}`)
    }
    // Echo pacing: the pay rule, then the win rates.
    rows.push('', 'Echo | Class EXP a win | wins to Rank 30 | to Rank 40 | to Rank 50 | Weapon Rank 8: one used, two used, swept')
    for (const level of ECHO_LEVELS) {
      rows.push(`Lv ${level} | ${echoClassExp(level)} | ${echoWinsTo(30, level)} | ${echoWinsTo(40, level)} | ${echoWinsTo(50, level)} | ` +
        `${echoWeaponWinsTo(8, level, 1)}, ${echoWeaponWinsTo(8, level, 2)}, ${echoWeaponWinsTo(8, level, 0)}`)
    }
    rows.push('', 'Echo | party | Lv 45 | Lv 50 | Lv 55')
    for (const front of fronts) {
      for (const [label, respec] of [['on curve', undefined], ['one re-specced', 0]] as const) {
        await tick()
        const allies = party(front, respec)
        const cells = ECHO_LEVELS.map((level) => {
          const b = empty()
          const plan = planOf(null, { kind: 'echo', front, level }, engine)
          for (const seed of seeds) for (const salt of RUNS) add(b, fight(plan, allies, riftSeed(`${salt}:${seed}`), engine))
          return cell(b)
        })
        rows.push(`${front} | ${label} | ${cells.join(' | ')}`)
      }
    }
    // The Bestiary.
    const bestiary = bestiaryRuns()
    rows.push('', `Bestiary: ${bestiary.slots.boss} boss and ${bestiary.slots.subboss} sub-boss slots a run; every sub-boss after ${bestiary.subboss} runs, every boss after ${bestiary.boss}`)
    // A run's length: expected fights with retries, from the first-try rates (a front stage 1 ÷ p; the Convergence's
    // attempts 1 ÷ P, each playing its fights until the first loss).
    if (fronts.length === RIFT_FRONTS.length) {
      const frontFights = RIFT_FRONTS.reduce((n, f) => n + firstTry[f]!.reduce((m, p) => m + 1 / Math.max(p, 0.01), 0), 0)
      const p = conv.map(rate)
      const perAttempt = 1 + p[0]! + p[0]! * p[1]! + p[0]! * p[1]! * p[2]!
      const attemptRate = Math.max(won / attempts, 0.01)
      const convFights = perAttempt / attemptRate
      rows.push(`A run: about ${Math.round(frontFights)} front fights for 48 stages and ${Math.round(convFights)} Convergence fights (${(1 / attemptRate).toFixed(1)} attempts): ${Math.round(frontFights + convFights)} in all`)
    }
    console.log(rows.join('\n'))
  }, 1_800_000)
})
