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
  it('matches every type × grade (× accent for armor), preserves readable zero-padded grades, and rejects bad ids (D103)', () => {
    for (const type of EQUIP_TYPES) for (let grade = 1; grade <= 10; grade++) for (const accent of [...ITEM_EFFECTS, null]) {
      const id = accent ? `${type}-g${grade}-${accent}` : `${type}-g${grade}`, piece = gearById(id)
      if (!piece) { expect(gearIdentity(id), id).toBeUndefined(); continue }
      expect(gearIdentity(id)).toEqual({ id: piece.id, type: piece.type, grade: piece.grade, accent: piece.accent })
    }
    expect(gearIdentity('lance-g01')).toMatchObject({ type: 'lance', grade: 1, accent: null })
    expect(gearIdentity('helm-g01-atk')).toMatchObject({ type: 'helm', grade: 1, accent: 'atk' })
    for (const id of ['spear-g1', 'lance-g0', 'lance-g11', 'lance-g001', 'lance-g1-atk', 'helm-g1-power', 'helm-g1', 'unknown']) {
      expect(gearIdentity(id), id).toBeUndefined()
    }
  })
})
