import { newGrades } from '@rpg/domain'
import { describe, expect, it } from 'vitest'
import { accessoryGradeLine, armorGradeLine, gradeUpgradeView, weaponGradeLine } from './gear-v3'

describe('R2 gear rows', () => {
  it('writes weapon, armor, accessory and upgrade lines from grades', () => {
    const grades = newGrades(1)
    grades.weapons.greatsword = { grade: 7 }
    grades.armor.head = { grade: 4 }
    grades.armor.feet = { grade: 4 }
    grades.accessories[0] = { grade: 6, family: 'bell', form: 'base', kind: 'greatsword' }
    expect(weaponGradeLine(grades, 'greatsword', 1)).toBe('Greatsword · G7 · Might 35 · weak ×1.3')
    expect(armorGradeLine(grades, 'head', 'brawler', 1)).toBe('Head · Helm · G4 · DEF +16')
    expect(armorGradeLine(grades, 'feet', 'brawler', 1)).toBe('Feet · Boots · G4 · Evasion 4.8%')
    expect(accessoryGradeLine(grades.accessories[0], ['greatsword', 'axe', 'lance'], 1, 'bell', 30))
      .toBe('Bell · Greatsword · G6 · after her Attack, her Greatsword at 0.6 · ★ +6')
    expect(accessoryGradeLine({ grade: 1, family: null, form: 'base' }, ['greatsword'], 1, 'bell', 30))
      .toBe('Accessory · G1 · Pick a form')
    expect(gradeUpgradeView(grades, { kind: 'armor', slot: 'head' }, 21, { 'armor-fittings-g5': 1 })).toMatchObject({
      ready: true, label: 'G4 → G5 · 1 Armor Fittings G5', block: null,
    })
    expect(gradeUpgradeView(grades, { kind: 'armor', slot: 'head' }, 20, { 'armor-fittings-g5': 1 }).block).toBe('Needs Lv 21')
  })
})
