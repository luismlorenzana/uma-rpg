import { describe, expect, it } from 'vitest'
import { applyPoints } from './bonus'
import {
  GRADE_MAX, armorValues, gradeGateLevel, gradeMight, gradePoints, mightAt, newGrades, raiseBlock, tierScaled, type GearTier, type GradeTarget,
} from './grades'
import { ARMOR_SLOTS, type ArmorSlot } from './ranks'

const MIGHT = {
  1: [0, 1, 4, 8, 12, 19, 26, 35, 45, 57, 68],
  2: [0, 2, 7, 14, 22, 34, 47, 63, 81, 103, 122],
  3: [0, 3, 10, 21, 31, 49, 68, 91, 117, 148, 177],
} as const

const T1 = {
  head: [4, 8, 12, 16, 20, 24, 28, 32, 36, 40],
  body: [15, 30, 45, 60, 75, 90, 105, 120, 135, 150],
  legs: [3, 6, 9, 12, 15, 18, 21, 24, 27, 30],
  arms: [4, 8, 12, 16, 20, 24, 28, 32, 36, 40],
  feet: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
} as const satisfies Record<ArmorSlot, readonly number[]>

describe('R2 gear grades (D193–D198)', () => {
  it('uses WP5’s exact Might rows in all three tiers, G0 through G10', () => {
    for (const tier of [1, 2, 3] as const) expect(Array.from({ length: GRADE_MAX + 1 }, (_, grade) => mightAt(grade, tier))).toEqual(MIGHT[tier])
    const grades = newGrades(1)
    grades.weapons.greatsword = { grade: 10 }
    grades.weapons['tome-fire'] = { grade: 5 }
    expect(gradeMight(grades, ['greatsword', 'axe', 'tome-fire'], 2)).toEqual({ greatsword: 122, fire: 34 })
  })

  it('uses WP14’s exact armor tables and keeps feet evasion unscaled', () => {
    for (const tier of [1, 2, 3] as const) {
      for (const slot of ARMOR_SLOTS) {
        const values = Array.from({ length: 10 }, (_, i) => armorValues(slot, i + 1, tier))
        const expected = T1[slot].map((value) => slot === 'feet' ? value : tierScaled(value, tier))
        expect(values.map((v) => v.value), `${slot}, Tier ${tier}`).toEqual(expected)
        expect(values.map((v) => v.offense), `${slot} offense, Tier ${tier}`)
          .toEqual(Array.from({ length: 10 }, (_, i) => tierScaled(Math.ceil((i + 1) / 2), tier)))
      }
    }
  })

  it('sums G10 suits and converts HP and evasion into stat points', () => {
    const suit = (tier: GearTier) => {
      const grades = newGrades(tier)
      for (const slot of ARMOR_SLOTS) grades.armor[slot] = { grade: 10 }
      return gradePoints(grades, 'physical', tier)
    }
    expect(suit(1)).toMatchObject({ hp: 30, def: 40, mdef: 40, mp: 30, speed: 20, atk: 25, matk: 0 })
    expect(suit(2)).toMatchObject({ hp: 54, def: 72, mdef: 72, mp: 54, speed: 20, atk: 45, matk: 0 })
    expect(suit(3)).toMatchObject({ hp: 78, def: 104, mdef: 104, mp: 78, speed: 20, atk: 65, matk: 0 })
    const one = newGrades(2)
    one.armor.body = { grade: 1 }
    one.armor.feet = { grade: 1 }
    expect(gradePoints(one, 'magical', 2)).toMatchObject({ hp: 5.4, speed: 2, atk: 0, matk: 4 })
    const boosted = applyPoints({ hp: 100, mp: 0, atk: 0, matk: 0, pdef: 0, mdef: 0, initiative: 0, dexterity: 0, speed: 0, stamina: 0, power: 0, guts: 0, wit: 0 }, gradePoints(one, 'magical', 2))
    expect(boosted).toMatchObject({ stats: { hp: 127 }, evasion: 12 })
  })

  it('gates every grade and reports the complete material refusal', () => {
    expect(Array.from({ length: 10 }, (_, i) => gradeGateLevel(i + 1))).toEqual([1, 6, 11, 16, 21, 26, 31, 36, 41, 46])
    const target: GradeTarget = { kind: 'weapon', weapon: 'greatsword' }
    const grades = newGrades(1)
    grades.weapons.greatsword = { grade: 4 }
    expect(raiseBlock(grades, target, 20, { 'weapon-gem-g5': 1 })).toBe('Needs Lv 21')
    expect(raiseBlock(grades, target, 21, {})).toBe('Needs 1 Arms Gem G5')
    expect(raiseBlock(grades, target, 31, {}, 7)).toBe('Needs Arms Gems G5, G6 and G7')
    grades.weapons.greatsword = { grade: 10 }
    expect(raiseBlock(grades, target, 50, {})).toBe('Already G10')
  })

  it('starts three accessory slots in every tier (D264)', () => {
    for (const tier of [1, 2, 3] as const) expect(newGrades(tier)).toEqual({ weapons: {}, armor: {}, accessories: Array(3).fill({ grade: 0, family: null, form: 'base' }) })
  })
})
