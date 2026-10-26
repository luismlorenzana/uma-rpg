// The foes' build budget × tier from engine v17 (R2, EP16, SB1; H76, D213) and the balance party's on-curve map. Each
// engine is named: v16 and older stay byte for byte as before, and Tier 1 doesn't move in any engine.
import { describe, expect, it } from 'vitest'
import { mapPoints } from '../../economy/planet'
import { BALANCE_KIT_V16, BALANCE_KIT_V2, onCurveGrade, onCurveStars } from '../../world/balance-party'
import { regionChapter, worldContinent } from '../../world/world'
import { riftFight, type RiftContext } from '../../rift/generate'
import { packRoster } from '../../rift/roster.fixture'
import { BATTLE_ENGINE_VERSION } from '../battle/caps'
import { RPG_CLASSES, type RpgClass } from '../rules'
import { RPG_FOE_TUNING, rpgFoe, rpgFoeBudget, rpgFoeCurveLevel, rpgFoeTierBudget, rpgReferenceStat } from './enemies'

const { budgetPerLevel: HP, offenseBudgetPerLevel: OFFENSE } = RPG_FOE_TUNING
const r3 = (n: number) => Math.round(n * 1000) / 1000
/** The budget as it was before H76 (D170): the oracle v16 and older must match exactly. */
function before(lifetime: number, rate: number): number {
  const level = rpgFoeCurveLevel(lifetime)
  const curve = rpgFoeBudget(level, rate)
  return level === lifetime ? curve : 1 + ((curve - 1) * rpgReferenceStat(level)) / rpgReferenceStat(lifetime)
}

describe('rpgFoeTierBudget by generation (EP16)', () => {
  it('v17 lands each tier’s Lv 50 on Tier 1’s curve: ×2.715, ×2.719, ×2.721 and ×1.49, ×1.491, ×1.492', () => {
    expect([50, 100, 150].map((l) => r3(rpgFoeTierBudget(l, HP, 17)))).toEqual([2.715, 2.719, 2.721])
    expect([50, 100, 150].map((l) => r3(rpgFoeTierBudget(l, OFFENSE, 17)))).toEqual([1.49, 1.491, 1.492])
  })

  it('v16 and older are unchanged at every lifetime level 1–150 (Tier 2 Lv 50 about ×1.96, D170)', () => {
    for (const engine of [14, 15, 16]) for (let l = 1; l <= 150; l++) for (const rate of [HP, OFFENSE]) {
      expect(rpgFoeTierBudget(l, rate, engine)).toBe(before(l, rate))
    }
    expect(r3(rpgFoeTierBudget(100, HP, 16))).toBeCloseTo(1.955, 3)
    // The live default is v17's since H82 (D218).
    expect(BATTLE_ENGINE_VERSION).toBe(17)
    for (let l = 1; l <= 150; l++) expect(rpgFoeTierBudget(l, HP)).toBe(rpgFoeTierBudget(l, HP, 17))
  })

  it('Tier 1 doesn’t move in v17 (m = 1, ℓ = L); later tiers rise by their multiplier on the build part', () => {
    for (let l = 1; l <= 50; l++) expect(rpgFoeTierBudget(l, HP, 17)).toBe(before(l, HP))
    for (const [l, m] of [[75, 1.8], [100, 1.8], [125, 2.6], [150, 2.6]] as const) {
      expect(rpgFoeTierBudget(l, HP, 17) - 1).toBeCloseTo((before(l, HP) - 1) * m, 12)
    }
  })

  it('rpgFoe reads its engine: the same Tier 1 foe in v16 and v17, a sturdier Tier 2 foe in v17', () => {
    const foe = (level: number, engine?: number) => rpgFoe({ id: 'f', castId: 'c', element: 'fire', role: 'striker', rank: 'regular', level, shield: 2,
      weaknesses: { weapons: [], elements: [] } }, engine)
    expect(foe(50, 17)).toEqual(foe(50, 16))
    expect(foe(100)).toEqual(foe(100, 17))
    expect(foe(100, 17).stats.hp).toBeGreaterThan(foe(100, 16).stats.hp)
    expect(foe(100, 17).stats.pdef).toBeGreaterThan(foe(100, 16).stats.pdef)
    expect(foe(100, 17).stats.atk).toBeGreaterThan(foe(100, 16).stats.atk)
  })

  it('the world’s stages and the Rift’s fights generate their foes in their own engine', () => {
    const cast = Array.from({ length: 30 }, (_, i) => ({ id: `c${i}`, name: `Rival ${i}` }))
    const t1 = worldContinent({ name: 'T', order: 1 }).regions[0]!, t2 = worldContinent({ name: 'T', order: 6 }).regions[0]!
    const hp = (nodes: ReturnType<typeof regionChapter>['nodes']) => nodes.flatMap((n) => [...n.enemies, ...(n.waves ?? []).flat()]).map((e) => e.stats.hp)
    expect(regionChapter(t1, cast, 17).nodes).toEqual(regionChapter(t1, cast, 16).nodes)
    expect(regionChapter(t2, cast).nodes).toEqual(regionChapter(t2, cast, 17).nodes)
    const v16 = hp(regionChapter(t2, cast, 16).nodes), v17 = hp(regionChapter(t2, cast, 17).nodes)
    expect(v17.every((n, i) => n >= v16[i]!)).toBe(true)
    expect(v17.some((n, i) => n > v16[i]!)).toBe(true)
    const roster = packRoster()
    const ctx = (tier: number): RiftContext => ({ tier, runId: `t${tier}-r1`, roster, defeated: new Set() })
    // Arcane's champion: R2's balance (H81) tuned Iron's and the Horde's champions for v17, so the budget is read where it alone moves.
    const ref = { kind: 'front', front: 'arcane', stage: 12 } as const
    const riftHp = (tier: number, engine: number) => riftFight(ctx(tier), ref, engine).enemies.map((e) => e.stats.hp)
    expect(riftHp(1, 17)).toEqual(riftHp(1, 16))
    expect(riftHp(2, 17).every((n, i) => n > riftHp(2, 16)[i]!)).toBe(true)
  })
})

