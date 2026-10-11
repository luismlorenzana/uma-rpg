import * as admin from 'firebase-admin'

/** A browser's push subscription, as `PushSubscription.toJSON()` gives it. */
export interface Subscription { endpoint: string; keys: { p256dh: string; auth: string } }
/** `push/{uid}`: where to push, and up to when finishes were already announced (D63). */
export interface PushRecord { uid: string; subscriptions: Subscription[]; checkedAt: number }

export interface PushRepository {
  get(uid: string): Promise<PushRecord | null>
  /** Accounts with at least one subscription. */
  all(): Promise<PushRecord[]>
  put(record: PushRecord): Promise<void>
}

export const PUSH_REPOSITORY = Symbol('PUSH_REPOSITORY')

export class FirestorePushRepository implements PushRepository {
  private col(): admin.firestore.CollectionReference {
    if (admin.apps.length === 0) admin.initializeApp()
    return admin.firestore().collection('push')
  }

  async get(uid: string): Promise<PushRecord | null> {
    const snap = await this.col().doc(uid).get()
    return snap.exists ? { uid, ...(snap.data() as Omit<PushRecord, 'uid'>) } : null
  }

  async all(): Promise<PushRecord[]> {
    const snap = await this.col().where('active', '==', true).get()
    return snap.docs.map((d) => ({ uid: d.id, ...(d.data() as Omit<PushRecord, 'uid'>) }))
  }

  async put({ uid, subscriptions, checkedAt }: PushRecord): Promise<void> {
    await this.col().doc(uid).set({ subscriptions, checkedAt, active: subscriptions.length > 0 })
  }
}

/** Local development: kept in memory (nothing can be pushed without VAPID keys anyway). */
export class MemoryPushRepository implements PushRepository {
  private readonly records = new Map<string, PushRecord>()
  async get(uid: string): Promise<PushRecord | null> {
    return this.records.get(uid) ?? null
  }
  async all(): Promise<PushRecord[]> {
    return [...this.records.values()].filter((r) => r.subscriptions.length > 0)
  }
  async put(record: PushRecord): Promise<void> {
    this.records.set(record.uid, record)
  }
}
