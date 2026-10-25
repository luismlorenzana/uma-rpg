// Classes v2's typed accessory slots, live since H61 (H57, C10; D188): a save's `accessory-1` holds an Orb or nothing, its
// `accessory-2` a Talisman, an Amulet or nothing, and the live rules (labels, equipping) follow.
import { describe, expect, it } from 'vitest'
import { ACCESSORY_SLOT_LABEL } from '../economy/ranks'
import { BATTLE_ENGINE_VERSION } from '../rpg/battle/caps'
import { equipGear, wearAccessory } from './forge'
import { unlockUma, worldOf } from './rules'
import { gearV1, newSave, parseSave, type Save } from './save'


const T = (n: number) => `2026-10-22T12:00:${String(n).padStart(2, '0')}.000Z`
/** Uma 101, a Brawler, with these pieces hers and worn. */
function wearing(equipped: Record<string, string>): Save {
  const save = unlockUma(newSave('Luis', T(0)), '101', T(0), '1', 'brawler')
  const w = worldOf(save)
  const uma = w.umas['101']!
  return { ...save, tierWorlds: { ...save.tierWorlds, '1': { ...w, umas: { '101': { ...uma, gear: { ...uma.gear, locker: Object.values(equipped), equipped } } } } } }
}
const parsed = (save: Save) => parseSave(JSON.parse(JSON.stringify(save)))

describe('typed accessory slots in a save, with classes v2 live (H57)', () => {
  it('runs with the switch at 16 (H72; the slots are classes v2’s since H61)', () => {
    expect(BATTLE_ENGINE_VERSION).toBe(16)
    expect(ACCESSORY_SLOT_LABEL).toEqual({ 'accessory-1': 'Damage', 'accessory-2': 'Support' })
  })

  it('parses an Orb in the Damage slot and a Talisman or an Amulet in the Support slot', () => {
    const cases: Record<string, string>[] = [{ 'accessory-1': 'orb-fire-g1', 'accessory-2': 'talisman-vital-g1' }, { 'accessory-2': 'amulet-veil-g1' }, { 'accessory-1': 'orb-axe-g1' }]
    for (const equipped of cases) {
      const save = wearing(equipped)
      expect(parsed(save)).toEqual(save)
    }
  })

  it('refuses an Orb in the Support slot and a support in the Damage slot', () => {
    expect(() => parsed(wearing({ 'accessory-2': 'orb-fire-g1' }))).toThrow(/accessory-2: expected a piece from her locker for this slot/)
    expect(() => parsed(wearing({ 'accessory-1': 'talisman-vital-g1' }))).toThrow(/accessory-1: expected a piece from her locker for this slot/)
    expect(() => parsed(wearing({ 'accessory-1': 'orb-fire-g1', 'accessory-2': 'orb-lance-g1' }))).toThrow(/accessory-2/)
  })

  it('equips by type by default and refuses the other slot', () => {
    const save = wearing({})
    const stocked = { ...save, tierWorlds: { ...save.tierWorlds, '1': { ...worldOf(save), gear: { 'amulet-spring-g1': 1, 'orb-fire-g1': 1 } } } }
    const after = equipGear(stocked, '101', 'amulet-spring-g1', T(1))
    expect(gearV1(worldOf(after).umas['101']!).equipped).toEqual({ 'accessory-2': 'amulet-spring-g1' })
    expect(() => wearAccessory(after, '101', 'accessory-2', 'orb-fire-g1', T(2))).toThrow('The Support slot takes a Talisman or an Amulet')
    expect(parsed(after)).toEqual(after)
  })
})
