// The Rift's twin draws on engine v19 (H128; classes-v3.md §4.3, CV13), built dark: the Duel's boss and the Horde's foes
// draw v19's sets (the Light set the Katana and Light, the Dark set the Bow and Dark), from the fight's own engine; v16–v18
// generate as they did (the digests below were taken on the generator before this change), as do v14 and v15.
import { describe, expect, it } from 'vitest'
import type { BattleEnemy } from '../rpg/battle/types'
import { RPG_ELEMENTS, RPG_WEAPON_KINDS, rpgTwinArm, type RpgElement } from '../rpg/rules'
import { riftChain, riftConvergence, riftFight, type RiftContext, type RiftFightPlan } from './generate'
import { packRoster } from './roster.fixture'
import { ECHO_LEVELS, RIFT_FRONTS, type RiftFightRef } from './state'

const roster = packRoster()
const ctx = (tier = 1, runId: string | null = `t${tier}-r1`): RiftContext => ({ tier, runId, roster, defeated: new Set() })
const RUNS = [1, 2, 3, 4, 5].map((n) => ctx(1, `t1-r${n}`))
const foes = (plan: RiftFightPlan): BattleEnemy[] => [plan.enemies, ...(plan.waves ?? [])].flat()
const echoes = (): RiftFightRef[] => RIFT_FRONTS.flatMap((front) => ECHO_LEVELS.map((level): RiftFightRef => ({ kind: 'echo', front, level })))
const everyFight = (c: RiftContext, engine: number): RiftFightPlan[] =>
  [...RIFT_FRONTS.flatMap((f) => riftChain(c, f, engine)), ...riftConvergence(c, engine), ...echoes().map((ref) => riftFight(c, ref, engine))]
/** FNV-1a, as `generate-v16.test.ts` hashes. */
function fnv1a(text: string): string {
  let h = 0x811c9dc5
  for (let i = 0; i < text.length; i += 1) { h ^= text.charCodeAt(i); h = Math.imul(h, 0x01000193) }
  return (h >>> 0).toString(16).padStart(8, '0')
}
/** A foe's weaknesses as twin sets of an engine: her elements, each with exactly its twin Arm beside it. */
function twinSets(foe: BattleEnemy, engine: number): RpgElement[] {
  const { weapons, elements } = foe.weaknesses
  expect(weapons, foe.id).toEqual(RPG_WEAPON_KINDS.filter((w) => elements.some((e) => rpgTwinArm(e, engine) === w)))
  expect(elements).toEqual(RPG_ELEMENTS.filter((e) => elements.includes(e)))
  return elements
}
/** The Duel's and the Horde's foes of every run, chain, Convergence fight and Echo. */
const twinFoes = (engine: number): BattleEnemy[] => RUNS.flatMap((c) => [
  ...riftChain(c, 'duel', engine), ...riftChain(c, 'horde', engine), ...riftConvergence(c, engine).slice(2),
  ...ECHO_LEVELS.flatMap((level) => (['duel', 'horde'] as const).map((front) => riftFight(c, { kind: 'echo', front, level }, engine))),
].flatMap(foes))

describe('the Rift on v19\'s twins (CV13)', () => {
  it('draws the Duel\'s boss and the Horde\'s foes from v19\'s sets: a Light-set foe is weak to the Katana and Light', () => {
    const all = twinFoes(19)
    for (const foe of all) twinSets(foe, 19)
    const light = all.filter((f) => f.weaknesses.elements.includes('light'))
    const dark = all.filter((f) => f.weaknesses.elements.includes('dark'))
    expect(light.length).toBeGreaterThan(0)
    expect(dark.length).toBeGreaterThan(0)
    for (const f of light) expect(f.weaknesses.weapons).toContain('katana')
    for (const f of dark) expect(f.weaknesses.weapons).toContain('bow')
    // A Duel boss of each: stage 1's boss holds two sets.
    const boss = riftChain(ctx(), 'duel', 19)[0]!.enemies[0]!
    expect(twinSets(boss, 19)).toHaveLength(2)
  })

  it('draws the same sets at v18 and v19, re-paired: only the Arm beside Light and Dark moves', () => {
    const [v18, v19] = [twinFoes(18), twinFoes(19)]
    expect(v19.map((f) => [f.id, f.castId, f.weaknesses.elements])).toEqual(v18.map((f) => [f.id, f.castId, f.weaknesses.elements]))
    v18.forEach((f, i) => {
      expect(f.weaknesses.weapons).toEqual(RPG_WEAPON_KINDS.filter((w) => f.weaknesses.elements.some((e) => rpgTwinArm(e, 18) === w)))
      expect(v19[i]!.weaknesses.weapons).toEqual(RPG_WEAPON_KINDS.filter((w) => f.weaknesses.elements.some((e) => rpgTwinArm(e, 19) === w)))
    })
    expect(v18.some((f, i) => JSON.stringify(f.weaknesses) !== JSON.stringify(v19[i]!.weaknesses))).toBe(true)
  })

  it('keeps Iron\'s and Arcane\'s draws: no twin set there', () => {
    for (const front of ['iron', 'arcane'] as const) {
      expect(riftChain(ctx(), front, 19).flatMap(foes).map((f) => f.weaknesses)).toEqual(riftChain(ctx(), front, 18).flatMap(foes).map((f) => f.weaknesses))
    }
  })
})

describe('v14–v18\'s Rift, byte for byte (H128)', () => {
  it.each([[18, 'cb1b709d'], [17, 'cb1b709d'], [16, 'cd8c64d5'], [15, '2154c380'], [14, '47ddcb4e']] as const)(
    'keeps every v%i fight of Tiers 1–3 as it was before H128', (engine, digest) => {
      const plans = [1, 2, 3].flatMap((tier) => everyFight(ctx(tier), engine))
      expect(plans).toHaveLength(3 * 64)
      expect(fnv1a(plans.map((p) => JSON.stringify(p)).join('\n'))).toBe(digest)
    })
})
