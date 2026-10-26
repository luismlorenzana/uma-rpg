// Save v29 (D220, the owner's R1 + R2 review): the Tier rework's grant is tickets only, so a world that took it keeps no
// materials; made items, Laurels and tickets stay, and a world without a grant keeps its materials.
import { describe, expect, it } from 'vitest'
import { MATERIAL_IDENTITIES } from '../items/materials-id'
import { migrateWorld, toV28, toV29 } from './migrations'
import { newSave, parseSave, SAVE_SCHEMA_VERSION } from './save'
import { fullRoster, richV27Save } from './v28.fixture'

type Raw = Record<string, unknown>
type World = Raw & { items: Record<string, number>; wallet: Raw; grant: (Raw & { tickets: number; back: Raw }) | null }
/** H78's fully built roster after R2's migration: its grant paid, its Warehouse converted. */
const granted = (items: Record<string, number>): World => ({ ...(toV28(fullRoster()) as World), items })

describe('save v29 (D220): the grant is tickets only', () => {
  it('takes every material from a granted world and keeps its made items, Laurels and tickets', () => {
    const before = granted({ 'iron-ore': 1000, 'iron-ingot': 1000, 'cut-quartz': 12, 'weapon-gem-g1': 2, 'accessory-setting-g1': 1, 'jewel-moon-2': 1 })
    const after = toV29(before) as World
    expect(after.items).toEqual({ 'weapon-gem-g1': 2, 'accessory-setting-g1': 1, 'jewel-moon-2': 1 })
    expect(after.wallet).toEqual(before.wallet)
    // The sheet stops listing the stock and the upgrades' items; the Laurels it paid back stay listed.
    expect(after.grant).toEqual({ ...before.grant!, back: { ...before.grant!.back, items: 0, stock: 0 } })
    expect(after.grant!.back.laurels).toBe(7150)
  })

  it('knows each of R2\'s sixty material ids', () => {
    const all = Object.fromEntries(MATERIAL_IDENTITIES.map((m) => [m.id, 1]))
    expect(MATERIAL_IDENTITIES).toHaveLength(60)
    expect((toV29(granted(all)) as World).items).toEqual({})
  })

  it('leaves a world without a grant as it is, and runs once', () => {
    const fresh = { ...granted({ carrot: 5, 'weapon-gem-g1': 1 }), grant: null }
    expect(toV29(fresh)).toBe(fresh)
    const once = toV29(granted({ carrot: 5 }))
    expect(toV29(once)).toEqual(once)
  })

  it('is chained after v28: a v27 save parses to v29 with no material in a granted world', () => {
    expect(SAVE_SCHEMA_VERSION).toBe(29)
    const world = toV28(fullRoster())
    expect(migrateWorld(world, 28)).toEqual(toV29(world))
    const save = parseSave(richV27Save())
    expect(save.schemaVersion).toBe(29)
    for (const w of Object.values(save.tierWorlds)) {
      if (!w.grant) continue
      expect(Object.keys(w.items).filter((id) => MATERIAL_IDENTITIES.some((m) => m.id === id))).toEqual([])
    }
  })

  it('starts new saves at v29 with no grant, so nothing is taken', () => {
    const save = newSave('Today', '2026-10-26T12:00:00.000Z')
    expect(save.schemaVersion).toBe(29)
    expect(save.tierWorlds['1']!.grant).toBeNull()
    expect(parseSave(JSON.parse(JSON.stringify(save)))).toEqual(save)
  })
})
