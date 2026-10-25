// The Rift's Tier 1 fronts on engine v16 (H66, D202; class-progression.md §4.3, CP7): the Duel's boss is weak to twin
// sets, two at stages 1–6 and one at 7–12; the Horde deals each foe a twin set, a wave repeating none until all five are
// used; Iron and Arcane draw as before. v15's and v14's fights stay byte for byte as they were: the digests below were
// taken on the generator before this change.
import { describe, expect, it } from 'vitest'
import { createBattle } from '../rpg/battle/engine'
import type { BattleAlly, BattleEnemy } from '../rpg/battle/types'
import { projectRpgStats, RPG_ELEMENTS, RPG_WEAPON_KINDS, rpgActiveSlots, rpgTwinArm, type RpgClass, type RpgElement, type RpgProfile, type RpgWeapon } from '../rpg/rules'
import { RIFT_TUNING, riftGuidedBuild, riftTuning } from './fronts'
import { riftBattleInput, riftChain, riftConvergence, riftFight, riftSeed, type RiftContext, type RiftFightPlan } from './generate'
import { packRoster } from './roster.fixture'
import { ECHO_LEVELS, RIFT_FRONTS, type RiftFightRef, type RiftFront } from './state'

const roster = packRoster()
const ctx = (tier = 1, runId: string | null = `t${tier}-r1`): RiftContext => ({ tier, runId, roster, defeated: new Set() })
const RUNS = [1, 2, 3, 4, 5].map((n) => ctx(1, `t1-r${n}`))
const waves = (plan: RiftFightPlan): BattleEnemy[][] => [plan.enemies, ...(plan.waves ?? [])]
const foes = (plan: RiftFightPlan): BattleEnemy[] => waves(plan).flat()
const echoes = (): RiftFightRef[] => RIFT_FRONTS.flatMap((front) => ECHO_LEVELS.map((level): RiftFightRef => ({ kind: 'echo', front, level })))
const everyFight = (c: RiftContext, engine: number): RiftFightPlan[] =>
  [...RIFT_FRONTS.flatMap((f) => riftChain(c, f, engine)), ...riftConvergence(c, engine), ...echoes().map((ref) => riftFight(c, ref, engine))]
/** A foe's weaknesses as twin sets: her elements, each with exactly its twin Arm beside it. */
function twinSets(foe: BattleEnemy): RpgElement[] {
  const { weapons, elements } = foe.weaknesses
  expect(weapons).toEqual(RPG_WEAPON_KINDS.filter((w) => elements.map(rpgTwinArm).includes(w)))
  expect(elements).toEqual(RPG_ELEMENTS.filter((e) => elements.includes(e)))
  return elements
}

/** FNV-1a, as `world.ts` and `tier1-foes.test.ts` hash. */
function fnv1a(text: string): string {
  let h = 0x811c9dc5
  for (let i = 0; i < text.length; i += 1) { h ^= text.charCodeAt(i); h = Math.imul(h, 0x01000193) }
  return (h >>> 0).toString(16).padStart(8, '0')
}

