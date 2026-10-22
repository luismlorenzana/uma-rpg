// The production repository's backup on a schema change (D69), against an in-memory Firestore: D190 turns save v26 on,
// so the first v26 write over a stored v25 save must keep `saveBackups/{uid}-v25`. Invented data only.
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
/** A save as an older app stored it: labelled v25, with the v26 party field removed. */
const storedV25 = (name: string): Doc => {
  const save = JSON.parse(JSON.stringify(newSave(name, NOW))) as Doc
  save.schemaVersion = 25
  const worlds = save.tierWorlds as Record<string, { parties: Record<string, unknown>[] }>
  for (const party of worlds['1']!.parties) delete party.lead
  return save
}

describe('the Firestore save repository (D45, D69)', () => {
  beforeEach(() => store.clear())

  it('runs on save v26 since D190', () => {
    expect(V).toBe(26)
  })

  it('keeps saveBackups/{uid}-v25 on the first v26 write, and no backup on later v26 writes', async () => {
    const repo = new FirestoreSaveRepository()
    const v25 = { revision: 7, save: storedV25('Luis') }
    store.set('saves/u', structuredClone(v25))
    // Loading parses (and migrates) what's stored; nothing is written yet.
    const loaded = await repo.load('u')
    expect(loaded.revision).toBe(7)
    expect(loaded.save?.schemaVersion).toBe(26)
    expect(store.has('saveBackups/u-v25')).toBe(false)
    // The new app's first write: v26 is stored, and the v25 document is copied whole first.
    const next = await repo.put('u', 7, loaded.save!, 26)
    expect(next.revision).toBe(8)
    expect(store.get('saveBackups/u-v25')).toEqual({ ...v25, backedUpAt: SERVER_TIME })
    expect(store.get('saves/u')).toMatchObject({ revision: 8, save: { schemaVersion: 26 } })
    // A later v26 write over v26 backs nothing up.
    store.delete('saveBackups/u-v25')
    await repo.put('u', 8, loaded.save!, 26)
    expect([...store.keys()]).toEqual(['saves/u'])
  })

  it('stores an old app’s write as v26 with the same backup while v25 is stored, then refuses its next one (D45)', async () => {
    const repo = new FirestoreSaveRepository()
    store.set('saves/u', { revision: 3, save: storedV25('Luis') })
    // The API parses every save it's sent to the current version (`parseSavePut`), so a v25 app's body arrives as v26.
    const sent = (await repo.load('u')).save as Save
    await repo.put('u', 3, sent, 25)
    expect(store.get('saves/u')).toMatchObject({ revision: 4, save: { schemaVersion: 26 } })
    expect(store.has('saveBackups/u-v25')).toBe(true)
    // Now v26 is stored: the old app's next write is refused with what's stored, and nothing changes.
    await expect(repo.put('u', 4, sent, 25)).rejects.toBeInstanceOf(RevisionConflict)
    expect(store.get('saves/u')).toMatchObject({ revision: 4 })
  })
})
