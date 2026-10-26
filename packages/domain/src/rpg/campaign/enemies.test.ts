import { describe, expect, it } from 'vitest'
import { RPG_FOE_TUNING, rpgFoe, rpgFoeBudget, rpgFoeCurveLevel, rpgFoeHitShare, rpgFoeTierBudget } from './enemies'

const { budgetPerLevel: hp, offenseBudgetPerLevel: offense } = RPG_FOE_TUNING
const round2 = (x: number) => Math.round(x * 100) / 100

describe('the foe curve by tier level (tier2-world Z3, H45)', () => {
  it('reads the tier level: Tier 1 is the lifetime level, Tier 2 restarts at Lv 1', () => {
    expect([1, 10, 50, 51, 60, 100, 101].map(rpgFoeCurveLevel)).toEqual([1, 10, 50, 1, 10, 50, 1])
  })

  it('is the curve itself in Tier 1, to the last bit', () => {
    for (let level = 1; level <= 50; level++) {
      expect(rpgFoeTierBudget(level, hp), `Lv ${level}`).toBe(rpgFoeBudget(level, hp))
      expect(rpgFoeTierBudget(level, offense), `Lv ${level}`).toBe(rpgFoeBudget(level, offense))
    }
  })

  it('restarts at Tier 2 Lv 1, its build part scaled to her lifetime stats (tier2-world §5, option A; to engine v16, v17’s × tier is `foe-budget-v17.test.ts`’s)', () => {
    const lifetimes = [51, 60, 75, 90, 100]
    expect(lifetimes.map((L) => round2(rpgFoeTierBudget(L, hp, 16)))).toEqual([1, 1.02, 1.18, 1.56, 1.96])
    expect(lifetimes.map((L) => round2(rpgFoeTierBudget(L, offense, 16)))).toEqual([1, 1.01, 1.05, 1.16, 1.27])
    // The world's regular-foe HP step, 1 + 0.035 × (ℓ − 1).
    expect(lifetimes.map((L) => round2(1 + 0.035 * (rpgFoeCurveLevel(L) - 1)))).toEqual([1, 1.32, 1.84, 2.37, 2.72])
    expect(lifetimes.map((L) => round2(rpgFoeHitShare(rpgFoeCurveLevel(L))))).toEqual([0.2, 0.28, 0.28, 0.28, 0.28])
    expect(rpgFoeHitShare(rpgFoeCurveLevel(51))).toBe(0.2)
  })

  it('gives a Tier 2 Lv 1 regular striker 466 HP and DEF 81 (tier2-world §6)', () => {
    const foe = rpgFoe({ id: 'f', castId: 'c', element: 'fire', role: 'striker', rank: 'regular', level: 51, shield: 2, weaknesses: { weapons: [], elements: [] } })
    expect([foe.level, foe.stats.hp, foe.stats.pdef]).toEqual([51, 466, 81])
  })
})
