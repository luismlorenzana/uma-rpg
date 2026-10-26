// The production repository's backup on a schema change (D69), against an in-memory Firestore: D221 turns save v29 on,
// the owner's "only tickets" (every material leaves a granted world's Warehouse), so the first v29 write over a stored
// v28 save must keep `saveBackups/{uid}-v28` (H82's v27 → v28 step had the same proof, D218). Invented data only.
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
/** The Tier rework's grant as save v28 holds it: Uma 101's Craft Lv 21 paid 528 Speed Tickets; 30 items of stock and 4
 * refined items from an upgrade came back with 650 Laurels. */
const GRANT = { tickets: 528, floor: 0, umas: { 101: { level: 21, exp: 0, tickets: 528 } }, deleted: { gear: 1, gems: 0, upgrades: 1 },
  back: { laurels: 650, items: 4, stock: 30 }, seen: true }
/** A save as the app before D221 stored it: labelled v28, its world granted, with materials and a made item. */
const storedV28 = (name: string): Doc => {
  const save = JSON.parse(JSON.stringify(newSave(name, NOW))) as Doc
  save.schemaVersion = 28
  const world = (save.tierWorlds as Record<string, Doc & { umas: Record<string, Doc>; wallet: Doc }>)['1']!
  world.umas['101'] = JSON.parse(JSON.stringify(newOwnedUma(NOW, 'brawler'))) as Doc
  world.items = { 'iron-ore': 30, 'iron-ingot': 4, 'weapon-gem-g1': 2 }
  world.wallet = { ...world.wallet, laurels: 650, timeTickets: 528 }
  world.grant = GRANT
  return save
}
/** The same world after v29: the made item stays, the materials go, the sheet lists only the Laurels. */
const V29_WORLD = { items: { 'weapon-gem-g1': 2 }, grant: { ...GRANT, back: { laurels: 650, items: 0, stock: 0 } } }

describe('the Firestore save repository (D45, D69)', () => {
  beforeEach(() => store.clear())

  it('runs on save v29 since D221', () => {
    expect(V).toBe(29)
  })

  it('keeps saveBackups/{uid}-v28 on the first v29 write, and no backup on later v29 writes', async () => {
    const repo = new FirestoreSaveRepository()
    const v28 = { revision: 7, save: storedV28('Luis') }
    store.set('saves/u', structuredClone(v28))
    // Loading parses (and migrates) what's stored: the materials go, the tickets and Laurels stay; nothing is written.
    const loaded = await repo.load('u')
    expect(loaded.revision).toBe(7)
    expect(loaded.save?.schemaVersion).toBe(29)
    expect(loaded.save?.tierWorlds['1']).toMatchObject(V29_WORLD)
    expect(loaded.save?.tierWorlds['1']!.wallet).toMatchObject({ laurels: 650, timeTickets: 528 })
    expect(store.get('saves/u')).toEqual(v28)
    expect(store.has('saveBackups/u-v28')).toBe(false)
    // The new app's first write: v29 is stored, and the v28 document is copied whole first.
    const next = await repo.put('u', 7, loaded.save!, 29)
    expect(next.revision).toBe(8)
    expect(store.get('saveBackups/u-v28')).toEqual({ ...v28, backedUpAt: SERVER_TIME })
    expect(store.get('saves/u')).toMatchObject({ revision: 8, save: { schemaVersion: 29, tierWorlds: { '1': V29_WORLD } } })
    // A later v29 write over v29 backs nothing up.
    store.delete('saveBackups/u-v28')
    await repo.put('u', 8, loaded.save!, 29)
    expect([...store.keys()]).toEqual(['saves/u'])
  })

  it('stores an old app’s write as v29 with the same backup while v28 is stored, then refuses its next one (D45)', async () => {
    const repo = new FirestoreSaveRepository()
    store.set('saves/u', { revision: 3, save: storedV28('Luis') })
    // The API parses every save it's sent to the current version (`parseSavePut`), so a v28 app's body arrives as v29.
    const sent = (await repo.load('u')).save as Save
    await repo.put('u', 3, sent, 28)
    expect(store.get('saves/u')).toMatchObject({ revision: 4, save: { schemaVersion: 29 } })
    expect(store.has('saveBackups/u-v28')).toBe(true)
    // Now v29 is stored: the old app's next write is refused with what's stored, and nothing changes.
    await expect(repo.put('u', 4, sent, 28)).rejects.toBeInstanceOf(RevisionConflict)
    expect(store.get('saves/u')).toMatchObject({ revision: 4 })
  })
})
