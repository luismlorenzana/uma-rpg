import { newGrades } from '@rpg/domain'
import { describe, expect, it } from 'vitest'
import { accessoryGradeLine, weaponGradeLine } from './gear-v3'

describe('R2 gear lines', () => {
  it('writes a weapon\'s and an accessory\'s line from grades', () => {
    const grades = newGrades(1)
    grades.weapons.greatsword = { grade: 7 }
    grades.accessories[0] = { grade: 6, family: 'bell', form: 'base' }
    expect(weaponGradeLine(grades, 'greatsword', 1)).toBe('Greatsword · G7 · Might 35')
    expect(accessoryGradeLine(grades.accessories[0], ['greatsword', 'axe', 'lance'], 1, 'bell', 30))
      .toBe('Charm · G6 · M.ATK +6 · ★ +3')
    expect(accessoryGradeLine({ grade: 0, family: null, form: 'base' }, ['greatsword'], 1, 'bell', 30))
      .toBe('None · G0')
    expect(accessoryGradeLine({ grade: 1, family: null, form: 'base' }, ['greatsword'], 1, 'bell', 30))
      .toBe('None · G1')
    expect(accessoryGradeLine({ grade: 0, family: 'bell', form: 'base' }, ['katana'], 1, 'bell', 50))
      .toBe('Charm · G0 · Off')
  })
})
