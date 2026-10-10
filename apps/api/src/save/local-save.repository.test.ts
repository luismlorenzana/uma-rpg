import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { newSave, renameTrainer } from '@rpg/domain'
import { describe, expect, it } from 'vitest'
import { LocalSaveRepository } from './local-save.repository'
import { RevisionConflict } from './save.repository'

const NOW = '2026-10-10T12:00:00.000Z'

describe('local save repository', () => {
  it('starts empty, stores revision 1, then rejects a stale write with the stored envelope', async () => {
    const repo = new LocalSaveRepository(join(await mkdtemp(join(tmpdir(), 'rpg-save-')), 'save.json'))
    expect(await repo.load('u')).toEqual({ revision: 0, save: null })
    const first = await repo.put('u', 0, newSave('Luis', NOW))
    expect(first.revision).toBe(1)
    await repo.put('u', 1, renameTrainer(first.save!, 'Luis 2', NOW))
    const stale = repo.put('u', 1, newSave('Other', NOW))
    await expect(stale).rejects.toBeInstanceOf(RevisionConflict)
    const error = await stale.then(() => null, (e: unknown) => e)
    if (!(error instanceof RevisionConflict)) throw new Error('expected a RevisionConflict')
    expect(error.current.revision).toBe(2)
    expect(error.current.save?.account.trainerName).toBe('Luis 2')
    expect((await repo.load('other-user')).revision).toBe(0)
  })
})
