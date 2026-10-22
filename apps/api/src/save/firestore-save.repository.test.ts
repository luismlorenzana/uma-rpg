// The production repository's backup on a schema change (D69), against an in-memory Firestore: H61 turns save v25 on
// (D188), so the first v25 write over a stored v24 save must keep `saveBackups/{uid}-v24`. Invented data only.
import { newSave, SAVE_SCHEMA_VERSION as V, type Save } from '@rpg/domain'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { FirestoreSaveRepository } from './firestore-save.repository'
import { RevisionConflict } from './save.repository'

type Doc = Record<string, unknown>
const store = new Map<string, Doc>()
const SERVER_TIME = { serverTimestamp: true }

vi.mock('firebase-admin', () => {
  const snapshot = (path: string) => ({ exists: store.has(path), data: () => (store.has(path) ? structuredClone(store.get(path)) : undefined) })
  const ref = (path: string) => ({ path, get: async () => snapshot(path) })
  const db = {
    collection: (name: string) => ({ doc: (id: string) => ref(`${name}/${id}`) }),
    runTransaction: async <T>(fn: (tx: unknown) => Promise<T>): Promise<T> => {
      const writes: [string, Doc][] = []
      const result = await fn({ get: async (r: { path: string }) => snapshot(r.path), set: (r: { path: string }, data: Doc) => { writes.push([r.path, data]) } })
      for (const [path, data] of writes) store.set(path, structuredClone(data))
      return result
    },
  }
  const firestore = Object.assign(() => db, { FieldValue: { serverTimestamp: () => SERVER_TIME } })
  return { apps: [{}], initializeApp: () => ({}), firestore }
})

const NOW = '2026-10-22T12:00:00.000Z'
/** A save as an older app stored it: labelled v24 (no Cleric to migrate, so v25's step changes nothing else). */
const storedV24 = (name: string): Doc => ({ ...(JSON.parse(JSON.stringify(newSave(name, NOW))) as Doc), schemaVersion: 24 })

describe('the Firestore save repository (D45, D69)', () => {
  beforeEach(() => store.clear())

  it('runs on save v25 since H61', () => {
    expect(V).toBe(25)
  })

  it('keeps saveBackups/{uid}-v24 on the first v25 write, and no backup on later v25 writes', async () => {
    const repo = new FirestoreSaveRepository()
    const v24 = { revision: 7, save: storedV24('Luis') }
    store.set('saves/u', structuredClone(v24))
    // Loading parses (and migrates) what's stored; nothing is written yet.
    const loaded = await repo.load('u')
    expect(loaded.revision).toBe(7)
    expect(loaded.save?.schemaVersion).toBe(25)
    expect(store.has('saveBackups/u-v24')).toBe(false)
    // The new app's first write: v25 is stored, and the v24 document is copied whole first.
    const next = await repo.put('u', 7, loaded.save!, 25)
    expect(next.revision).toBe(8)
    expect(store.get('saveBackups/u-v24')).toEqual({ ...v24, backedUpAt: SERVER_TIME })
    expect(store.get('saves/u')).toMatchObject({ revision: 8, save: { schemaVersion: 25 } })
    // A later v25 write over v25 backs nothing up.
    store.delete('saveBackups/u-v24')
    await repo.put('u', 8, loaded.save!, 25)
    expect([...store.keys()]).toEqual(['saves/u'])
  })

  it('stores an old app’s write as v25 with the same backup while v24 is stored, then refuses its next one (D45)', async () => {
    const repo = new FirestoreSaveRepository()
    store.set('saves/u', { revision: 3, save: storedV24('Luis') })
    // The API parses every save it's sent to the current version (`parseSavePut`), so a v24 app's body arrives as v25.
    const sent = (await repo.load('u')).save as Save
    await repo.put('u', 3, sent, 24)
    expect(store.get('saves/u')).toMatchObject({ revision: 4, save: { schemaVersion: 25 } })
    expect(store.has('saveBackups/u-v24')).toBe(true)
    // Now v25 is stored: the old app's next write is refused with what's stored, and nothing changes.
    await expect(repo.put('u', 4, sent, 24)).rejects.toBeInstanceOf(RevisionConflict)
    expect(store.get('saves/u')).toMatchObject({ revision: 4 })
  })
})
