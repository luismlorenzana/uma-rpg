// The production repository's backup on a schema change (D69), against an in-memory Firestore: H134 turns save v32 on
// (Classes v3's reset and the Healer Sanctum's merge), so the first v32 write over a stored v31 save must keep
// `saveBackups/{uid}-v31` whole. Invented data only.
import { newOwnedUma, newSave, parseSavePut, SAVE_SCHEMA_VERSION as V } from '@rpg/domain'
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

const NOW = '2026-10-29T12:00:00.000Z'
/** A save as the app before H134 stored it (engine v18's constructors, save v31): a Tier 1 world with a Brawler R12 who
 * is the Paladin Bastion's `paladin-1` Hero at Bond 3, and 1,000 Class Marks banked. */
const storedV31 = (name: string): Doc => {
  const save = JSON.parse(JSON.stringify(newSave(name, NOW, 18))) as Doc
  save.schemaVersion = 31
  const world = (save.tierWorlds as Record<string, Doc & { umas: Record<string, Doc>; wallet: Doc }>)['1']!
  world.umas['101'] = { ...JSON.parse(JSON.stringify(newOwnedUma(NOW, 'brawler', 18))) as Doc, level: 12,
    ranks: { classes: { brawler: { rank: 12, exp: 0 } } }, bonds: { 'paladin-1': { level: 3, exp: 0 } } }
  world.heroes = { 'paladin-1': { hero: '101', learners: [] } }
  world.wallet = { ...world.wallet, laurels: 650, classMarks: 1000 }
  return save
}
/** Her refund (CV §8.2): Brawler R12 bar 0 is 2,376 EXP, + the first 1,800 again, ⌈4,176 ÷ 1,000⌉ = 5 Class Manuals. */
const MANUALS = 5
/** What the reset leaves: a Warrior (class null: her calling's Tier 0), no Class Ranks, the Healer Sanctum's seat 1. */
const RESET = {
  umas: { 101: { level: 12, classId: null, ranks: { classes: {} }, bonds: { 'healer-1': { level: 3, exp: 0 } } } },
  heroes: { 'healer-1': { hero: '101', learners: [] } },
  wallet: { laurels: 650, classMarks: 1000 + MANUALS * 1000 },
  classesV3: { manuals: MANUALS, marks: MANUALS * 1000, umas: { 101: { classId: 'brawler', manuals: MANUALS } } },
}

describe('the Firestore save repository (D45, D69)', () => {
  beforeEach(() => store.clear())

  it('runs on save v32 since H134', () => {
    expect(V).toBe(32)
  })

  it('keeps saveBackups/{uid}-v31 on the first v32 write, and no backup on later v32 writes', async () => {
    const repo = new FirestoreSaveRepository()
    const v31 = { revision: 7, save: storedV31('Luis') }
    store.set('saves/u', structuredClone(v31))
    // Loading migrates what's stored to v32 (the reset applied) and writes nothing.
    const loaded = await repo.load('u')
    expect(loaded.revision).toBe(7)
    expect(loaded.save?.schemaVersion).toBe(32)
    expect(loaded.save?.tierWorlds['1']).toMatchObject(RESET)
    expect(loaded.save?.tierWorlds['1']!.heroes).not.toHaveProperty('paladin-1')
    expect(store.get('saves/u')).toEqual(v31)
    expect(store.has('saveBackups/u-v31')).toBe(false)
    // The new app's first write: v32 is stored, and the v31 document is copied whole first.
    const next = await repo.put('u', 7, loaded.save!, 32)
    expect(next.revision).toBe(8)
    expect(store.get('saveBackups/u-v31')).toEqual({ ...v31, backedUpAt: SERVER_TIME })
    expect(store.get('saves/u')).toMatchObject({ revision: 8, save: { schemaVersion: 32, tierWorlds: { '1': RESET } } })
    // A later v32 write over v32 backs nothing up.
    store.delete('saveBackups/u-v31')
    await repo.put('u', 8, loaded.save!, 32)
    expect([...store.keys()]).toEqual(['saves/u'])
  })

  it('stores an old app’s v31 write as v32 with the same backup while v31 is stored, then refuses its next one (D45)', async () => {
    const repo = new FirestoreSaveRepository()
    store.set('saves/u', { revision: 3, save: storedV31('Luis') })
    // The API parses every save it's sent to the current version (`parseSavePut`), so a v31 app's body arrives as v32:
    // her reset applied (a Warrior, the Healer Sanctum's Hero, her Manuals in the wallet).
    const sent = parseSavePut({ baseRevision: 3, save: storedV31('Luis') })
    expect(sent.sentSchemaVersion).toBe(31)
    expect(sent.save.tierWorlds['1']).toMatchObject(RESET)
    await repo.put('u', 3, sent.save, sent.sentSchemaVersion)
    expect(store.get('saves/u')).toMatchObject({ revision: 4, save: { schemaVersion: 32, tierWorlds: { '1': RESET } } })
    expect(store.get('saveBackups/u-v31')).toMatchObject({ revision: 3, save: { schemaVersion: 31 } })
    // Now v32 is stored: the old app's next write is refused with what's stored, and nothing changes.
    await expect(repo.put('u', 4, sent.save, 31)).rejects.toBeInstanceOf(RevisionConflict)
    expect(store.get('saves/u')).toMatchObject({ revision: 4 })
  })
})
