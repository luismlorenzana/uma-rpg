// R2's standard presets (H75, D212; weapon-progression §5.8 WP25; uma-templates §3.4 UT8 and the main session's ruling,
// 2026-10-25: UT8 picks the family, SB10 picks the kind). Engine 17 passed explicitly; graded Umas from the v3 fixture.
import { describe, expect, it } from 'vitest'
import { newGrades, type AccessoryFamily, type UmaGrades } from '../economy/grades'
import { RPG_ALL_CLASSES, RPG_CLASS_ARMOR, rpgDefaultWeapons, type RpgClass, type RpgWeapon } from '../rpg/rules'
import { UMA_KNACKS, umaTemplate, type UmaKnack } from '../roster/template'
import { classOf } from './battle'
import { accessorySlot, ECONOMY_V3_NOW as NOW, gradedUma, gradedWorld, TEMPLATE_CASES, templateOutfit } from './economy-v3.fixture'
import { applyClassPreset, CLASS_PRESET_ACCESSORY_V3, classPresetPlan, classPresetV3, presetAccessory, wearClassPreset } from './presets'
import type { Save, TierWorld } from './save'

const V17 = 17
const familyOf = (knack: UmaKnack): AccessoryFamily => umaTemplate(templateOutfit('201', knack, 'physical')).family
const dressed = (classId: RpgClass, knack?: UmaKnack) => presetAccessory(classId, rpgDefaultWeapons(classId, V17), knack && familyOf(knack), V17)

function graded(classId: RpgClass, grades: UmaGrades = newGrades(1), weapons?: RpgWeapon[]): TierWorld {
  const uma = gradedUma({ classId, gear: grades, ...(weapons ? { classes: { [classId]: { weapons, lines: {}, loadout: null } } } : {}) })
  return gradedWorld({ umas: { '101': uma } })
}
const saveOf = (world: TierWorld): Save => ({
  schemaVersion: 29, account: { trainerName: 'Tester', createdAt: NOW, updatedAt: NOW, achievements: {}, history: {}, defeated: {} }, tierWorlds: { '1': world },
})

describe('R2’s standard presets (WP25)', () => {
  it('has WP25’s six Tier 1 rows after SB10', () => {
    expect(Object.fromEntries(RPG_ALL_CLASSES.map((c) => [c, classPresetV3(c, V17).accessory]))).toEqual({
      brawler: { family: 'bell', kind: 'greatsword' },
      mage: { family: 'pendant' },
      spellblade: { family: 'pendant' },
      summoner: { family: 'orb', kind: 'light' },
      paladin: { family: 'pendant' },
      cleric: { family: 'orb', kind: 'ice' },
    })
    for (const c of RPG_ALL_CLASSES) {
      expect(classPresetV3(c, V17)).toMatchObject({ classId: c, weapons: rpgDefaultWeapons(c, V17), armor: RPG_CLASS_ARMOR[c] })
      // A single-kind form sits on one of her weapons' kinds (the Cleric's Blizzard Tome, the Summoner's Light Tome).
      const { kind } = CLASS_PRESET_ACCESSORY_V3[c]
      if (kind) expect(rpgDefaultWeapons(c, V17).map((w) => (w.startsWith('tome-') ? w.slice(5) : w))).toContain(kind)
    }
  })

  it('reads her knack’s family from the fixture’s invented outfits (UT7), on either channel', () => {
    expect(Object.fromEntries(UMA_KNACKS.map((k) => [k, familyOf(k)])))
      .toEqual({ fleet: 'bell', mighty: 'orb', tireless: 'pendant', gritty: 'insignia', clever: 'insignia' })
    for (const { knack } of TEMPLATE_CASES) expect(umaTemplate(templateOutfit('201', knack, 'magical')).family).toBe(familyOf(knack))
  })

  it('wears her signature family (UT8): the family by her knack, the kind by SB10', () => {
    expect(dressed('brawler', 'mighty')).toEqual({ family: 'orb', kind: 'greatsword' })
    expect(dressed('spellblade', 'fleet')).toEqual({ family: 'bell', kind: 'lance' })
    expect(dressed('summoner', 'fleet')).toEqual({ family: 'bell', kind: 'light' })
    expect(dressed('summoner', 'mighty')).toEqual({ family: 'orb', kind: 'light' })
    expect(dressed('cleric', 'tireless')).toEqual({ family: 'pendant' })
    expect(dressed('mage', 'clever')).toEqual({ family: 'insignia' })
    expect(dressed('brawler', 'fleet')).toEqual({ family: 'bell', kind: 'greatsword' })
    // Her lead kind, her first slot's, for anyone but a hybrid; a matched Cleric keeps WP25's Orb · Ice.
    expect(dressed('mage', 'mighty')).toEqual({ family: 'orb', kind: 'fire' })
    expect(dressed('paladin', 'fleet')).toEqual({ family: 'bell', kind: 'greatsword' })
    expect(dressed('cleric', 'fleet')).toEqual({ family: 'bell', kind: 'light' })
    expect(dressed('cleric', 'mighty')).toEqual({ family: 'orb', kind: 'ice' })
    expect(dressed('spellblade', 'mighty')).toEqual({ family: 'orb', kind: 'lance' })
    expect(dressed('spellblade', 'gritty')).toEqual({ family: 'insignia' })
  })

  it('keeps WP25’s form with no template (the balance party)', () => {
    for (const c of RPG_ALL_CLASSES) {
      expect(dressed(c)).toEqual(CLASS_PRESET_ACCESSORY_V3[c])
      expect(presetAccessory(c, rpgDefaultWeapons(c, V17), null, V17)).toEqual(CLASS_PRESET_ACCESSORY_V3[c])
    }
  })

  it('puts a hybrid’s single-kind form on her lead half when her weapons differ', () => {
    // A Spell Blade whose Tome is Fire: the Greatsword twins it; one whose Arms don't twin her Tome: her first Arm.
    expect(presetAccessory('spellblade', ['katana', 'greatsword', 'tome-fire'], 'orb', V17)).toEqual({ family: 'orb', kind: 'greatsword' })
    expect(presetAccessory('spellblade', ['katana', 'bow', 'tome-fire'], 'bell', V17)).toEqual({ family: 'bell', kind: 'katana' })
    // A Summoner (her Tomes lead) with an Axe: her Blizzard Tome twins it.
    expect(presetAccessory('summoner', ['tome-dark', 'tome-ice', 'axe'], 'bell', V17)).toEqual({ family: 'bell', kind: 'ice' })
  })
})

