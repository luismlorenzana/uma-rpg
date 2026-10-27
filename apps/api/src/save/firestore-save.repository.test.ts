// The production repository's backup on a schema change (D69), against an in-memory Firestore: H112 turns save v30 on,
// the farm by line (D224: R2's types move to their line's G1 or G6, work settles), so the first v30 write over a stored
// v29 save must keep `saveBackups/{uid}-v29` (D221's v28 → v29 step had the same proof). Invented data only.
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

const NOW = '2026-10-26T12:00:00.000Z'
/** A save as the app before H112 stored it: labelled v29, with R2's types and a made item in stock. */
const storedV29 = (name: string): Doc => {
  const save = JSON.parse(JSON.stringify(newSave(name, NOW))) as Doc
  save.schemaVersion = 29
  const world = (save.tierWorlds as Record<string, Doc & { umas: Record<string, Doc>; wallet: Doc }>)['1']!
  world.umas['101'] = JSON.parse(JSON.stringify(newOwnedUma(NOW, 'brawler'))) as Doc
  world.items = { 'iron-ore': 30, 'copper-ingot': 4, cabbage: 6, 'weapon-gem-g1': 2 }
  world.wallet = { ...world.wallet, laurels: 650, timeTickets: 528 }
  return save
}
/** The same world after v30 (FL18): a high type becomes its line's G6 (Iron Ore → Gold Ore, Cabbage → Bell Pepper), a low
 * type its G1 (Copper Ingot stays), the made item stays. */
const V30_WORLD = { items: { 'gold-ore': 30, 'copper-ingot': 4, 'bell-pepper': 6, 'weapon-gem-g1': 2 } }

describe('the Firestore save repository (D45, D69)', () => {
  beforeEach(() => store.clear())

  it('runs on save v30 since H112', () => {
    expect(V).toBe(30)
  })

  it('keeps saveBackups/{uid}-v29 on the first v30 write, and no backup on later v30 writes', async () => {
    const repo = new FirestoreSaveRepository()
    const v29 = { revision: 7, save: storedV29('Luis') }
    store.set('saves/u', structuredClone(v29))
    // Loading parses (and migrates) what's stored: the types convert, the tickets and Laurels stay; nothing is written.
    const loaded = await repo.load('u')
    expect(loaded.revision).toBe(7)
    expect(loaded.save?.schemaVersion).toBe(30)
    expect(loaded.save?.tierWorlds['1']).toMatchObject(V30_WORLD)
    expect(loaded.save?.tierWorlds['1']!.wallet).toMatchObject({ laurels: 650, timeTickets: 528 })
    expect(store.get('saves/u')).toEqual(v29)
    expect(store.has('saveBackups/u-v29')).toBe(false)
    // The new app's first write: v30 is stored, and the v29 document is copied whole first.
    const next = await repo.put('u', 7, loaded.save!, 30)
    expect(next.revision).toBe(8)
    expect(store.get('saveBackups/u-v29')).toEqual({ ...v29, backedUpAt: SERVER_TIME })
    expect(store.get('saves/u')).toMatchObject({ revision: 8, save: { schemaVersion: 30, tierWorlds: { '1': V30_WORLD } } })
    // A later v30 write over v30 backs nothing up.
    store.delete('saveBackups/u-v29')
    await repo.put('u', 8, loaded.save!, 30)
    expect([...store.keys()]).toEqual(['saves/u'])
  })

  it('stores an old app’s write as v30 with the same backup while v29 is stored, then refuses its next one (D45)', async () => {
    const repo = new FirestoreSaveRepository()
    store.set('saves/u', { revision: 3, save: storedV29('Luis') })
    // The API parses every save it's sent to the current version (`parseSavePut`), so a v29 app's body arrives as v30.
    const sent = (await repo.load('u')).save as Save
    await repo.put('u', 3, sent, 29)
    expect(store.get('saves/u')).toMatchObject({ revision: 4, save: { schemaVersion: 30 } })
    expect(store.has('saveBackups/u-v29')).toBe(true)
    // Now v30 is stored: the old app's next write is refused with what's stored, and nothing changes.
    await expect(repo.put('u', 4, sent, 29)).rejects.toBeInstanceOf(RevisionConflict)
    expect(store.get('saves/u')).toMatchObject({ revision: 4 })
  })
})
