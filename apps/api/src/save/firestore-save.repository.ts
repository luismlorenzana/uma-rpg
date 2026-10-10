import * as admin from 'firebase-admin'
import { parseSave, type Save, type SaveEnvelope } from '@rpg/domain'
import { EMPTY_ENVELOPE, RevisionConflict, type SaveRepository } from './save.repository'

// Production persistence: `saves/{uid}` = { revision, save }, revision-checked inside a transaction.
export class FirestoreSaveRepository implements SaveRepository {
  private db(): admin.firestore.Firestore {
    if (admin.apps.length === 0) admin.initializeApp()
    return admin.firestore()
  }

  private static envelope(snapshot: admin.firestore.DocumentSnapshot): SaveEnvelope {
    if (!snapshot.exists) return EMPTY_ENVELOPE
    const data = snapshot.data() as { revision?: unknown; save?: unknown }
    return { revision: Number(data.revision ?? 0), save: parseSave(data.save) }
  }

  async load(uid: string): Promise<SaveEnvelope> {
    return FirestoreSaveRepository.envelope(await this.db().collection('saves').doc(uid).get())
  }

  put(uid: string, baseRevision: number, save: Save): Promise<SaveEnvelope> {
    const ref = this.db().collection('saves').doc(uid)
    return this.db().runTransaction(async (tx) => {
      const current = FirestoreSaveRepository.envelope(await tx.get(ref))
      if (current.revision !== baseRevision) throw new RevisionConflict(current)
      const next = { revision: baseRevision + 1, save }
      tx.set(ref, { ...next, updatedAt: admin.firestore.FieldValue.serverTimestamp() })
      return next
    })
  }
}
