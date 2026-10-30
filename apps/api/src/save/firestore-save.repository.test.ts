// The production repository's backup on a schema change (D69), against an in-memory Firestore: a schema bump (H134's v32, the
// reset; D261's v33, the trim; D264's v34, three accessory slots) must keep the stored save whole, so the first new write over a stored v31 save keeps
// `saveBackups/{uid}-v31`. Invented data only.
import { newOwnedUma, newSave, parseSavePut, SAVE_SCHEMA_VERSION as V, type Save } from '@rpg/domain'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { FirestoreSaveRepository } from './firestore-save.repository'
import { RevisionConflict } from './save.repository'

type Doc = Record<string, unknown>
const store = new Map<string, Doc>()
const SERVER_TIME = { serverTimestamp: true }
/** Firestore's own refusal (D260): "Property save contains an invalid nested entity". */
const nestedList = (value: unknown, inList = false): boolean => (Array.isArray(value)
  ? inList || value.some((v) => nestedList(v, true))
  : typeof value === 'object' && value !== null && Object.values(value).some((v) => nestedList(v)))
const strict = (data: Doc): Doc => {
  if (nestedList(data)) throw new Error('3 INVALID_ARGUMENT: Property save contains an invalid nested entity.')
  return structuredClone(data)
}

vi.mock('firebase-admin', () => {
  const snapshot = (path: string) => ({ exists: store.has(path), data: () => (store.has(path) ? structuredClone(store.get(path)) : undefined) })
  const ref = (path: string) => ({ path, get: async () => snapshot(path), set: async (data: Doc) => { store.set(path, strict(data)) } })
  const db = {
    collection: (name: string) => ({ doc: (id: string) => ref(`${name}/${id}`) }),
    runTransaction: async <T>(fn: (tx: unknown) => Promise<T>): Promise<T> => {
      const writes: [string, Doc][] = []
      const result = await fn({ get: async (r: { path: string }) => snapshot(r.path), set: (r: { path: string }, data: Doc) => { writes.push([r.path, data]) } })
      for (const [path, data] of writes) store.set(path, strict(data))
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

  it('runs on save v34 since D264', () => {
    expect(V).toBe(34)
  })

  it('keeps saveBackups/{uid}-v31 on the first v34 write, and no backup on later v34 writes', async () => {
    const repo = new FirestoreSaveRepository()
    const v31 = { revision: 7, save: storedV31('Luis') }
    store.set('saves/u', structuredClone(v31))
    // Loading migrates what's stored to v34 (the reset applied) and writes nothing.
    const loaded = await repo.load('u')
    expect(loaded.revision).toBe(7)
    expect(loaded.save?.schemaVersion).toBe(34)
    expect(loaded.save?.tierWorlds['1']).toMatchObject(RESET)
    expect(loaded.save?.tierWorlds['1']!.heroes).not.toHaveProperty('paladin-1')
    expect(store.get('saves/u')).toEqual(v31)
    expect(store.has('saveBackups/u-v31')).toBe(false)
    // The new app's first write: v34 is stored, and the v31 document is copied whole first.
    const next = await repo.put('u', 7, loaded.save!, V)
    expect(next.revision).toBe(8)
    expect(store.get('saveBackups/u-v31')).toEqual({ ...v31, backedUpAt: SERVER_TIME })
    expect(store.get('saves/u')).toMatchObject({ revision: 8 })
    expect(JSON.parse(store.get('saves/u')!.save as string)).toMatchObject({ schemaVersion: 34, tierWorlds: { '1': RESET } })
    // A later v33 write over v33 backs nothing up.
    store.delete('saveBackups/u-v31')
    await repo.put('u', 8, loaded.save!, V)
    expect([...store.keys()]).toEqual(['saves/u'])
  })

  it('stores an old app’s v31 write as v33 with the same backup while v31 is stored, then refuses its next one (D45)', async () => {
    const repo = new FirestoreSaveRepository()
    store.set('saves/u', { revision: 3, save: storedV31('Luis') })
    // The API parses every save it's sent to the current version (`parseSavePut`), so a v31 app's body arrives as v33:
    // her reset applied (a Warrior, the Healer Sanctum's Hero, her Manuals in the wallet).
    const sent = parseSavePut({ baseRevision: 3, save: storedV31('Luis') })
    expect(sent.sentSchemaVersion).toBe(31)
    expect(sent.save.tierWorlds['1']).toMatchObject(RESET)
    await repo.put('u', 3, sent.save, sent.sentSchemaVersion)
    expect(store.get('saves/u')).toMatchObject({ revision: 4 })
    expect(JSON.parse(store.get('saves/u')!.save as string)).toMatchObject({ schemaVersion: 34, tierWorlds: { '1': RESET } })
    expect(store.get('saveBackups/u-v31')).toMatchObject({ revision: 3, save: { schemaVersion: 31 } })
    // Now v34 is stored: the old app's next write is refused with what's stored, and nothing changes.
    await expect(repo.put('u', 4, sent.save, 31)).rejects.toBeInstanceOf(RevisionConflict)
    expect(store.get('saves/u')).toMatchObject({ revision: 4 })
  })

  // D260: the failure that stranded 2026-10-26's saves on the device. Firestore refuses a list inside a list, and an open
  // Convergence attempt's parties are one, so a map write failed; text can't.
  it('stores a save holding a list inside a list, which a map write can\'t', async () => {
    const repo = new FirestoreSaveRepository()
    const save = { ...newSave('Luis', NOW), parties: [['101', '102'], ['103']] } as unknown as Save
    await expect(repo.put('u', 0, save, V)).resolves.toMatchObject({ revision: 1 })
    expect(store.get('saves/u')).toMatchObject({ revision: 1, updatedAt: SERVER_TIME })
    expect(JSON.parse(store.get('saves/u')!.save as string)).toEqual(JSON.parse(JSON.stringify(save)))
  })

  it('reads a save stored as text, and a map stored before it, and converts the map on its next write', async () => {
    const repo = new FirestoreSaveRepository()
    const save = newSave('Luis', NOW)
    store.set('saves/u', { revision: 5, save: JSON.parse(JSON.stringify(save)) as Doc })
    expect((await repo.load('u')).save?.account.trainerName).toBe('Luis')
    await repo.put('u', 5, save, V)
    expect(typeof store.get('saves/u')!.save).toBe('string')
    expect(await repo.load('u')).toMatchObject({ revision: 6, save: { account: { trainerName: 'Luis' } } })
    await expect(repo.put('u', 5, save, V)).rejects.toBeInstanceOf(RevisionConflict)
  })

  it('compares a stored text save\'s version as it did a map\'s (D45)', async () => {
    const repo = new FirestoreSaveRepository()
    const save = newSave('Luis', NOW)
    await repo.put('u', 0, save, V)
    await expect(repo.put('u', 1, save, 31)).rejects.toBeInstanceOf(RevisionConflict)
    expect(store.get('saves/u')).toMatchObject({ revision: 1 })
  })

  it('keeps the newest refused upload as sent, whatever its shape (D260)', async () => {
    const repo = new FirestoreSaveRepository()
    await repo.rescue('u', { baseRevision: 3, save: { odd: [[1], [2]] } }, 'first')
    await repo.rescue('u', { baseRevision: 4, save: { odd: [[3]] } }, 'second')
    expect(store.get('saveRescues/u')).toEqual({ upload: '{"baseRevision":4,"save":{"odd":[[3]]}}', reason: 'second', rescuedAt: SERVER_TIME })
  })
})
