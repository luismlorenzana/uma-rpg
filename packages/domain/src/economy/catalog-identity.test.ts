import { describe, expect, it } from 'vitest'
import { GEMS } from './gems'
import { isGemId } from './stars'
import { EQUIP_TYPES, gearById } from './gear'
import { gearIdentity } from './gear-id'

describe('light Star Gem and equipment ids (H16)', () => {
  it('recognizes exactly the 100 Star Gems', () => {
    const ids = new Set(GEMS.map((g) => g.id))
    expect(ids.size).toBe(100)
    for (const id of ids) expect(isGemId(id), id).toBe(true)
    for (const id of ['gem-hp-0', 'gem-hp-11', 'gem-hp-01', 'gem-hp-mp-3', 'gem-hp-def-4', 'gem-sun-5', 'gem-sun-04', 'unknown']) {
      expect(isGemId(id), id).toBe(false)
    }
  })
  it('matches every type × grade, preserves readable zero-padded grades, and rejects bad ids (D124)', () => {
    for (const type of EQUIP_TYPES) for (let grade = 1; grade <= 10; grade++) {
      const id = `${type}-g${grade}`, piece = gearById(id)!
      expect(gearIdentity(id)).toEqual({ id: piece.id, type: piece.type, grade: piece.grade })
    }
    expect(gearIdentity('lance-g01')).toMatchObject({ type: 'lance', grade: 1 })
    expect(gearIdentity('talisman-thorn-g10')).toMatchObject({ type: 'talisman-thorn', grade: 10 })
    for (const id of ['spear-g1', 'lance-g0', 'lance-g11', 'lance-g001', 'lance-g1-atk', 'helm-g1-atk', 'mail-g1', 'unknown']) {
      expect(gearIdentity(id), id).toBeUndefined()
    }
  })
})
