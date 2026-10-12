import { describe, expect, it } from 'vitest'
import { ITEM_EFFECTS } from '../items/kinds'
import { DISHES } from './dishes'
import { isDishId } from './dish-id'
import { EQUIP_TYPES, gearById } from './gear'
import { gearIdentity } from './gear-id'

describe('light cooking and equipment ids (H16)', () => {
  it('recognizes exactly the 100 authored dish recipes', () => {
    const ids = new Set(DISHES.map((d) => d.id))
    expect(ids.size).toBe(100)
    for (const id of ids) expect(isDishId(id), id).toBe(true)
    for (const id of ['dish-grains-0', 'dish-grains-11', 'dish-grains-01', 'duo-hp-mp-3', 'duo-hp-def-4', 'feast-5', 'feast-04', 'unknown']) {
      expect(isDishId(id), id).toBe(false)
    }
  })
  it('matches every type × grade × accent, preserves readable zero-padded grades, and rejects bad ids', () => {
    for (const type of EQUIP_TYPES) for (let grade = 1; grade <= 10; grade++) for (const accent of ITEM_EFFECTS) {
      const id = `${type}-g${grade}-${accent}`, piece = gearById(id)!
      expect(gearIdentity(id)).toEqual({ id: piece.id, type: piece.type, grade: piece.grade, accent: piece.accent })
    }
    expect(gearIdentity('lance-g01-atk')).toMatchObject({ type: 'lance', grade: 1, accent: 'atk' })
    for (const id of ['spear-g1-atk', 'lance-g0-atk', 'lance-g11-atk', 'lance-g001-atk', 'lance-g1-power', 'unknown']) {
      expect(gearIdentity(id), id).toBeUndefined()
    }
  })
})
