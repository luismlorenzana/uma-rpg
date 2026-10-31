// Accessories v3's values and rules (H75, D212; weapon-progression §5.4, WP20–WP23, WP33; uma-templates UT7).
import { describe, expect, it } from 'vitest'
import { rpgDefaultWeapons } from '../rpg/rules'
import { KNACK_FAMILY, UMA_KNACKS } from '../roster/template'
import {
  ACCESSORY_FAMILY_LABEL, accessoryFlatValue, accessoryParts, accessorySlotsParts, accessorySlotValue, BELL_PERMILLE_PER_GRADE, INSIGNIA_PERMILLE_PER_GRADE,
  ORB_T1, PENDANT_T1, signatureBonus, signatureWorn,
} from './accessories'
import { ORB_OFFENSE_BY_GRADE } from './gear'
import { ACCESSORY_FAMILIES, newGrades, type AccessoryFamily, type AccessorySlotState, type GearTier } from './grades'

const GRADES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const row = (family: 'pendant' | 'orb', tier: GearTier) => GRADES.map((g) => accessoryFlatValue(family, g, tier))
const slot = (family: AccessorySlotState['family'], grade: number, kind?: AccessorySlotState['kind']): AccessorySlotState =>
  ({ grade, family, form: 'base', ...(kind ? { kind } : {}) })

describe('the flat forms (WP20, WP22)', () => {
  it('gives the Pendant’s rows for Tiers 1–3 exactly', () => {
    expect(PENDANT_T1).toEqual([1, 1, 2, 2, 4, 5, 7, 9, 12, 14])
    expect(row('pendant', 1)).toEqual([1, 1, 2, 2, 4, 5, 7, 9, 12, 14])
    expect(row('pendant', 2)).toEqual([2, 2, 4, 4, 7, 9, 13, 16, 22, 25])
    expect(row('pendant', 3)).toEqual([3, 3, 5, 5, 10, 13, 18, 23, 31, 36])
  })

  it('gives the Orb’s rows for Tiers 1–3 exactly, Tier 1 v2’s Orb from G1 a step down (×0.8, R2’s balance, H81)', () => {
    expect(ORB_T1).toEqual(ORB_OFFENSE_BY_GRADE.slice(1).map((n) => Math.round(0.8 * n)))
    expect(row('orb', 1)).toEqual([1, 2, 3, 5, 8, 10, 14, 18, 23, 27])
    expect(row('orb', 2)).toEqual([2, 4, 5, 9, 14, 18, 25, 32, 41, 49])
    expect(row('orb', 3)).toEqual([3, 5, 8, 13, 21, 26, 36, 47, 60, 70])
  })

  it('has no flat value at G0, nor for the Bell and the Insignia', () => {
    expect(accessoryFlatValue('pendant', 0, 1)).toBe(0)
    expect(accessoryFlatValue('orb', 0, 3)).toBe(0)
    expect(accessoryFlatValue('bell', 10, 1)).toBe(0)
    expect(accessoryFlatValue('insignia', 10, 1)).toBe(0)
  })
})

describe('the shares (WP21, WP23)', () => {
  it('rings a Bell at 100–1,000 per mille and an Insignia at 15–150 per mille, in every tier', () => {
    const brawler = rpgDefaultWeapons('brawler', 17)
    for (const tier of [1, 2, 3] as const) {
      expect(GRADES.map((g) => accessoryParts(slot('bell', g, 'greatsword'), brawler, tier).bell?.power)).toEqual(GRADES.map((g) => 100 * g))
      expect(GRADES.map((g) => accessoryParts(slot('insignia', g), brawler, tier).insignia?.value)).toEqual(GRADES.map((g) => 15 * g))
    }
    expect([BELL_PERMILLE_PER_GRADE, INSIGNIA_PERMILLE_PER_GRADE]).toEqual([100, 15])
  })
})

