import { describe, expect, it } from 'vitest'
import { gradeOf, newGrades, type GradeTarget } from '../economy/grades'
import { raiseGrade, raiseGradeTo } from './forge'
import { ECONOMY_V3_NOW as NOW, gradedUma, gradedWorld } from './economy-v3.fixture'
import { SaveRuleError } from './rules'
import { type Save } from './save'

const weapon: GradeTarget = { kind: 'weapon', weapon: 'greatsword' }
const saveOf = (items: Record<string, number>, level = 1, gear = newGrades(1)): Save => ({
  schemaVersion: 26,
  account: { trainerName: 'Tester', createdAt: NOW, updatedAt: NOW, achievements: {}, history: {}, defeated: {} },
  tierWorlds: { '1': gradedWorld({ items, umas: { '101': gradedUma({ level, gear }) } }) },
})
const world = (save: Save) => save.tierWorlds['1']!

describe('graded Forge rules (R2)', () => {
  it('raises one grade, consumes one item and deletes its last count', () => {
    let save = saveOf({ 'weapon-gem-g1': 2 })
    save = raiseGrade(save, '101', weapon, NOW)
    expect(gradeOf(world(save).umas['101']!.gear as ReturnType<typeof newGrades>, weapon)).toBe(1)
    expect(world(save).items).toEqual({ 'weapon-gem-g1': 1 })
    const other = saveOf({ 'weapon-gem-g1': 1 })
    expect(world(raiseGrade(other, '101', weapon, NOW)).items).toEqual({})
  })

  it('gates by level and names the missing next gem', () => {
    const grades = newGrades(1)
    grades.weapons.greatsword = { grade: 1 }
    expect(() => raiseGrade(saveOf({ 'weapon-gem-g2': 1 }, 5, grades), '101', weapon, NOW)).toThrow('Needs Lv 6')
    expect(() => raiseGrade(saveOf({}, 6, grades), '101', weapon, NOW)).toThrow('Needs 1 Weapon Gem G2')
    expect(gradeOf(world(raiseGrade(saveOf({ 'weapon-gem-g2': 1 }, 6, grades), '101', weapon, NOW)).umas['101']!.gear as ReturnType<typeof newGrades>, weapon)).toBe(2)
  })

  it('climbs atomically and lists the missing grades before taking anything', () => {
    const grades = newGrades(1)
    grades.weapons.greatsword = { grade: 1 }
    const stock = { 'weapon-gem-g2': 1, 'weapon-gem-g3': 1, 'weapon-gem-g4': 1 }
    expect(world(raiseGradeTo(saveOf(stock, 16, grades), '101', weapon, 4, NOW)).items).toEqual({})
    const missing = saveOf({ 'weapon-gem-g2': 1, 'weapon-gem-g4': 1 }, 16, grades)
    expect(() => raiseGradeTo(missing, '101', weapon, 4, NOW)).toThrow('Needs Weapon Gems G3')
    expect(world(missing).items).toEqual({ 'weapon-gem-g2': 1, 'weapon-gem-g4': 1 })
    expect(gradeOf(world(missing).umas['101']!.gear as ReturnType<typeof newGrades>, weapon)).toBe(1)
  })

  it('keeps a weapon grade across classes, caps at G10 and raises armor and accessories with their items', () => {
    const grades = newGrades(1)
    grades.weapons.greatsword = { grade: 10 }
    const capped = saveOf({}, 50, grades)
    expect(() => raiseGrade(capped, '101', weapon, NOW)).toThrow('Already G10')
    expect(gradeOf(grades, weapon)).toBe(10)
    expect(gradeOf({ ...grades }, weapon)).toBe(10) // the same kind is shared by every class that slots it

    let save = saveOf({ 'armor-fittings-g1': 1, 'accessory-setting-g1': 1 })
    save = raiseGrade(save, '101', { kind: 'armor', slot: 'body' }, NOW)
    save = raiseGrade(save, '101', { kind: 'accessory', slot: 0 }, NOW)
    const raised = world(save).umas['101']!.gear as ReturnType<typeof newGrades>
    expect(raised.armor.body?.grade).toBe(1)
    expect(raised.accessories[0]?.grade).toBe(1)
    expect(world(save).items).toEqual({})
  })

  it('refuses legacy gear without changing it', () => {
    const legacy = gradedUma({ gear: { locker: [], equipped: {}, kinds: {} } })
    const save = saveOf({ 'weapon-gem-g1': 1 }, 1, legacy.gear as never)
    expect(() => raiseGrade(save, '101', weapon, NOW)).toThrowError(new SaveRuleError('bad-job', 'Not graded'))
  })
})
