// The device save (D32): one Dexie row holding the whole snapshot, its last synced revision and a dirty flag.
import Dexie, { type Table } from 'dexie'
import { parseSave, type Save } from '@rpg/domain'

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

class RpgDb extends Dexie {
  save!: Table<SaveRow, string>
  constructor(name = 'uma-rpg') {
    super(name)
    this.version(1).stores({ save: 'id' })
  }
}

export const db = new RpgDb()

export async function readSaveRow(uid: string): Promise<SaveRow | null> {
  try {
    const row = await db.save.get('main')
    if (!row || row.uid !== uid) return null
    // Older app versions stored older save versions: parse migrates them (D45). An unreadable row is ignored, and
    // boot falls back to the server's save.
    return { ...row, save: parseSave(row.save) }
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
