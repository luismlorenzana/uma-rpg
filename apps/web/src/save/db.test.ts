// The device's storage (D260): safety copies, and the upgrade that adds them, which must keep the row holding a player's
// unsynced save. Invented data only.
import 'fake-indexeddb/auto'
import { newSave } from '@rpg/domain'
import Dexie from 'dexie'
import { describe, expect, it } from 'vitest'

const NOW = '2026-10-30T12:00:00.000Z'
const row = (trainer: string) => ({ id: 'main' as const, uid: 'u1', revision: 4, dirty: true, save: newSave(trainer, NOW) })

describe('the device save', () => {
  // First: it needs a database only version 1 has opened.
  it('keeps an unsynced row through the upgrade to safety copies', async () => {
    const old = new Dexie('uma-rpg')
    old.version(1).stores({ save: 'id' })
    await old.table('save').put(row('Unsynced'))
    old.close()
    const { readSaveRow } = await import('./db')
    await expect(readSaveRow('u1')).resolves.toMatchObject({ dirty: true, revision: 4, save: { account: { trainerName: 'Unsynced' } } })
  })

  it('keeps an unreadable row as a safety copy before boot writes over it', async () => {
    const { db, readSaveRow, safetyCopies } = await import('./db')
    await db.save.put({ ...row('x'), save: { nonsense: true } as never })
    await expect(readSaveRow('u1')).resolves.toBeNull()
    const copies = await safetyCopies('u1')
    expect(copies[0]).toMatchObject({ reason: 'unreadable', revision: 4, save: { nonsense: true } })
  })

  it('reads no row of another account, and keeps no copy of it', async () => {
    const { db, readSaveRow, safetyCopies } = await import('./db')
    await db.safety.clear()
    await db.save.put(row('Theirs'))
    await expect(readSaveRow('u2')).resolves.toBeNull()
    await expect(safetyCopies('u2')).resolves.toEqual([])
  })

  it('keeps an account\'s newest five copies, newest first', async () => {
    const { addSafetyCopy, db, SAFETY_COPIES, safetyCopies } = await import('./db')
    await db.safety.clear()
    for (let n = 1; n <= SAFETY_COPIES + 2; n++) {
      await expect(addSafetyCopy({ uid: 'u1', reason: 'replaced', at: NOW, revision: n, save: {} })).resolves.toBe(true)
    }
    await addSafetyCopy({ uid: 'u2', reason: 'replaced', at: NOW, revision: 99, save: {} })
    expect((await safetyCopies('u1')).map((c) => c.revision)).toEqual([7, 6, 5, 4, 3])
    expect((await safetyCopies('u2')).map((c) => c.revision)).toEqual([99])
  })
})
