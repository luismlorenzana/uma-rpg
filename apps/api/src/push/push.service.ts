import { Inject, Injectable } from '@nestjs/common'
import { readyEverywhere, tierNotices } from '@rpg/domain'
import { SAVE_REPOSITORY, type SaveRepository } from '../save/save.repository'
import { PUSH_REPOSITORY, type PushRepository, type Subscription } from './push.repository'
import { PushSender } from './push.sender'

/** How far back a tick looks when the last one was long ago: older finishes aren't news. */
const LOOKBACK_MS = 6 * 3600 * 1000
const MAX_SUBSCRIPTIONS = 5

@Injectable()
export class PushService {
  constructor(
    @Inject(PUSH_REPOSITORY) private readonly records: PushRepository,
    @Inject(SAVE_REPOSITORY) private readonly saves: SaveRepository,
    private readonly sender: PushSender,
  ) {}

  async subscribe(uid: string, sub: Subscription, now = Date.now()): Promise<void> {
    const record = (await this.records.get(uid)) ?? { uid, subscriptions: [], checkedAt: now }
    const others = record.subscriptions.filter((s) => s.endpoint !== sub.endpoint)
    await this.records.put({ ...record, subscriptions: [...others, sub].slice(-MAX_SUBSCRIPTIONS), checkedAt: record.subscriptions.length ? record.checkedAt : now })
  }

  async unsubscribe(uid: string, endpoint: string): Promise<void> {
    const record = await this.records.get(uid)
    if (record) await this.records.put({ ...record, subscriptions: record.subscriptions.filter((s) => s.endpoint !== endpoint) })
  }

  /** Sends one notification to every device of an account; drops devices whose subscription is gone. */
  private async deliver(uid: string, subscriptions: Subscription[], payload: object): Promise<Subscription[]> {
    const results = await Promise.all(subscriptions.map((s) => this.sender.send(s, payload)))
    return subscriptions.filter((_, i) => results[i] !== 'gone')
  }

  async test(uid: string): Promise<number> {
    const record = await this.records.get(uid)
    if (!record) return 0
    const kept = await this.deliver(uid, record.subscriptions, { title: 'Notifications are on', body: 'You’ll hear when work or training finishes.', tag: 'test', url: '/' })
    if (kept.length !== record.subscriptions.length) await this.records.put({ ...record, subscriptions: kept })
    return kept.length
  }

  /** Cloud Scheduler's tick: announce what finished since each account's last check, one notification per tier world with
   * news (H35), each with the badge of every world's ready slots. `sent` counts notifications. */
  async tick(now = Date.now()): Promise<{ accounts: number; sent: number }> {
    let sent = 0
    const records = await this.records.all()
    for (const record of records) {
      const { save } = await this.saves.load(record.uid)
      const from = Math.max(record.checkedAt, now - LOOKBACK_MS)
      const notices = save ? tierNotices(save, from, now) : []
      let subscriptions = record.subscriptions
      if (notices.length > 0 && save) {
        const badge = readyEverywhere(save, new Date(now).toISOString())
        for (const notice of notices) {
          subscriptions = await this.deliver(record.uid, subscriptions, { ...notice, badge })
          sent++
        }
      }
      await this.records.put({ ...record, subscriptions, checkedAt: now })
    }
    return { accounts: records.length, sent }
  }
}
