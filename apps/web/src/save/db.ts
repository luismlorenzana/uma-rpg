// The device save (D32): one Dexie row holding the whole snapshot, its last synced revision and a dirty flag. Safety
// copies (D260) sit beside it: a save kept on this device before anything replaced it, the newest five for each account.
import type { Dexie, Table } from 'dexie'
import { parseSaveAsync, type Save } from '@rpg/domain'

export interface SaveRow {
  id: 'main'
  /** Whose save this is; a different signed-in uid never reads it. */
  uid: string
  /** The server revision this save is based on (0 = never synced). */
  revision: number
  save: Save
  /** Changed since the last successful sync. */
  dirty: boolean
  /** When the server last held everything here (D260), so "not backed up since" survives a restart. */
  lastSyncedAt?: string | null
}

/** Why a safety copy exists: a newer save replaced unsynced changes, a restore replaced this save, or this device's save
 * couldn't be read (kept as it was, for a later build that can). */
export type SafetyReason = 'replaced' | 'restore' | 'unreadable'
export interface SafetyCopy {
  id?: number
  uid: string
  reason: SafetyReason
  at: string
  revision: number
  save: unknown
}
/** The safety copies an account keeps on a device. */
export const SAFETY_COPIES = 5

let databasePromise: Promise<Dexie> | null = null
function database(): Promise<Dexie> {
  databasePromise ??= (async () => {
    const { default: DexieDb } = await import('dexie')
    const opened = new DexieDb('uma-rpg')
    opened.version(1).stores({ save: 'id' })
    opened.version(2).stores({ save: 'id', safety: '++id, uid' })
    return opened
  })().catch((error: unknown) => { databasePromise = null; throw error })
  return databasePromise
}
const saveTable = async (): Promise<Table<SaveRow, string>> => (await database()).table<SaveRow, string>('save')
const safetyTable = async (): Promise<Table<SafetyCopy, number>> => (await database()).table<SafetyCopy, number>('safety')

/** Same row/storage contract, initialized only when asynchronous device I/O starts. */
export const db = {
  save: {
    get: async (id: string) => (await saveTable()).get(id),
    put: async (row: SaveRow) => (await saveTable()).put(row),
    clear: async () => (await saveTable()).clear(),
  },
  safety: {
    clear: async () => (await safetyTable()).clear(),
  },
}

/** The account's safety copies, newest first. */
export async function safetyCopies(uid: string): Promise<SafetyCopy[]> {
  try {
    return (await (await safetyTable()).where('uid').equals(uid).sortBy('id')).reverse()
  } catch {
    return []
  }
}

/** Keeps a save, dropping the account's oldest past `SAFETY_COPIES`. False when it couldn't be kept: nothing may then
 * replace it. */
export async function addSafetyCopy(copy: Omit<SafetyCopy, 'id'>): Promise<boolean> {
  try {
    const table = await safetyTable()
    await table.add(copy)
    const stale = (await safetyCopies(copy.uid)).slice(SAFETY_COPIES).flatMap((c) => (c.id === undefined ? [] : [c.id]))
    await table.bulkDelete(stale)
    return true
  } catch {
    return false
  }
}

export async function readSafetyCopy(id: number): Promise<SafetyCopy | undefined> {
  return (await safetyTable()).get(id)
}

export async function removeSafetyCopy(id: number): Promise<void> {
  await (await safetyTable()).delete(id)
}

export async function readSaveRow(uid: string): Promise<SaveRow | null> {
  let row: SaveRow | undefined
  try {
    row = await db.save.get('main')
    if (!row || row.uid !== uid) return null
    // Older app versions stored older save versions: parse migrates them (D45). An unreadable row is kept as a safety
    // copy (D260), since boot then falls back to the server's save and writes over it.
    return { ...row, save: await parseSaveAsync(row.save) }
  } catch {
    if (row?.uid === uid) await addSafetyCopy({ uid, reason: 'unreadable', at: new Date().toISOString(), revision: row.revision, save: row.save })
    return null
  }
}

export async function writeSaveRow(row: SaveRow): Promise<void> {
  try {
    await db.save.put(row)
  } catch {
    // IndexedDB unavailable (private mode): the store still holds the save and sync still backs it up.
  }
}
