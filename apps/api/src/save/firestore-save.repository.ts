import * as admin from 'firebase-admin'
import { parseSave, schemaVersionOf, type Save, type SaveEnvelope } from '@rpg/domain'
import { EMPTY_ENVELOPE, RevisionConflict, type SaveRepository } from './save.repository'

// Production persistence: `saves/{uid}` = { revision, save }, revision-checked inside a transaction. When a newer save
// version replaces a stored one, the stored document is first copied to `saveBackups/{uid}-v{n}` (D69): a schema
// migration (such as v10's progress reset) can then be undone by hand.
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

  put(uid: string, baseRevision: number, save: Save, sentSchemaVersion: number): Promise<SaveEnvelope> {
    const ref = this.db().collection('saves').doc(uid)
    return this.db().runTransaction(async (tx) => {
      const snapshot = await tx.get(ref)
      const current = FirestoreSaveRepository.envelope(snapshot)
      const storedVersion = snapshot.exists ? schemaVersionOf((snapshot.data() as { save?: unknown }).save) : 0
      if (current.revision !== baseRevision || sentSchemaVersion < storedVersion) throw new RevisionConflict(current)
      if (snapshot.exists && save.schemaVersion > storedVersion) {
        const backup = this.db().collection('saveBackups').doc(`${uid}-v${storedVersion}`)
        tx.set(backup, { ...snapshot.data(), backedUpAt: admin.firestore.FieldValue.serverTimestamp() })
      }
      const next = { revision: baseRevision + 1, save }
      tx.set(ref, { ...next, updatedAt: admin.firestore.FieldValue.serverTimestamp() })
      return next
    })
  }
}
