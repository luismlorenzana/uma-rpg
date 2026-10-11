import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import webpush from 'web-push'
import type { Subscription } from './push.repository'

export type SendResult = 'sent' | 'gone' | 'failed'

/**
 * Web Push with the app's VAPID keys (Secret Manager `rpg-vapid`, given to Cloud Run as VAPID_KEYS =
 * {"publicKey","privateKey"}). Without them push is off: the key endpoint answers 404 and the app hides the switch.
 */
@Injectable()
export class PushSender {
  readonly publicKey: string | null
  private readonly privateKey: string | null
  private readonly subject: string

  constructor(config: ConfigService) {
    let keys: { publicKey?: string; privateKey?: string } = {}
    try {
      keys = JSON.parse(config.get<string>('VAPID_KEYS') ?? '{}') as typeof keys
    } catch {
      keys = {}
    }
    this.publicKey = keys.publicKey ?? null
    this.privateKey = keys.privateKey ?? null
    // Push services want a contact: the site itself, not anyone's address.
    this.subject = (config.get<string>('ALLOWED_ORIGIN') ?? 'https://uma-rpg.web.app').split(',')[0]!.trim()
  }

  get enabled(): boolean {
    return !!this.publicKey && !!this.privateKey
  }

  async send(sub: Subscription, payload: object): Promise<SendResult> {
    if (!this.enabled) return 'failed'
    try {
      await webpush.sendNotification(sub, JSON.stringify(payload), {
        TTL: 6 * 3600,
        urgency: 'normal',
        vapidDetails: { subject: this.subject, publicKey: this.publicKey!, privateKey: this.privateKey! },
      })
      return 'sent'
    } catch (err) {
      const status = (err as { statusCode?: number }).statusCode
      // 404 and 410: the subscription is gone (the app was removed or notifications turned off).
      return status === 404 || status === 410 ? 'gone' : 'failed'
    }
  }
}
