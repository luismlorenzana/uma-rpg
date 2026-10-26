// The production repository's backup on a schema change (D69), against an in-memory Firestore: H82 (D218) turns save v28
// on, the Tier rework's economy and its one irreversible step (Craft Levels to 1, the Speed Ticket grant), so the first v28
// write over a stored v27 save must keep `saveBackups/{uid}-v27` (H72's v26 → v27 step had the same proof, D210). Invented
// data only.
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
/** A save as the app before H82 stored it: labelled v27, Uma 101 a Brawler at Craft Lv 21 with a crafted Greatsword in her
 * locker (v27's shapes, built in engine 16's generation). */
const storedV27 = (name: string): Doc => {
  const save = JSON.parse(JSON.stringify(newSave(name, NOW, 16))) as Doc
  save.schemaVersion = 27
  const world = (save.tierWorlds as Record<string, { umas: Record<string, Doc> }>)['1']!
  const uma = JSON.parse(JSON.stringify(newOwnedUma(NOW, 'brawler', 16))) as Doc
  world.umas['101'] = { ...uma, craft: { level: 21, exp: 0 }, gear: { locker: ['greatsword-g1'], equipped: { greatsword: 'greatsword-g1' }, kinds: {} } }
  return save
}
/** Uma 101 as save v28 holds her: Craft Lv 1, every grade G0, an empty map, Class Ranks only. */
const V28_UMA = { craft: { level: 1, exp: 0 }, gear: { weapons: {}, armor: {}, accessories: [{ grade: 0, family: null, form: 'base' }] },
  stars: { open: [], moons: [] }, ranks: { classes: {} } }
/** Her grant: Craft Lv 21 is 528 Speed Tickets (§14.3), her Greatsword the one piece. */
const V28_GRANT = { tickets: 528, umas: { 101: { level: 21, exp: 0, tickets: 528 } }, deleted: { gear: 1, gems: 0, upgrades: 0 }, seen: false }

describe('the Firestore save repository (D45, D69)', () => {
  beforeEach(() => store.clear())

  it('runs on save v28 since H82 (D218)', () => {
    expect(V).toBe(28)
  })

  it('keeps saveBackups/{uid}-v27 on the first v28 write, and no backup on later v28 writes', async () => {
    const repo = new FirestoreSaveRepository()
    const v27 = { revision: 7, save: storedV27('Luis') }
    store.set('saves/u', structuredClone(v27))
    // Loading parses (and migrates) what's stored: Craft Lv 1, G0, the grant paid; nothing is written.
    const loaded = await repo.load('u')
    expect(loaded.revision).toBe(7)
    expect(loaded.save?.schemaVersion).toBe(28)
    expect(loaded.save?.tierWorlds['1']!.umas['101']).toMatchObject(V28_UMA)
    expect(loaded.save?.tierWorlds['1']!.grant).toMatchObject(V28_GRANT)
    expect(loaded.save?.tierWorlds['1']!.wallet.timeTickets).toBe(528)
    expect(store.get('saves/u')).toEqual(v27)
    expect(store.has('saveBackups/u-v27')).toBe(false)
    // The new app's first write: v28 is stored, and the v27 document is copied whole first.
    const next = await repo.put('u', 7, loaded.save!, 28)
    expect(next.revision).toBe(8)
    expect(store.get('saveBackups/u-v27')).toEqual({ ...v27, backedUpAt: SERVER_TIME })
    expect(store.get('saves/u')).toMatchObject({ revision: 8, save: { schemaVersion: 28, tierWorlds: { '1': { umas: { '101': V28_UMA }, grant: V28_GRANT } } } })
    // A later v28 write over v28 backs nothing up.
    store.delete('saveBackups/u-v27')
    await repo.put('u', 8, loaded.save!, 28)
    expect([...store.keys()]).toEqual(['saves/u'])
  })

  it('stores an old app’s write as v28 with the same backup while v27 is stored, then refuses its next one (D45)', async () => {
    const repo = new FirestoreSaveRepository()
    store.set('saves/u', { revision: 3, save: storedV27('Luis') })
    // The API parses every save it's sent to the current version (`parseSavePut`), so a v27 app's body arrives as v28.
    const sent = (await repo.load('u')).save as Save
    await repo.put('u', 3, sent, 27)
    expect(store.get('saves/u')).toMatchObject({ revision: 4, save: { schemaVersion: 28 } })
    expect(store.has('saveBackups/u-v27')).toBe(true)
    // Now v28 is stored: the old app's next write is refused with what's stored, and nothing changes.
    await expect(repo.put('u', 4, sent, 27)).rejects.toBeInstanceOf(RevisionConflict)
    expect(store.get('saves/u')).toMatchObject({ revision: 4 })
  })
})