describe('the Rift on v16 (CP7, D202)', () => {
  it('reads v15’s numbers with the Duel’s draws as twin sets', () => {
    const v15 = riftTuning(15), v16 = riftTuning(16)
    expect(v16.weak.duel.sets).toEqual([2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1])
    expect(v15.weak.duel.sets).toBeUndefined()
    expect(riftTuning(14)).toBe(RIFT_TUNING)
    expect(riftTuning(14).weak.duel.sets).toBeUndefined()
    const { weak: _a, ...rest16 } = v16
    const { weak: _b, ...rest15 } = v15
    expect(rest16).toEqual(rest15)
    expect({ ...v16.weak, duel: { ...v16.weak.duel, sets: undefined } }).toEqual({ ...v15.weak, duel: { ...v15.weak.duel, sets: undefined } })
  })

  it('makes the Duel’s boss weak to two twin sets’ four kinds at stages 1–6 and one set’s two at 7–12, her locks mixed', () => {
    for (const c of RUNS) {
      riftChain(c, 'duel', 16).forEach((plan, i) => {
        const [boss] = plan.enemies
        expect(plan.enemies).toHaveLength(1)
        expect(twinSets(boss!)).toHaveLength(i < 6 ? 2 : 1)
        expect(boss!.weaknesses.weapons).toHaveLength(i < 6 ? 2 : 1)
        expect(boss!.mixedLocks).toBe(true)
        expect(boss!.weaknesses.elements).not.toContain(boss!.element)
      })
      // The Convergence's Duel fight is its champion's shape: one set.
      expect(twinSets(riftConvergence(c, 16)[2]!.enemies[0]!)).toHaveLength(1)
    }
  })

  it('deals each Horde foe a twin set, a wave repeating none until all five are used', () => {
    let sixes = 0
    for (const c of RUNS) {
      for (const plan of [...riftChain(c, 'horde', 16), riftConvergence(c, 16)[3]!, ...ECHO_LEVELS.map((level) => riftFight(c, { kind: 'echo', front: 'horde', level }, 16))]) {
        for (const wave of waves(plan)) {
          const sets = wave.map((foe) => {
            const [set, ...more] = twinSets(foe)
            expect(more).toEqual([])
            expect(foe.element).not.toBe(set)
            return set!
          })
          expect(new Set(sets.slice(0, 5)).size).toBe(Math.min(5, sets.length))
          if (sets.length === 6) {
            sixes += 1
            expect(new Set(sets).size).toBe(5)
          }
        }
      }
    }
    expect(sixes).toBeGreaterThan(0)
    // A champion pair's partners, the last wave's first two, take different sets.
    for (const c of RUNS) {
      const last = waves(riftFight(c, { kind: 'front', front: 'horde', stage: 12 }, 16)).at(-1)!
      expect(last[0]!.weaknesses).not.toEqual(last[1]!.weaknesses)
    }
  })

  it('draws Iron and Arcane as before: their v16 fights are v15’s', () => {
    for (const c of RUNS) {
      for (const front of ['iron', 'arcane'] as const) expect(riftChain(c, front, 16)).toEqual(riftChain(c, front, 15))
      expect(riftConvergence(c, 16).slice(0, 2)).toEqual(riftConvergence(c, 15).slice(0, 2))
    }
    for (const ref of echoes().filter((r) => r.kind === 'echo' && (r.front === 'iron' || r.front === 'arcane'))) {
      expect(riftFight(ctx(), ref, 16)).toEqual(riftFight(ctx(), ref, 15))
    }
  })

  it('moves only the Duel’s and the Horde’s weaknesses and the element each draws beside them', () => {
    const shape = (e: BattleEnemy) => ({ id: e.id, castId: e.castId, rank: e.rank, level: e.level, stats: e.stats, shield: e.shield,
      twice: e.twice, thrice: e.thrice, mixedLocks: e.mixedLocks, ward: e.ward })
    for (const front of ['duel', 'horde'] as const) {
      expect(riftChain(ctx(), front, 16).map((p) => foes(p).map(shape))).toEqual(riftChain(ctx(), front, 15).map((p) => foes(p).map(shape)))
    }
  })

  it('builds every Tier 1 fight as a v16 input the engine accepts, with its front’s guided build', () => {
    const member = (id: string, classId: RpgClass, weapons: readonly RpgWeapon[]): BattleAlly => {
      const p: RpgProfile = { outfitId: id, baseStats: { speed: 300, stamina: 300, power: 300, guts: 300, wit: 300 },
        growthRates: { speed: 0.1, stamina: 0.1, power: 0.1, guts: 0.1, wit: 0.1 }, classId, weapons: [...weapons], tier: 1, level: 50, exp: 0,
        tree: [], legacy: [], classRank: 50 }
      const stats = projectRpgStats(p, 16)
      const loadout = [1, 2, 3].flatMap((d) => weapons.map((w) => ({ tier: 1, id: `${classId}-${w}.${d}` }))).slice(0, rpgActiveSlots(50))
      return { id, classId, weapons: [...weapons], tier: 1, level: 50, stats, tree: [], legacy: [], loadout, mp: stats.mp, classRank: 50 }
    }
    const party = (front: RiftFront) => riftGuidedBuild(front, 16).map((m, i) => member(`a${i + 1}`, m.classId, m.weapons))
    const plans = everyFight(ctx(), 16)
    expect(plans).toHaveLength(64)
    plans.forEach((plan, i) => {
      const front = plan.ref.kind === 'convergence' ? RIFT_FRONTS[plan.ref.fight]! : plan.ref.front
      const input = riftBattleInput(plan, party(front), riftSeed(`rift:v16:${i}`), 16)
      expect(() => createBattle(input), plan.name).not.toThrow()
    })
  })
})

describe('v15’s and v14’s Rift, byte for byte (D202)', () => {
  it.each([[15, '2154c380'], [14, '47ddcb4e']] as const)('keeps every v%i fight of Tiers 1–3 as it was before H66', (engine, digest) => {
    const plans = [1, 2, 3].flatMap((tier) => everyFight(ctx(tier), engine))
    expect(plans).toHaveLength(3 * 64)
    expect(fnv1a(plans.map((p) => JSON.stringify(p)).join('\n'))).toBe(digest)
  })
})
