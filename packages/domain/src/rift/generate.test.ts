import { describe, expect, it } from 'vitest'
import { BATTLE_ENGINE_VERSION, createBattle } from '../rpg/battle/engine'
import type { BattleEnemy } from '../rpg/battle/types'
import { balanceParty } from '../world/balance-party'
import type { RosterMember } from '../world/roster'
import { RIFT_FRONT_SPECS, RIFT_TUNING, riftShape, riftTuning } from './fronts'
import { defeatedBefore, riftBattleInput, riftChain, riftConvergence, riftFight, riftSeed, riftStrength, type RiftContext, type RiftFightPlan } from './generate'
import { riftShapeOf } from './picker'
import { packRoster } from './roster.fixture'
import { ECHO_LEVELS, RIFT_FRONTS, type RiftFightRef } from './state'

const roster = packRoster()
const franchiseOf = new Map(roster.map((m) => [m.id, m.franchise]))
const ctx = (tier = 1, runId: string | null = `t${tier}-r1`, defeated: ReadonlySet<string> = new Set()): RiftContext => ({ tier, runId, roster, defeated })
const foes = (plan: RiftFightPlan): BattleEnemy[] => [plan.enemies, ...(plan.waves ?? [])].flat()
const waves = (plan: RiftFightPlan): BattleEnemy[][] => [plan.enemies, ...(plan.waves ?? [])]
const echoes = (): RiftFightRef[] => RIFT_FRONTS.flatMap((front) => ECHO_LEVELS.map((level): RiftFightRef => ({ kind: 'echo', front, level })))
/** Every fight a tier's Rift has: 48 front stages, the Convergence's 4 and the 12 Echoes. */
const everyFight = (c: RiftContext): RiftFightPlan[] =>
  [...RIFT_FRONTS.flatMap((f) => riftChain(c, f)), ...riftConvergence(c), ...echoes().map((ref) => riftFight(c, ref))]

