import { mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { newSave, renameTrainer, SAVE_SCHEMA_VERSION as V } from '@rpg/domain'
import { describe, expect, it } from 'vitest'
import { LocalSaveRepository } from './local-save.repository'
import { RevisionConflict } from './save.repository'

const NOW = '2026-10-10T12:00:00.000Z'

describe('local save repository', () => {
  it('starts empty, stores revision 1, then rejects a stale write with the stored envelope', async () => {
    const repo = new LocalSaveRepository(join(await mkdtemp(join(tmpdir(), 'rpg-save-')), 'save.json'))
    expect(await repo.load('u')).toEqual({ revision: 0, save: null })
    const first = await repo.put('u', 0, newSave('Luis', NOW), V)
    expect(first.revision).toBe(1)
    await repo.put('u', 1, renameTrainer(first.save!, 'Luis 2', NOW), V)
    const stale = repo.put('u', 1, newSave('Other', NOW), V)
    await expect(stale).rejects.toBeInstanceOf(RevisionConflict)
    const error = await stale.then(() => null, (e: unknown) => e)
    if (!(error instanceof RevisionConflict)) throw new Error('expected a RevisionConflict')
    expect(error.current.revision).toBe(2)
    expect(error.current.save?.account.trainerName).toBe('Luis 2')
    expect((await repo.load('other-user')).revision).toBe(0)
  })

  it('refuses a write from an older save version, even at the right revision (D45)', async () => {
    const repo = new LocalSaveRepository(join(await mkdtemp(join(tmpdir(), 'rpg-save-')), 'save.json'))
    await repo.put('u', 0, newSave('Luis', NOW), V)
    await expect(repo.put('u', 1, newSave('Old app', NOW), V - 1)).rejects.toBeInstanceOf(RevisionConflict)
    expect((await repo.load('u')).save?.account.trainerName).toBe('Luis')
    expect((await repo.put('u', 1, newSave('New app', NOW), V)).revision).toBe(2)
  })

  it('loads a stored v22 row as current, with empty achievements, history, defeated faces and Rift (D163, D171)', async () => {
    const file = join(await mkdtemp(join(tmpdir(), 'rpg-save-')), 'save.json')
    const v22 = JSON.parse(JSON.stringify(newSave('Luis', NOW)))
    v22.schemaVersion = 22
    delete v22.account.achievements
    delete v22.account.history
    delete v22.account.defeated
    delete v22.tierWorlds['1'].rift
    await writeFile(file, JSON.stringify({ u: { revision: 4, save: v22 } }))
    const loaded = await new LocalSaveRepository(file).load('u')
    expect(loaded.revision).toBe(4)
    expect(loaded.save?.schemaVersion).toBe(V)
    expect(loaded.save?.account).toMatchObject({ achievements: {}, history: {}, defeated: {} })
    expect(loaded.save?.tierWorlds['1']?.rift).toEqual({ runs: [], echoes: {}, battle: null, battles: 0 })
  })

  it('loads a stored v23 row as current (v24 added no defeated faces and no Rift fight, D171)', async () => {
    const file = join(await mkdtemp(join(tmpdir(), 'rpg-save-')), 'save.json')
    const v23 = JSON.parse(JSON.stringify(newSave('Luis', NOW)))
    v23.schemaVersion = 23
    delete v23.account.defeated
    v23.tierWorlds['1'].rift = { runs: [], echoes: {} }
    await writeFile(file, JSON.stringify({ u: { revision: 7, save: v23 } }))
    const loaded = await new LocalSaveRepository(file).load('u')
    expect(loaded.revision).toBe(7)
    expect(loaded.save?.schemaVersion).toBe(V)
    expect(loaded.save?.account).toMatchObject({ achievements: {}, history: {}, defeated: {} })
    expect(loaded.save?.tierWorlds['1']?.rift).toEqual({ runs: [], echoes: {}, battle: null, battles: 0 })
  })
})
