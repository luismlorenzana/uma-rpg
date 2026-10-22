// Classes v2's accessories, built dark (H57, classes-v2.md §6): flat Orbs, the retuned supports and the typed slots, each
// read by the generation. v1 (engine 14, the live game until H61) must stay today's, byte for byte.
import { describe, expect, it } from 'vitest'
import {
  ACCESSORY_TYPES, accessoryEffects, accessoryFits, accessorySlotFor, CHARM_PER_GRADE, charmEffect, charmPerGrade, EQUIP_TYPES, equippedAccessories,
  gearById, gearId, isAccessory, isOrb, MIGHT_BY_GRADE, noAccessoryEffects, ORB_OFFENSE_BY_GRADE, orbKind, orbOffense, type AccessoryEffects,
  type AccessoryType,
} from './gear'
import { ACCESSORY_SLOT_LABEL, ACCESSORY_SLOTS } from './ranks'

/** Today's effects of one accessory, written out from D124 and D141 so a change to v1 shows here. */
function todays(type: AccessoryType, g: number): AccessoryEffects {
  const out = noAccessoryEffects()
  if (isOrb(type)) { out.orbs.push(orbKind(type)); return out }
  const [field, perGrade] = ({
    vital: ['regen', 5], vampire: ['lifesteal', 20], bulwark: ['barrier', 20], iron: ['guard', 15], thorn: ['thorns', 30],
    spring: ['mpRegen', 1], siphon: ['mpSteal', 5], veil: ['veil', 20], ward: ['resist', 15], mirror: ['mirror', 30],
  } as const)[charmEffect(type)]
  out[field] = perGrade * g
  return out
}
const piece = (type: AccessoryType, g: number) => gearById(gearId(type, g))!

describe('flat Orbs (classes v2 §6.2, C4)', () => {
  it('adds half a weapon’s Might at its grade, rounded up: +34 at grade 10', () => {
    expect(ORB_OFFENSE_BY_GRADE).toEqual([0, 1, 2, 4, 6, 10, 13, 18, 23, 29, 34])
    expect(ORB_OFFENSE_BY_GRADE).toEqual(MIGHT_BY_GRADE.map((m) => Math.ceil(m / 2)))
    expect([1, 5, 10].map(orbOffense)).toEqual([1, 10, 34])
    expect(orbOffense(0)).toBe(0)
    expect(orbOffense(12)).toBe(34)
  })

  it('carries an Orb’s offense on its kind in `orbMight`, and no kinds in `orbs`', () => {
    expect(accessoryEffects(piece('orb-fire', 10), 15)).toEqual({ ...noAccessoryEffects(), orbMight: { fire: 34 } })
    expect(accessoryEffects(piece('orb-greatsword', 3), 15)).toMatchObject({ orbs: [], orbMight: { greatsword: 4 } })
    const worn = equippedAccessories({ 'accessory-1': 'orb-katana-g7', 'accessory-2': 'talisman-vampire-g10' }, 15)
    expect(worn).toEqual({ ...noAccessoryEffects(), orbMight: { katana: 18 }, lifesteal: 200 })
    // Without an Orb there's nothing to add.
    expect(equippedAccessories({}, 15)).toEqual(noAccessoryEffects())
    expect(accessoryEffects(piece('talisman-iron', 2), 15)).toEqual({ ...noAccessoryEffects(), guard: 30 })
  })
})

describe('the support accessories (classes v2 §6.3)', () => {
  it('raises the Vital Talisman to 6% and the Siphon Amulet to 8% at grade 10, and keeps the other eight', () => {
    expect(accessoryEffects(piece('talisman-vital', 10), 15).regen).toBe(60)
    expect(accessoryEffects(piece('amulet-siphon', 10), 15).mpSteal).toBe(80)
    expect(accessoryEffects(piece('talisman-vital', 10), 14).regen).toBe(50)
    expect(accessoryEffects(piece('amulet-siphon', 10), 14).mpSteal).toBe(50)
    expect(charmPerGrade(15)).toEqual({ ...charmPerGrade(14), vital: 6, siphon: 8 })
    for (const type of ACCESSORY_TYPES.filter((t) => !isOrb(t) && t !== 'talisman-vital' && t !== 'amulet-siphon')) {
      expect(accessoryEffects(piece(type, 10), 15), type).toEqual(accessoryEffects(piece(type, 10), 14))
    }
  })
})

describe('v1 accessories stay today’s (D124, D141)', () => {
  it('gives every one of the twenty types today’s effects at every grade, live and at engine 14', () => {
    expect(ACCESSORY_TYPES).toHaveLength(20)
    for (const type of ACCESSORY_TYPES) {
      for (let g = 1; g <= 10; g++) {
        expect(accessoryEffects(piece(type, g), 14), `${type} G${g}`).toEqual(todays(type, g))
        expect(accessoryEffects(piece(type, g)), `${type} G${g}`).toEqual(todays(type, g))
      }
    }
    expect(accessoryEffects(piece('orb-fire', 10))).not.toHaveProperty('orbMight')
    expect(equippedAccessories({ 'accessory-1': 'orb-lance-g1', 'accessory-2': 'orb-fire-g4' })).toEqual({ ...noAccessoryEffects(), orbs: ['lance', 'fire'] })
    expect(CHARM_PER_GRADE).toEqual({ vital: 5, vampire: 20, bulwark: 20, iron: 15, thorn: 30, spring: 1, siphon: 5, veil: 20, ward: 15, mirror: 30 })
  })
})

describe('typed accessory slots (classes v2 §6.1, C10)', () => {
  it('puts an Orb in the Damage slot and a Talisman or an Amulet in the Support slot from v15; either before', () => {
    for (const type of ACCESSORY_TYPES) {
      expect(accessorySlotFor(type, 14), type).toBeNull()
      expect(accessorySlotFor(type), type).toBeNull()
      expect(accessorySlotFor(type, 15), type).toBe(isOrb(type) ? 'accessory-1' : 'accessory-2')
      for (const slot of ACCESSORY_SLOTS) {
        expect(accessoryFits(slot, type, 14), `${type} ${slot}`).toBe(true)
        expect(accessoryFits(slot, type, 15), `${type} ${slot}`).toBe(slot === (isOrb(type) ? 'accessory-1' : 'accessory-2'))
      }
    }
    for (const type of EQUIP_TYPES.filter((t) => !isAccessory(t))) {
      for (const slot of ACCESSORY_SLOTS) expect(accessoryFits(slot, type, 14) || accessoryFits(slot, type, 15), type).toBe(false)
    }
  })

  it('names the slots by the live generation: today’s "Accessory 1" and "Accessory 2"', () => {
    expect(ACCESSORY_SLOT_LABEL).toEqual({ 'accessory-1': 'Accessory 1', 'accessory-2': 'Accessory 2' })
  })
})