describe('the Rift generator (H47)', () => {
  it.each([1, 2])('builds every Tier %i fight as an input the engine accepts', (tier) => {
    const allies = balanceParty(50, { gear: true, stars: true, heroes: true, tier })
    const plans = everyFight(ctx(tier))
    expect(plans).toHaveLength(64)
    plans.forEach((plan, i) => {
      const input = riftBattleInput(plan, allies, riftSeed(`rift:t${tier}:${i + 1}`))
      expect(input.version).toBe(BATTLE_ENGINE_VERSION)
      expect(() => createBattle(input), plan.name).not.toThrow()
    })
  })

  it('makes Iron foes weak to Arms only, by rank, warding elements', () => {
    for (const plan of [...riftChain(ctx(), 'iron'), riftConvergence(ctx())[0]!]) {
      for (const e of foes(plan)) {
        expect(e.weaknesses.elements).toEqual([])
        expect(e.weaknesses.weapons).toHaveLength(RIFT_TUNING.weak.iron[e.rank])
        expect(e.ward).toBe('magical')
        expect(e.mixedLocks).toBeUndefined()
      }
    }
    const [a, b] = riftFight(ctx(), { kind: 'front', front: 'iron', stage: 12 }).enemies
    expect(a!.weaknesses.weapons[0]).not.toBe(b!.weaknesses.weapons[0])
  })

  it('makes Arcane foes weak to elements only, by rank, warding Arms', () => {
    for (const plan of [...riftChain(ctx(), 'arcane'), riftConvergence(ctx())[1]!]) {
      for (const e of foes(plan)) {
        expect(e.weaknesses.weapons).toEqual([])
        expect(e.weaknesses.elements).toHaveLength(RIFT_TUNING.weak.arcane[e.rank])
        expect(e.ward).toBe('physical')
      }
    }
    const [a, b] = riftFight(ctx(), { kind: 'front', front: 'arcane', stage: 12 }).enemies
    expect(a!.weaknesses.elements[0]).not.toBe(b!.weaknesses.elements[0])
  })

  it('makes the Duel one boss with mixed locks, acting twice and three times at the champion', () => {
    const chain = riftChain(ctx(), 'duel')
    chain.forEach((plan, i) => {
      const stage = i + 1
      expect(plan.waves).toBeUndefined()
      expect(plan.enemies).toHaveLength(1)
      const e = plan.enemies[0]!
      expect(e.rank).toBe('boss')
      expect(e.mixedLocks).toBe(true)
      expect(e.ward).toBeUndefined()
      expect(e.shield).toBe(RIFT_TUNING.duel.shields[i]!)
      expect(e.weaknesses.weapons).toHaveLength(RIFT_TUNING.weak.duel.weapons[i]!)
      expect(e.weaknesses.elements).toHaveLength(RIFT_TUNING.weak.duel.elements[i]!)
      if (stage < 12) expect([e.twice, e.thrice]).toEqual([true, undefined])
      else expect([e.twice, e.thrice]).toEqual([undefined, true])
    })
    const convergence = riftConvergence(ctx())[2]!.enemies
    expect(convergence).toHaveLength(1)
    expect(convergence[0]!.thrice).toBe(true)
  })

  it('makes the Horde three waves of 4, 5 or 6, each foe her own Arms and element pair', () => {
    riftChain(ctx(), 'horde').forEach((plan, i) => {
      const stage = i + 1
      const list = waves(plan)
      expect(list).toHaveLength(3)
      for (const [w, wave] of list.entries()) {
        expect(wave).toHaveLength(RIFT_TUNING.horde.counts[i]!)
        const pairs = wave.map((e) => `${e.weaknesses.weapons.join()}+${e.weaknesses.elements.join()}`)
        expect(new Set(pairs).size).toBe(wave.length)
        const leaders = w === 2 && stage === 12 ? 2 : 1
        wave.forEach((e, k) => {
          expect(e.rank).toBe('regular')
          expect([e.weaknesses.weapons.length, e.weaknesses.elements.length]).toEqual([1, 1])
          expect(e.shield).toBe(k < leaders ? RIFT_TUNING.horde.leaderShield : RIFT_TUNING.horde.shields[i]!)
          expect(e.ward).toBeUndefined()
        })
      }
    })
  })

  it('gives each foe an element of her own she is not weak to, and no second', () => {
    for (const plan of everyFight(ctx())) {
      for (const e of foes(plan)) {
        expect(e.weaknesses.elements).not.toContain(e.element)
        expect(e.element2).toBeUndefined()
      }
    }
  })

  it('draws every champion pair from two packs', () => {
    const refs: RiftFightRef[] = [...RIFT_FRONTS.map((front): RiftFightRef => ({ kind: 'front', front, stage: 12 })),
      ...[0, 1, 2, 3].map((fight): RiftFightRef => ({ kind: 'convergence', fight }))]
    const pairs = refs.map((ref) => {
      const { front, stage } = riftShapeOf(ref)
      const slots = riftShape(front, stage).flat()
      return foes(riftFight(ctx(), ref)).filter((_, k) => slots[k]!.pair)
    }).filter((pair) => pair.length)
    expect(pairs).toHaveLength(6) // Iron, Arcane and Horde, on the fronts and in the Convergence
    for (const pair of pairs) expect(new Set(pair.map((e) => franchiseOf.get(e.castId))).size).toBe(2)
  })

  it('stands front foes at the tier\'s Lv 50 and Echoes at 45 and 50', () => {
    for (const [tier, top] of [[1, 50], [2, 100]] as const) {
      const c = ctx(tier)
      for (const plan of [...riftChain(c, 'iron'), ...riftConvergence(c)]) {
        expect(plan.level).toBe(50)
        for (const e of foes(plan)) expect(e.level).toBe(top)
      }
      const echo = (level: '45' | '50' | '55') => riftFight(c, { kind: 'echo', front: 'arcane', level })
      expect(foes(echo('45')).map((e) => e.level)).toEqual(foes(echo('45')).map(() => top - 5))
      expect([echo('45').level, echo('50').level, echo('55').level]).toEqual([45, 50, 55])
      expect(foes(echo('55')).every((e) => e.level === top)).toBe(true)
    }
  })

  it('climbs in strength to the champion, the Convergence and the Lv 55 Echo', () => {
    expect(riftStrength({ kind: 'front', front: 'iron', stage: 1 })).toBe(1)
    expect(riftStrength({ kind: 'front', front: 'horde', stage: 12 })).toBe(1.1)
    // The live tuning: v15's override since H61 (H60, D186).
    const live = riftTuning()
    expect(live).toBe(riftTuning(BATTLE_ENGINE_VERSION))
    expect(riftStrength({ kind: 'convergence', fight: 3 })).toBe(Math.round((1 + live.climb) * (1 + live.convergence) * 1e4) / 1e4)
    expect(riftStrength({ kind: 'echo', front: 'duel', level: '55' })).toBe(live.echo55)
    expect(riftStrength({ kind: 'echo', front: 'duel', level: '45' })).toBe(1)
    const [six, eight] = [6, 8].map((stage) => riftFight(ctx(), { kind: 'front', front: 'iron', stage }))
    const ratio = eight!.strength / six!.strength
    expect(ratio).toBeGreaterThan(1)
    foes(six!).forEach((e, i) => {
      const other = foes(eight!)[i]!
      expect(Math.abs(other.stats.hp - e.stats.hp * ratio)).toBeLessThanOrEqual(1.5)
      expect(Math.abs(other.stats.atk - e.stats.atk * ratio)).toBeLessThanOrEqual(1.5)
      expect(other.stats.pdef).toBe(e.stats.pdef)
      expect(other.shield).toBe(e.shield)
    })
    // The Lv 55 Echo is the Lv 50 Echo at `echo55`.
    const [fifty, fiftyFive] = (['50', '55'] as const).map((level) => riftFight(ctx(), { kind: 'echo', front: 'iron', level }))
    foes(fifty!).forEach((e, i) => expect(Math.abs(foes(fiftyFive!)[i]!.stats.hp - e.stats.hp * RIFT_TUNING.echo55)).toBeLessThanOrEqual(1.5))
  })

  it('is deterministic, whatever the roster\'s order', () => {
    const a = everyFight(ctx())
    expect(everyFight(ctx())).toEqual(a)
    expect(everyFight({ ...ctx(), roster: [...roster] })).toEqual(a)
    expect(everyFight({ ...ctx(), roster: [...roster].reverse() })).toEqual(a)
    const other = everyFight(ctx(1, 't1-r2'))
    const look = (plans: RiftFightPlan[]) => plans.slice(0, 52).map((p) => foes(p).map((e) => [e.castId, e.weaknesses]))
    expect(look(other)).not.toEqual(look(a))
    // Echoes ignore the run.
    expect(other.slice(52)).toEqual(a.slice(52))
  })

  it('refuses a fight out of range', () => {
    const bad: unknown[] = [
      { kind: 'front', front: 'iron', stage: 0 }, { kind: 'front', front: 'iron', stage: 13 }, { kind: 'front', front: 'iron', stage: 1.5 },
      { kind: 'front', front: 'fire', stage: 1 }, { kind: 'convergence', fight: 4 }, { kind: 'convergence', fight: -1 },
      { kind: 'echo', front: 'iron', level: '60' }, { kind: 'echo', front: 'nope', level: '50' }, { kind: 'raid' }, null,
    ]
    for (const ref of bad) {
      expect(() => riftFight(ctx(), ref as RiftFightRef)).toThrow(RangeError)
      expect(() => riftStrength(ref as RiftFightRef)).toThrow(RangeError)
    }
    expect(() => riftFight(ctx(1, null), { kind: 'front', front: 'iron', stage: 1 })).toThrow(RangeError)
    expect(() => riftFight(ctx(1, null), { kind: 'convergence', fight: 0 })).toThrow(RangeError)
    expect(() => riftFight(ctx(1, null), { kind: 'echo', front: 'iron', level: '50' })).not.toThrow()
    expect(() => riftFight(ctx(0), { kind: 'front', front: 'iron', stage: 1 })).toThrow(RangeError)
    expect(() => riftChain(ctx(), 'fire' as never)).toThrow(RangeError)
  })

  it('names fights as the page shows them', () => {
    expect(riftFight(ctx(), { kind: 'front', front: 'iron', stage: 5 }).name).toBe('Stage 5')
    expect(riftFight(ctx(), { kind: 'front', front: 'iron', stage: 12 }).name).toBe('Champion')
    expect(riftConvergence(ctx()).map((p) => p.name)).toEqual(RIFT_FRONTS.map((f) => `Convergence · ${RIFT_FRONT_SPECS[f].name}`))
    expect(riftFight(ctx(), { kind: 'echo', front: 'horde', level: '55' }).name).toBe('Echo · Lv 55')
  })

  it('builds the input on today\'s engine, waves only when there are some', () => {
    const allies = balanceParty(50)
    const duel = riftBattleInput(riftFight(ctx(), { kind: 'front', front: 'duel', stage: 1 }), allies, 7)
    expect(duel).toMatchObject({ version: BATTLE_ENGINE_VERSION, seed: 7 })
    expect(duel.allies).not.toBe(allies)
    expect(duel.allies).toEqual(allies)
    expect('waves' in duel).toBe(false)
    expect(riftBattleInput(riftFight(ctx(), { kind: 'front', front: 'horde', stage: 1 }), allies, 7).waves).toHaveLength(2)
    expect(riftSeed('rift:t1:1')).not.toBe(riftSeed('rift:t1:2'))
    expect(riftSeed('rift:t1:1')).toBe(riftSeed('rift:t1:1'))
  })

  it('takes a run\'s defeated faces from strictly before its start', () => {
    const at = '2026-10-10T12:00:00.000Z'
    const defeated = { early: '2026-10-09T12:00:00.000Z', same: at, late: '2026-10-11T12:00:00.000Z' }
    expect([...defeatedBefore(defeated, at)]).toEqual(['early'])
    expect(defeatedBefore({}, at).size).toBe(0)
  })

  it('needs the roster', () => {
    const empty: RosterMember[] = []
    expect(() => riftFight({ ...ctx(), roster: empty }, { kind: 'front', front: 'iron', stage: 1 })).toThrow(RangeError)
    expect(() => riftFight({ ...ctx(), roster: empty }, { kind: 'echo', front: 'iron', level: '45' })).toThrow(RangeError)
  })
})
