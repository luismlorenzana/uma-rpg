// The device save (D32): one Dexie row holding the whole snapshot, its last synced revision and a dirty flag.
import type { Table } from 'dexie'
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
}

let tablePromise: Promise<Table<SaveRow, string>> | null = null
function saveTable(): Promise<Table<SaveRow, string>> {
  tablePromise ??= (async () => {
    const { default: Dexie } = await import('dexie')
    const database = new Dexie('uma-rpg')
    database.version(1).stores({ save: 'id' })
    return database.table<SaveRow, string>('save')
  })().catch((error: unknown) => { tablePromise = null; throw error })
  return tablePromise
}

/** Same row/storage contract, initialized only when asynchronous device I/O starts. */
export const db = {
  save: {
    get: async (id: string) => (await saveTable()).get(id),
    put: async (row: SaveRow) => (await saveTable()).put(row),
    clear: async () => (await saveTable()).clear(),
  },
}

export async function readSaveRow(uid: string): Promise<SaveRow | null> {
  try {
    const row = await db.save.get('main')
    if (!row || row.uid !== uid) return null
    // Older app versions stored older save versions: parse migrates them (D45). An unreadable row is ignored, and
    // boot falls back to the server's save.
    return { ...row, save: await parseSaveAsync(row.save) }
  } catch {
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
