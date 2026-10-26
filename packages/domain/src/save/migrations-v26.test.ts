import { describe, expect, it } from 'vitest'
import { migrateWorldToV27, toV26 } from './migrations'
import { newOwnedUma, newSave, parseSave, SAVE_SCHEMA_VERSION } from './save'

const NOW = '2026-10-22T19:00:00.000Z'

describe('save v26’s independent party lead (D190)', () => {
  it('migrates the face v25 used without changing any slot', () => {
    // A v25 save in the generation it was written in (the constructors follow the live stage, v28's since H82).
    const raw = JSON.parse(JSON.stringify(newSave('Review', NOW, 16)))
    raw.schemaVersion = 25
    const owned = JSON.parse(JSON.stringify(newOwnedUma(NOW, undefined, 16)))
    raw.tierWorlds['1'].umas = { '101': owned, '102': owned }
    raw.tierWorlds['1'].parties[0].slots = [null, '101', null, '102', null]
    for (const party of raw.tierWorlds['1'].parties) delete party.lead

    const parsed = parseSave(raw)
    expect(parsed.schemaVersion).toBe(SAVE_SCHEMA_VERSION)
    expect(parsed.tierWorlds['1']!.parties[0]).toEqual({
      name: 'Party 1', slots: [null, '101', null, '102', null], lead: '101',
    })
    expect(parsed.tierWorlds['1']!.parties[1]!.lead).toBeNull()
  })

  it('is chained once and leaves an already migrated world unchanged (the chain to v27; v28’s step is `migrations-v28.test.ts`’s)', () => {
    const world = { parties: [{ name: 'One', slots: [null, '101', null, null, null] }] }
    expect(migrateWorldToV27(world, 25)).toEqual(toV26(world))
    const migrated = toV26(world)
    expect(toV26(migrated)).toEqual(migrated)
    expect(migrateWorldToV27(migrated, 26)).toBe(migrated)
  })
})
