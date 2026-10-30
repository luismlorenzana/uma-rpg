import { describe, expect, it } from 'vitest'
import { SAVE_SCHEMA_VERSION } from './version'
import { gradeOf, newGrades, type GradeTarget } from '../economy/grades'
import { RPG_V2_CLASSES } from '../rpg/rules'
import { accessoryFormBlock, accessoryKinds, raiseGrade, raiseGradeTo, setAccessoryForm } from './forge'
import { classPresetV3 } from './presets'
import { accessorySlot, ECONOMY_V3_NOW as NOW, gradedUma, gradedWorld } from './economy-v3.fixture'
import { SaveRuleError } from './rules'
import { type Save } from './save'

const weapon: GradeTarget = { kind: 'weapon', weapon: 'greatsword' }
const saveOf = (items: Record<string, number>, level = 1, gear = newGrades(1)): Save => ({
  schemaVersion: SAVE_SCHEMA_VERSION,
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
    expect(() => raiseGrade(saveOf({}, 6, grades), '101', weapon, NOW)).toThrow('Needs 1 Arms Gem G2')
    expect(gradeOf(world(raiseGrade(saveOf({ 'weapon-gem-g2': 1 }, 6, grades), '101', weapon, NOW)).umas['101']!.gear as ReturnType<typeof newGrades>, weapon)).toBe(2)
  })

  it('climbs atomically and lists the missing grades before taking anything', () => {
    const grades = newGrades(1)
    grades.weapons.greatsword = { grade: 1 }
    const stock = { 'weapon-gem-g2': 1, 'weapon-gem-g3': 1, 'weapon-gem-g4': 1 }
    expect(world(raiseGradeTo(saveOf(stock, 16, grades), '101', weapon, 4, NOW)).items).toEqual({})
    const missing = saveOf({ 'weapon-gem-g2': 1, 'weapon-gem-g4': 1 }, 16, grades)
    expect(() => raiseGradeTo(missing, '101', weapon, 4, NOW)).toThrow('Needs Arms Gems G3')
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

describe('setting the accessory slot’s form (R2, H75)', () => {
  const graded = (level = 30) => {
    const grades = newGrades(1)
    grades.accessories = [accessorySlot('pendant', 6)]
    return saveOf({}, level, grades)
  }
  const slotOf = (save: Save) => (world(save).umas['101']!.gear as ReturnType<typeof newGrades>).accessories
  const refusal = (fn: () => unknown) => {
    try { fn(); return null } catch (err) { return err instanceof SaveRuleError ? `${err.reason}: ${err.message}` : String(err) }
  }

  it('changes the family and kind and keeps the grade', () => {
    let save = setAccessoryForm(graded(), '101', 'brawler', 0, 'orb', 'lance', NOW)
    expect(slotOf(save)).toEqual([accessorySlot('orb', 6, 'lance')])
    save = setAccessoryForm(save, '101', 'brawler', 0, 'bell', undefined, NOW)
    expect(slotOf(save)).toEqual([accessorySlot('bell', 6)])
    save = setAccessoryForm(save, '101', 'brawler', 0, 'insignia', undefined, NOW)
    expect(slotOf(save)).toEqual([accessorySlot('insignia', 6)])
    save = setAccessoryForm(save, '101', 'brawler', 0, null, undefined, NOW)
    expect(slotOf(save)).toEqual([accessorySlot(null, 6)])
    expect(world(save).items).toEqual({})
  })

  it('checks an Orb against the class she names since H107 (WP22, D219): only a kind she can hit with', () => {
    expect(accessoryKinds(world(graded()).umas['101']!, 'brawler')).toEqual(['greatsword', 'axe', 'lance'])
    expect(accessoryKinds(world(graded()).umas['101']!, 'mage')).toEqual(['fire', 'ice', 'lightning'])
    expect(slotOf(setAccessoryForm(graded(), '101', 'mage', 0, 'orb', 'ice', NOW))).toEqual([accessorySlot('orb', 6, 'ice')])
    expect(refusal(() => setAccessoryForm(graded(), '101', 'brawler', 0, 'orb', 'dark', NOW))).toBe('bad-loadout: No Dark Tome in her slots')
    expect(refusal(() => setAccessoryForm(graded(), '101', 'mage', 0, 'orb', 'bow', NOW))).toBe('bad-loadout: No Bow in her slots')
    // Every class's preset Orb or Bell sits on one of her kinds.
    for (const classId of RPG_V2_CLASSES) {
      const form = classPresetV3(classId).accessory
      if (form.kind) expect(accessoryKinds(world(graded()).umas['101']!, classId)).toContain(form.kind)
    }
  })

  it('refuses what three slots of base forms can’t hold', () => {
    const save = graded()
    expect(refusal(() => setAccessoryForm(save, '101', 'brawler', 0, 'talisman' as never, undefined, NOW))).toBe('bad-loadout: Unknown accessory')
    expect(refusal(() => setAccessoryForm(save, '101', 'brawler', 3, 'pendant', undefined, NOW))).toBe('bad-loadout: No such accessory slot')
    expect(refusal(() => setAccessoryForm(save, '101', 'brawler', -1, 'pendant', undefined, NOW))).toBe('bad-loadout: No such accessory slot')
    expect(refusal(() => setAccessoryForm(save, '101', 'brawler', 0, 'orb', undefined, NOW))).toBe('bad-loadout: An Orb needs a kind')
    expect(refusal(() => setAccessoryForm(save, '101', 'brawler', 0, 'bell', 'axe', NOW))).toBe('bad-loadout: A Charm has no kind')
    expect(refusal(() => setAccessoryForm(save, '101', 'brawler', 0, 'pendant', 'axe', NOW))).toBe('bad-loadout: A Pendant has no kind')
    expect(refusal(() => setAccessoryForm(save, '101', 'brawler', 0, 'insignia', 'axe', NOW))).toBe('bad-loadout: An Insignia has no kind')
    expect(refusal(() => setAccessoryForm(save, '101', 'brawler', 0, null, 'axe', NOW))).toBe('bad-loadout: Pick an accessory first')
    expect(refusal(() => setAccessoryForm(save, '101', 'brawler', 0, 'orb', 'shield' as never, NOW))).toBe('bad-loadout: Unknown kind')
    expect(refusal(() => setAccessoryForm(save, '999', 'brawler', 0, 'pendant', undefined, NOW))).toBe('not-owned: Not unlocked')
    expect(refusal(() => setAccessoryForm(save, '101', 'bard' as never, 0, 'pendant', undefined, NOW))).toBe('bad-class: no class bard')
    const legacy = saveOf({}, 1, { locker: [], equipped: {}, kinds: {} } as never)
    expect(refusal(() => setAccessoryForm(legacy, '101', 'brawler', 0, 'pendant', undefined, NOW))).toBe('bad-loadout: Not graded')
    expect(accessoryFormBlock(world(legacy).umas['101']!, 'brawler', 0, 'pendant', undefined)).toBe('Not graded')
    expect(slotOf(save)).toEqual([accessorySlot('pendant', 6)])
  })

  it('sets each slot on its own, the same family twice if she likes, and raises one grade at a time', () => {
    let save = saveOf({}, 1, { ...newGrades(1), accessories: [accessorySlot('orb', 6, 'axe'), accessorySlot(null, 2), accessorySlot(null, 0)] })
    save = setAccessoryForm(save, '101', 'brawler', 1, 'orb', 'axe', NOW)
    save = setAccessoryForm(save, '101', 'brawler', 2, 'pendant', undefined, NOW)
    expect(slotOf(save)).toEqual([accessorySlot('orb', 6, 'axe'), accessorySlot('orb', 2, 'axe'), accessorySlot('pendant', 0)])
  })

  it('leaves an Orb on a kind she no longer slots set', () => {
    const save = setAccessoryForm(graded(), '101', 'brawler', 0, 'orb', 'greatsword', NOW)
    expect(accessoryFormBlock(world(save).umas['101']!, 'mage', 0, 'orb', 'greatsword')).toBe('No Greatsword in her slots')
    expect(slotOf(save)).toEqual([accessorySlot('orb', 6, 'greatsword')])
})
})