describe('accessoryParts', () => {
  const brawler = rpgDefaultWeapons('brawler', 17) // Greatsword, Axe, Lance
  const mage = rpgDefaultWeapons('mage', 17) // Fire, Blizzard and Thunder Tomes

  it('puts a Pendant on each of her three kinds', () => {
    expect(accessoryParts(slot('pendant', 10), brawler, 1)).toEqual({ flat: { greatsword: 14, axe: 14, lance: 14 } })
    expect(accessoryParts(slot('pendant', 10), mage, 2)).toEqual({ flat: { fire: 25, ice: 25, lightning: 25 } })
  })

  it('puts an Orb on its kind, even one she doesn’t wield', () => {
    expect(accessoryParts(slot('orb', 10, 'greatsword'), brawler, 1)).toEqual({ flat: { greatsword: 27 } })
    expect(accessoryParts(slot('orb', 10, 'dark'), brawler, 3)).toEqual({ flat: { dark: 70 } })
  })

  it('gives a Bell only on a kind she slots', () => {
    expect(accessoryParts(slot('bell', 10, 'greatsword'), brawler, 1)).toEqual({ flat: {}, bell: { kind: 'greatsword', power: 1000 } })
    expect(accessoryParts(slot('bell', 10, 'fire'), brawler, 1)).toEqual({ flat: {} })
    expect(accessoryParts(slot('bell', 4, 'ice'), mage, 1)).toEqual({ flat: {}, bell: { kind: 'ice', power: 400 } })
  })

  it('gives an Insignia its share', () => {
    expect(accessoryParts(slot('insignia', 10), brawler, 1)).toEqual({ flat: {}, insignia: { value: 150 } })
  })

  it('gives nothing at G0, with no family, without a slot or for a kindless Orb or Bell', () => {
    for (const family of ACCESSORY_FAMILIES) expect(accessoryParts(slot(family, 0, 'greatsword'), brawler, 1)).toEqual({ flat: {} })
    expect(accessoryParts(slot(null, 10), brawler, 1)).toEqual({ flat: {} })
    expect(accessoryParts(undefined, brawler, 1)).toEqual({ flat: {} })
    expect(accessoryParts(slot('orb', 10), brawler, 1)).toEqual({ flat: {} })
    expect(accessoryParts(slot('bell', 10), brawler, 1)).toEqual({ flat: {} })
  })
})

describe('a slot’s rows (D266)', () => {
  it('are linear, so every raise counts', () => {
    for (let grade = 1; grade <= 10; grade++) {
      expect(accessorySlotValue('pendant', grade, 1)).toBe(grade)
      expect(accessorySlotValue('bell', grade, 1)).toBe(grade)
      expect(accessorySlotValue('orb', grade, 1)).toBe(2 * grade)
    }
    expect(accessorySlotsParts([slot('insignia', 10), slot('insignia', 5)], 1).insignia).toEqual({ value: 150 })
    expect(['pendant', 'orb'].map((family) => accessorySlotValue(family as AccessoryFamily, 10, 3))).toEqual([26, 52])
    expect(accessorySlotValue('insignia', 10, 1)).toBe(0)
    expect(accessorySlotValue('pendant', 0, 1)).toBe(0)
  })
})

describe('the signature (WP33, UT7, SB15)', () => {
  it('is 0.1 a level × tier (D266), twice that to v19', () => {
    expect([10, 30, 50].map((level) => signatureBonus(level, 1))).toEqual([1, 3, 5])
    expect(signatureBonus(50, 2)).toBe(9)
    expect(signatureBonus(50, 3)).toBe(13)
    expect(signatureBonus(10, 2)).toBe(2)
    expect(signatureBonus(1, 1)).toBe(1)
    expect(signatureBonus(50, 1, 19)).toBe(10)
    expect(signatureBonus(1, 1, 19)).toBe(0)
  })

  it('is worn from G1 of her family, in any slot', () => {
    const grades = newGrades(1)
    grades.accessories = [slot('bell', 0, 'greatsword')]
    expect(signatureWorn(grades, 'bell')).toBe(false)
    grades.accessories = [slot('bell', 1, 'greatsword')]
    expect(signatureWorn(grades, 'bell')).toBe(true)
    expect(signatureWorn(grades, 'orb')).toBe(false)
    expect(signatureWorn(grades, null)).toBe(false)
    expect(signatureWorn({ accessories: [slot('pendant', 3), slot('bell', 2, 'axe')] }, 'bell')).toBe(true)
  })

  it('names her family by her knack, UT7’s five', () => {
    expect(Object.fromEntries(UMA_KNACKS.map((knack) => [knack, ACCESSORY_FAMILY_LABEL[KNACK_FAMILY[knack]]])))
      .toEqual({ fleet: 'Charm', mighty: 'Orb', tireless: 'Pendant', gritty: 'Insignia', clever: 'Insignia' })
  })
})
