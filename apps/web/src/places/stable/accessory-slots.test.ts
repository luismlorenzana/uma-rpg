import { ACCESSORY_KINDS, ACCESSORY_TYPES, accessoryKindOf, isAmulet, isOrb, isTalisman } from '@rpg/domain'
import { describe, expect, it } from 'vitest'
import { accessorySheetTypes, noAccessories } from './accessory-slots'

const types = (groups: ReturnType<typeof accessorySheetTypes>) => groups.flatMap((g) => g.types)
const byKind = [...ACCESSORY_TYPES].sort((a, b) => ACCESSORY_KINDS.indexOf(accessoryKindOf(a)) - ACCESSORY_KINDS.indexOf(accessoryKindOf(b)))

describe('the accessory sheet\'s choices (H59)', () => {
  it('lists every type but the other slot\'s in classes v1, in either slot', () => {
    for (const slot of ['accessory-1', 'accessory-2'] as const) {
      expect(types(accessorySheetTypes(slot, undefined, 14))).toEqual(byKind)
      expect(types(accessorySheetTypes(slot, 'orb-fire', 14))).toEqual(byKind.filter((t) => t !== 'orb-fire'))
    }
    expect(noAccessories('accessory-1', 14)).toBe('No accessories yet: the Forge makes them.')
  })

  it('lists only Orbs in classes v2\'s Damage slot, only Talismans and Amulets in its Support slot', () => {
    const damage = accessorySheetTypes('accessory-1', 'talisman-vital', 15)
    expect(damage.map((g) => g.kind)).toEqual(['arms-orb', 'elemental-orb'])
    expect(types(damage)).toHaveLength(10)
    expect(types(damage).every(isOrb)).toBe(true)
    const support = accessorySheetTypes('accessory-2', 'orb-fire', 15)
    expect(support.map((g) => g.kind)).toEqual(['talisman', 'amulet'])
    expect(types(support)).toHaveLength(10)
    expect(types(support).every((t) => isTalisman(t) || isAmulet(t))).toBe(true)
    expect(noAccessories('accessory-1', 15)).toBe('No Orbs yet: the Forge makes them.')
    expect(noAccessories('accessory-2', 15)).toBe('No Talismans or Amulets yet: the Forge makes them.')
  })
})
