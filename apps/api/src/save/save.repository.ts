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
  /** Stores `save` as `baseRevision + 1` when the stored revision equals `baseRevision`; otherwise RevisionConflict. */
  put(uid: string, baseRevision: number, save: Save): Promise<SaveEnvelope>
}

export const SAVE_REPOSITORY = Symbol('SAVE_REPOSITORY')

export const EMPTY_ENVELOPE: SaveEnvelope = { revision: 0, save: null }
