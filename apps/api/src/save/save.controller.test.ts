// A refused upload is kept (D260): the failure of 2026-10-26 sent every upload back with a 500 and kept nothing, so days of
// play lived on one phone. Invented data only.
import { BadRequestException, ConflictException } from '@nestjs/common'
import { newSave, type Save } from '@rpg/domain'
import { describe, expect, it, vi } from 'vitest'
import { SaveController } from './save.controller'
import { EMPTY_ENVELOPE, RevisionConflict, type SaveRepository } from './save.repository'

const NOW = '2026-10-30T12:00:00.000Z'
const upload = () => ({ baseRevision: 3, save: JSON.parse(JSON.stringify(newSave('Luis', NOW))) as Save })
function fake(put: SaveRepository['put'], rescue: SaveRepository['rescue'] = vi.fn(async () => undefined)) {
  const repo: SaveRepository = { load: async () => EMPTY_ENVELOPE, put, rescue }
  return { repo, controller: new SaveController(repo) }
}

describe('the save upload (D260)', () => {
  it('keeps nothing when the upload is stored', async () => {
    const { repo, controller } = fake(async (_uid, revision, save) => ({ revision: revision + 1, save }))
    await expect(controller.put('u', upload())).resolves.toMatchObject({ revision: 4 })
    expect(repo.rescue).not.toHaveBeenCalled()
  })

  it('keeps an upload the store refuses, as sent, and still fails it', async () => {
    const { repo, controller } = fake(async () => { throw new Error('3 INVALID_ARGUMENT: invalid nested entity') })
    const body = upload()
    await expect(controller.put('u', body)).rejects.toThrow('invalid nested entity')
    expect(repo.rescue).toHaveBeenCalledWith('u', body, '3 INVALID_ARGUMENT: invalid nested entity')
  })

  it('keeps an upload that fails the save rules, as sent, and says why', async () => {
    const { repo, controller } = fake(async () => { throw new Error('never stored') })
    const body = { baseRevision: 3, save: { schemaVersion: 32, nonsense: true } }
    await expect(controller.put('u', body)).rejects.toBeInstanceOf(BadRequestException)
    expect(repo.rescue).toHaveBeenCalledWith('u', body, expect.any(String))
  })

  it('keeps nothing for a revision conflict: the device simply syncs again', async () => {
    const { repo, controller } = fake(async () => { throw new RevisionConflict(EMPTY_ENVELOPE) })
    await expect(controller.put('u', upload())).rejects.toBeInstanceOf(ConflictException)
    expect(repo.rescue).not.toHaveBeenCalled()
  })

  it('never lets a failed rescue hide why the upload failed', async () => {
    const { controller } = fake(async () => { throw new Error('the real reason') }, async () => { throw new Error('no rescue') })
    await expect(controller.put('u', upload())).rejects.toThrow('the real reason')
  })
})
