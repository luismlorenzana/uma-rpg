// The production repository's backup on a schema change (D69), against an in-memory Firestore: H72 (D210) turns save v27
// on, the first live migration of the Tier rework (three weapons, branch picks, the calling pick), so the first v27 write
// over a stored v26 save must keep `saveBackups/{uid}-v26` (D190's v25 → v26 step had the same proof). Invented data only.
import { newOwnedUma, newSave, SAVE_SCHEMA_VERSION as V, type Save } from '@rpg/domain'
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

const NOW = '2026-10-25T12:00:00.000Z'
/** A save as the app before H72 stored it: labelled v26, Uma 101 a Brawler on five weapons with a Lance side skill (her
 * Lance's B line) and no calling. */
const storedV26 = (name: string): Doc => {
  const save = JSON.parse(JSON.stringify(newSave(name, NOW))) as Doc
  save.schemaVersion = 26
  const world = (save.tierWorlds as Record<string, { umas: Record<string, Doc> }>)['1']!
  const { calling: _, ...uma } = JSON.parse(JSON.stringify(newOwnedUma(NOW, 'brawler'))) as Doc
  world.umas['101'] = { ...uma, classes: { brawler: { weapons: ['greatsword', 'axe', 'lance', 'bow', 'katana'], tree: ['brawler-lance.3a'], loadout: null } } }
  return save
}
/** Uma 101 as save v27 holds her. */
const V27_UMA = { classes: { brawler: { weapons: ['greatsword', 'axe', 'lance'], lines: { lance: 'B' }, loadout: null } }, calling: { pick: null, confirmed: false } }

describe('the Firestore save repository (D45, D69)', () => {
  beforeEach(() => store.clear())

  it('runs on save v27 since H72 (D210)', () => {
    expect(V).toBe(27)
  })

  it('keeps saveBackups/{uid}-v26 on the first v27 write, and no backup on later v27 writes', async () => {
    const repo = new FirestoreSaveRepository()
    const v26 = { revision: 7, save: storedV26('Luis') }
    store.set('saves/u', structuredClone(v26))
    // Loading parses (and migrates) what's stored: three weapons, her side as a line, her calling open; nothing is written.
    const loaded = await repo.load('u')
    expect(loaded.revision).toBe(7)
    expect(loaded.save?.schemaVersion).toBe(27)
    expect(loaded.save?.tierWorlds['1']!.umas['101']).toMatchObject(V27_UMA)
    expect(store.get('saves/u')).toEqual(v26)
    expect(store.has('saveBackups/u-v26')).toBe(false)
    // The new app's first write: v27 is stored, and the v26 document is copied whole first.
    const next = await repo.put('u', 7, loaded.save!, 27)
    expect(next.revision).toBe(8)
    expect(store.get('saveBackups/u-v26')).toEqual({ ...v26, backedUpAt: SERVER_TIME })
    expect(store.get('saves/u')).toMatchObject({ revision: 8, save: { schemaVersion: 27, tierWorlds: { '1': { umas: { '101': V27_UMA } } } } })
    // A later v27 write over v27 backs nothing up.
    store.delete('saveBackups/u-v26')
    await repo.put('u', 8, loaded.save!, 27)
    expect([...store.keys()]).toEqual(['saves/u'])
  })

  it('stores an old app’s write as v27 with the same backup while v26 is stored, then refuses its next one (D45)', async () => {
    const repo = new FirestoreSaveRepository()
    store.set('saves/u', { revision: 3, save: storedV26('Luis') })
    // The API parses every save it's sent to the current version (`parseSavePut`), so a v26 app's body arrives as v27.
    const sent = (await repo.load('u')).save as Save
    await repo.put('u', 3, sent, 26)
    expect(store.get('saves/u')).toMatchObject({ revision: 4, save: { schemaVersion: 27 } })
    expect(store.has('saveBackups/u-v26')).toBe(true)
    // Now v27 is stored: the old app's next write is refused with what's stored, and nothing changes.
    await expect(repo.put('u', 4, sent, 26)).rejects.toBeInstanceOf(RevisionConflict)
    expect(store.get('saves/u')).toMatchObject({ revision: 4 })
  })
})