describe('onCurveStars (EP16, §3.4)', () => {
  /** The map before H76 (H60, H71): the best moons her level and the gem grades allow across her kit's four stats. */
  function oldStars(classId: RpgClass, level: number, engine: number): string[] {
    const stats = (engine >= 16 ? BALANCE_KIT_V16 : BALANCE_KIT_V2)[classId].stats
    const slots = 5 + Math.floor(level / 2), nodes: string[] = []
    for (let g = onCurveGrade(level); g >= 1 && nodes.length < slots; g--) for (const s of stats) if (nodes.length < slots) nodes.push(`moon:${s}:${g}`)
    return nodes
  }

  it('v17: a stat with its moon +1, +3, +5, +9, +13, +19, +25, +33, +41, +51 at Lv 1, 6 … 46; the Planet alone +1 … +21', () => {
    const levels = [1, 6, 11, 16, 21, 26, 31, 36, 41, 46]
    const at = (classId: RpgClass, level: number) => mapPoints(onCurveStars(classId, level, 17), classId, 1)
    expect(levels.map((l) => at('brawler', l).def)).toEqual([1, 3, 5, 9, 13, 19, 25, 33, 41, 51])
    expect(levels.map((l) => at('mage', l).matk)).toEqual([1, 3, 5, 9, 13, 19, 25, 33, 41, 51])
    expect(levels.map((l) => at('mage', l).atk)).toEqual([1, 1, 3, 3, 7, 7, 13, 13, 21, 21])
    expect(levels.map((l) => at('spellblade', l).atk)).toEqual([1, 2, 4, 7, 11, 15, 21, 27, 35, 42])
    expect(levels.map((l) => onCurveStars('cleric', l, 17).length)).toEqual([1, 4, 5, 8, 9, 12, 13, 16, 17, 20])
    expect(levels.map((l) => mapPoints(onCurveStars('brawler', l, 17), 'brawler', 2).hp)).toEqual([2, 6, 10, 17, 24, 35, 46, 60, 74, 92])
  })

  it('v17: the same 20 ids for every class at Lv 46, in map order, no template moon', () => {
    const all = onCurveStars('brawler', 46, 17)
    expect(all).toHaveLength(20)
    expect(all.some((id) => id.startsWith('template:'))).toBe(false)
    for (const classId of RPG_CLASSES) expect(onCurveStars(classId, 50, 17)).toEqual(all)
    expect(onCurveStars('brawler', 45, 17)).toHaveLength(17)
  })

  it('v15 and v16 unchanged', () => {
    for (const engine of [15, 16]) for (const classId of RPG_CLASSES) for (let level = 1; level <= 50; level++) {
      expect(onCurveStars(classId, level, engine)).toEqual(oldStars(classId, level, engine))
    }
  })
})
