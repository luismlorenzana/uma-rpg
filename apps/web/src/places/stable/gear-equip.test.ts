import { newGrades, newOwnedUma, newSave, worldOf, type AccessorySlotState, type OwnedUma, type RpgClass, type RpgWeapon, type TierWorld } from '@rpg/domain'
import { describe, expect, it } from 'vitest'
import { accessoryChoices, accessoryTile, presetRows, readyCount, upgradeRows } from './gear-equip'

const slot = (grade: number, family: AccessorySlotState['family'] = null, kind?: AccessorySlotState['kind']): AccessorySlotState =>
  ({ grade, family, form: 'base', ...(kind ? { kind } : {}) })
const SPELL_BLADE = ['katana', 'lance', 'lightning'] as const

describe('the Equip view (H107, D266)', () => {
  it('lists every choice as one row: her signature first with ★, then Pendant, Charm, an Orb a kind, Insignia', () => {
    const rows = accessoryChoices(slot(1, 'pendant'), SPELL_BLADE, 'orb', 1)
    expect(rows.map((r) => [r.family, r.kind])).toEqual([['orb', 'katana'], ['orb', 'lance'], ['orb', 'lightning'], ['pendant', null], ['bell', null], ['insignia', null]])
    expect(rows.filter((r) => r.signature).map((r) => r.family)).toEqual(['orb', 'orb', 'orb'])
    expect(rows.filter((r) => r.worn).map((r) => r.family)).toEqual(['pendant'])
  })

  it('says what each row does at the slot\'s grade, and what G1 gives at G0', () => {
    const at = (grade: number) => accessoryChoices(slot(grade), SPELL_BLADE, 'bell', 1).map((r) => r.effect)
    expect(at(3)).toEqual(['M.ATK +3', 'ATK +3', 'Katana +6', 'Lance +6', 'Lightning +6', 'Bosses +3%'])
    expect(at(0)[0]).toBe('G1: M.ATK +1')
  })

  it('marks only the kind an Orb is worn on', () => {
    const worn = accessoryChoices(slot(2, 'orb', 'lance'), SPELL_BLADE, 'orb', 1).filter((r) => r.worn)
    expect(worn.map((r) => r.kind)).toEqual(['lance'])
  })

  it('draws a tile for what the slot holds, says Off at G0 and Empty without a family', () => {
    expect(accessoryTile(slot(4, 'pendant'), SPELL_BLADE, 1)).toEqual({ text: 'ATK +4', stale: null })
    expect(accessoryTile(slot(4, 'orb', 'lance'), SPELL_BLADE, 1)).toEqual({ text: 'Lance +8', stale: null })
    expect(accessoryTile(slot(0, 'bell'), SPELL_BLADE, 1)).toEqual({ text: 'Charm · Off', stale: null })
    expect(accessoryTile(slot(0), SPELL_BLADE, 1)).toEqual({ text: 'Empty', stale: null })
  })

  it('flags an Orb left on a kind she no longer holds', () => {
    expect(accessoryTile(slot(4, 'orb', 'dark'), SPELL_BLADE, 1).stale).toBe('Dark Tome not held')
    expect(accessoryChoices(slot(4, 'orb', 'dark'), SPELL_BLADE, 'bell', 1).some((r) => r.worn)).toBe(false)
  })
})

describe('the Upgrade view (H107)', () => {
  it('lists her three weapons, five armor slots and three accessory slots, and counts what can raise now', () => {
    const grades = newGrades(1)
    // Her Arms take Arms Gems and her Tome Tome Ink (FL4).
    const rows = upgradeRows(grades, ['katana', 'lance', 'tome-lightning'], 'spellblade', 30, { 'weapon-gem-g1': 1, 'tome-ink-g1': 1, 'armor-fittings-g1': 1 }, 1, 'bell')
    expect(rows.map((r) => r.key)).toEqual(['katana', 'lance', 'tome-lightning', 'head', 'body', 'legs', 'arms', 'feet', 'accessory-0', 'accessory-1', 'accessory-2'])
    expect(rows[0]!.upgrade).toMatchObject({ ready: true, label: 'G0 → G1 · Arms Gem G1 ×1' })
    expect(rows.at(-1)!.upgrade).toMatchObject({ ready: false })
    expect(readyCount(rows)).toBe(8)
  })
})

describe('the standard presets (D263)', () => {
  const world = (classId: RpgClass, weapons?: RpgWeapon[]): TierWorld => {
    const uma: OwnedUma = { ...newOwnedUma('2026-10-30T00:00:00.000Z'), classId, gear: newGrades(1),
      ...(weapons ? { classes: { [classId]: { weapons, lines: {}, loadout: null } } } : {}) }
    return { ...worldOf(newSave('Presets', '2026-10-30T00:00:00.000Z')), umas: { '101': uma } }
  }

  it('shows a Tier 1 class its one preset, under the standard name', () => {
    expect(presetRows(world('paladin'), '101', 'paladin', 'pendant')).toEqual([
      { pick: 'paladin', title: 'Standard preset', detail: 'Lance · Greatsword · Light Tome', accessories: 'Pendant · Pendant · Orb', on: false },
    ])
    expect(presetRows(world('paladin', ['lance', 'greatsword', 'tome-light']), '101', 'paladin', 'bell')[0]!.detail).toBe('Lance · Greatsword · Light Tome')
  })

  it('shows a Tier 0 one preset for each class it promotes into, named after it', () => {
    expect(presetRows(world('duelist'), '101', 'duelist', 'pendant')).toEqual([
      { pick: 'spellblade', title: 'Arms Spellblade', detail: 'Katana · Axe · Thunder Tome', accessories: 'Pendant · Pendant · Orb', on: false },
      { pick: 'tomeblade', title: 'Tome Spellblade', detail: 'Thunder Tome · Blizzard Tome · Katana', accessories: 'Pendant · Charm · Orb', on: false },
    ])
    expect(presetRows(world('recruit'), '101', 'recruit', 'bell').map((r) => r.title)).toEqual(['Brawler', 'Arms Spellblade', 'Arms Summoner'])
  })

  it('marks the one she wears', () => {
    const on = { ...world('acolyte', ['tome-light', 'tome-fire', 'lance']) }
    on.umas['101'] = { ...on.umas['101']!, gear: { ...newGrades(1), accessories: [{ grade: 0, family: 'orb', form: 'base', kind: 'light' },
      { grade: 0, family: 'bell', form: 'base' }, { grade: 0, family: 'bell', form: 'base' }] } }
    expect(presetRows(on, '101', 'acolyte', 'orb').map((r) => [r.title, r.on])).toEqual([['Paladin', false], ['Cleric · On', true]])
  })
})
