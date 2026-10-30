import { newGrades, type AccessorySlotState } from '@rpg/domain'
import { describe, expect, it } from 'vitest'
import { accessoryCards, cardButton, cardKind, readyCount, upgradeRows } from './gear-equip'

const slot = (grade: number, family: AccessorySlotState['family'] = null, kind?: AccessorySlotState['kind']): AccessorySlotState =>
  ({ grade, family, form: 'base', ...(kind ? { kind } : {}) })
const SPELL_BLADE = ['katana', 'lance', 'lightning'] as const

describe('the Equip view (H107)', () => {
  it('draws four cards of one shape: her signature first with ★, then Bell, Pendant, Orb, Insignia', () => {
    const cards = accessoryCards(slot(1, 'pendant'), SPELL_BLADE, 'orb', 50, 1)
    expect(cards.map((c) => c.family)).toEqual(['orb', 'bell', 'pendant', 'insignia'])
    expect(cards.map((c) => c.signature)).toEqual(['★ Signature · ATK/M.ATK +10 · Not worn', null, null, null])
    // A kind row only on the Bell and the Orb: her three, labelled by weapon.
    expect(cards.map((c) => c.kinds.map((k) => k.label))).toEqual([
      ['Katana', 'Lance', 'Thunder Tome'], ['Katana', 'Lance', 'Thunder Tome'], [], [],
    ])
    expect(cards.filter((c) => c.wearing).map((c) => c.family)).toEqual(['pendant'])
  })

  it('says what each family does at the slot\'s grade, and what G1 gives at G0', () => {
    const at = (grade: number) => accessoryCards(slot(grade), SPELL_BLADE, 'bell', 30, 1).map((c) => c.effect)
    expect(at(3)).toEqual([
      'Extra hit ×0.3',
      expect.stringMatching(/^\+\d+ · 3 kinds$/),
      expect.stringMatching(/^Kind \+\d+$/),
      'Bosses +4.5%',
    ])
    expect(at(0)[0]).toBe('G1: Extra hit ×0.1')
  })

  it('gives every card one button: Equip, Equipped, or Switch on the family she wears', () => {
    const [bell, pendant] = accessoryCards(slot(2, 'bell', 'lance'), SPELL_BLADE, 'bell', 30, 1)
    expect(cardKind(bell!)).toBe('lance')
    expect(cardButton(bell!, 'lance')).toEqual({ label: 'Set', disabled: true })
    expect(cardButton(bell!, 'katana')).toEqual({ label: 'Set', disabled: false })
    expect(cardButton(pendant!, null)).toEqual({ label: 'Set', disabled: false })
    const insignia = accessoryCards(slot(2, 'insignia'), SPELL_BLADE, 'bell', 30, 1).find((c) => c.family === 'insignia')!
    expect(cardButton(insignia, null)).toEqual({ label: 'Set', disabled: true })
    const orb = accessoryCards(slot(2), SPELL_BLADE, 'bell', 30, 1).find((c) => c.family === 'orb')!
    expect([cardKind(orb), cardButton(orb, 'katana')]).toEqual(['katana', { label: 'Set', disabled: false }])
  })

  it('flags an Orb or a Bell left on a kind she no longer holds, and starts its chips on her first', () => {
    const orb = accessoryCards(slot(4, 'orb', 'dark'), SPELL_BLADE, 'bell', 30, 1).find((c) => c.family === 'orb')!
    expect(orb.stale).toBe('Dark Tome not held')
    expect(cardKind(orb)).toBe('katana')
    expect(cardButton(orb, 'katana')).toEqual({ label: 'Set', disabled: false })
  })
})

describe('the Upgrade view (H107)', () => {
  it('lists her three weapons, five armor slots and the accessory, and counts what can raise now', () => {
    const grades = newGrades(1)
    // Her Arms take Arms Gems and her Tome Tome Ink (FL4).
    const rows = upgradeRows(grades, ['katana', 'lance', 'tome-lightning'], 'spellblade', 30, { 'weapon-gem-g1': 1, 'tome-ink-g1': 1, 'armor-fittings-g1': 1 }, 1, 'bell')
    expect(rows.map((r) => r.key)).toEqual(['katana', 'lance', 'tome-lightning', 'head', 'body', 'legs', 'arms', 'feet', 'accessory-0'])
    expect(rows[0]!.upgrade).toMatchObject({ ready: true, label: 'G0 → G1 · Arms Gem G1 ×1' })
    expect(rows.at(-1)!.upgrade).toMatchObject({ ready: false })
    expect(readyCount(rows)).toBe(8)
  })
})
