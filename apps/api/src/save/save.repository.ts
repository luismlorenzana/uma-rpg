import type { Save, SaveEnvelope } from '@rpg/domain'

/** A stale write: the stored revision moved on. Carries what's stored so the client can merge (D32). */
export class RevisionConflict extends Error {
  readonly current: SaveEnvelope
  constructor(current: SaveEnvelope) {
    super(`revision conflict: stored ${current.revision}`)
    this.name = 'RevisionConflict'
    this.current = current
  }
}

// One snapshot document per account (D32). Local JSON file in dev, Firestore in production.
export interface SaveRepository {
  load(uid: string): Promise<SaveEnvelope>
  /**
   * Stores `save` as `baseRevision + 1` when the stored revision equals `baseRevision` and the client's save version
   * isn't older than the stored one (D45); otherwise RevisionConflict with what's stored.
   */
  put(uid: string, baseRevision: number, save: Save, sentSchemaVersion: number): Promise<SaveEnvelope>
  /** Keeps an upload this server refused, as sent, in place of the one kept before (D260): the device may be its only copy. */
  rescue(uid: string, upload: unknown, reason: string): Promise<void>
}

export const SAVE_REPOSITORY = Symbol('SAVE_REPOSITORY')

export const EMPTY_ENVELOPE: SaveEnvelope = { revision: 0, save: null }
