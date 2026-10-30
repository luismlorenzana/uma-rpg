import { newGrades, newOwnedUma, newSave, worldOf, type AccessorySlotState, type OwnedUma, type RpgClass, type RpgWeapon, type TierWorld } from '@rpg/domain'
import { describe, expect, it } from 'vitest'
import { accessoryCards, cardButton, cardKind, presetRows, readyCount, upgradeRows } from './gear-equip'

const slot = (grade: number, family: AccessorySlotState['family'] = null, kind?: AccessorySlotState['kind']): AccessorySlotState =>
  ({ grade, family, form: 'base', ...(kind ? { kind } : {}) })
const SPELL_BLADE = ['katana', 'lance', 'lightning'] as const

describe('the Equip view (H107)', () => {
  it('draws four cards of one shape: her signature first with ★, then Pendant, Charm, Orb, Insignia', () => {
    const cards = accessoryCards(slot(1, 'pendant'), SPELL_BLADE, 'orb', 50, 1)
    expect(cards.map((c) => c.family)).toEqual(['orb', 'pendant', 'bell', 'insignia'])
    expect(cards.map((c) => c.signature)).toEqual(['★ Signature · ATK/M.ATK +10 · Not worn', null, null, null])
    // A kind row only on the Orb: her three, labelled by weapon.
    expect(cards.map((c) => c.kinds.map((k) => k.label))).toEqual([['Katana', 'Lance', 'Thunder Tome'], [], [], []])
    expect(cards.filter((c) => c.wearing).map((c) => c.family)).toEqual(['pendant'])
  })

  it('says what each family does at the slot\'s grade, and what G1 gives at G0', () => {
    const at = (grade: number) => accessoryCards(slot(grade), SPELL_BLADE, 'bell', 30, 1).map((c) => c.effect)
    expect(at(3)).toEqual(['M.ATK +2', 'ATK +2', 'Kind +2', 'Bosses +1.5%'])
    expect(at(0)[0]).toBe('G1: M.ATK +1')
  })

  it('gives every card one button: Equip, Equipped, or Switch on the family she wears', () => {
    const [orb0, pendant] = accessoryCards(slot(2, 'orb', 'lance'), SPELL_BLADE, 'orb', 30, 1)
    expect(cardKind(orb0!)).toBe('lance')
    expect(cardButton(orb0!, 'lance')).toEqual({ label: 'Set', disabled: true })
    expect(cardButton(orb0!, 'katana')).toEqual({ label: 'Set', disabled: false })
    expect(cardButton(pendant!, null)).toEqual({ label: 'Set', disabled: false })
    const insignia = accessoryCards(slot(2, 'insignia'), SPELL_BLADE, 'bell', 30, 1).find((c) => c.family === 'insignia')!
    expect(cardButton(insignia, null)).toEqual({ label: 'Set', disabled: true })
    const orb = accessoryCards(slot(2), SPELL_BLADE, 'bell', 30, 1).find((c) => c.family === 'orb')!
    expect([cardKind(orb), cardButton(orb, 'katana')]).toEqual(['katana', { label: 'Set', disabled: false }])
  })

  it('flags an Orb left on a kind she no longer holds, and starts its chips on her first', () => {
    const orb = accessoryCards(slot(4, 'orb', 'dark'), SPELL_BLADE, 'bell', 30, 1).find((c) => c.family === 'orb')!
    expect(orb.stale).toBe('Dark Tome not held')
    expect(cardKind(orb)).toBe('katana')
    expect(cardButton(orb, 'katana')).toEqual({ label: 'Set', disabled: false })
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
      { pick: 'paladin', title: 'Standard preset', detail: 'Lance · Greatsword · Light Tome', on: false },
    ])
    expect(presetRows(world('paladin', ['lance', 'greatsword', 'tome-light']), '101', 'paladin', 'bell')[0]!.detail).toBe('Lance · Greatsword · Light Tome')
  })

  it('shows a Tier 0 one preset for each class it promotes into, named after it', () => {
    expect(presetRows(world('duelist'), '101', 'duelist', 'pendant')).toEqual([
      { pick: 'spellblade', title: 'Arms Spellblade', detail: 'Katana · Axe · Thunder Tome', on: false },
      { pick: 'tomeblade', title: 'Tome Spellblade', detail: 'Thunder Tome · Blizzard Tome · Katana', on: false },
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