describe('applying R2’s preset to a graded Uma', () => {
  it('sets her weapons and her slot’s form, keeps every grade, binds nothing and counts its changes', () => {
    const grades = newGrades(1)
    grades.weapons = { greatsword: { grade: 7 }, bow: { grade: 3 } }
    grades.armor = { head: { grade: 4 }, feet: { grade: 2 } }
    grades.accessories = [accessorySlot('pendant', 6)]
    const world = graded('brawler', grades, ['bow', 'axe', 'lance'])
    const plan = classPresetPlan(world, '101', 'brawler', V17, familyOf('mighty'))
    expect(plan).toMatchObject({ weapons: ['greatsword', 'axe', 'lance'], wear: {}, binds: [], changes: 2, accessory: { family: 'orb', kind: 'greatsword' } })
    const after = applyClassPreset(world, '101', 'brawler', V17, familyOf('mighty'))
    const uma = after.umas['101']!
    expect(classOf(uma, 'brawler').weapons).toEqual(['greatsword', 'axe', 'lance'])
    expect(uma.gear).toEqual({ ...grades, accessories: [accessorySlot('orb', 6, 'greatsword')] })
    expect(after.items).toEqual(world.items)
    expect(classPresetPlan(after, '101', 'brawler', V17, familyOf('mighty')).changes).toBe(0)
    expect(applyClassPreset(after, '101', 'brawler', V17, familyOf('mighty'))).toBe(after)
  })

  it('counts only her slot when her weapons are already the preset’s, and drops a kind a Pendant has none of', () => {
    const grades = newGrades(1)
    grades.accessories = [accessorySlot('orb', 3, 'dark')]
    const world = graded('mage', grades)
    expect(classPresetPlan(world, '101', 'mage', V17).changes).toBe(1)
    const save = wearClassPreset(saveOf(world), '101', 'mage', '2026-10-25T12:05:00.000Z', '1', V17)
    expect(save.tierWorlds['1']!.umas['101']!.gear).toEqual({ ...grades, accessories: [accessorySlot('pendant', 3)] })
    expect(save.account.updatedAt).toBe('2026-10-25T12:05:00.000Z')
    expect(wearClassPreset(save, '101', 'mage', NOW, '1', V17)).toBe(save)
  })

  it('dresses a fresh Uma’s G0 slot in her family, a Fleet Spell Blade’s Bell on her Lance', () => {
    const world = graded('spellblade')
    const after = applyClassPreset(world, '101', 'spellblade', V17, familyOf('fleet'))
    expect(after.umas['101']!.gear).toEqual({ ...newGrades(1), accessories: [accessorySlot('bell', 0, 'lance')] })
  })
})
