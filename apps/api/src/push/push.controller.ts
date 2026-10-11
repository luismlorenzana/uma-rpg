import { BadRequestException, Body, Controller, Delete, Get, HttpCode, NotFoundException, Post, Put, UseGuards } from '@nestjs/common'
import { AuthGuard, CurrentUid } from '../auth/auth.guard'
import type { Subscription } from './push.repository'
import { PushSender } from './push.sender'
import { PushService } from './push.service'
import { SchedulerGuard } from './scheduler.guard'

function parseSubscription(body: unknown): Subscription {
  const b = body as { endpoint?: unknown; keys?: { p256dh?: unknown; auth?: unknown } } | null
  const ok = (v: unknown, max: number): v is string => typeof v === 'string' && v.length > 0 && v.length <= max
  if (!b || !ok(b.endpoint, 1000) || !b.endpoint.startsWith('https://') || !ok(b.keys?.p256dh, 200) || !ok(b.keys?.auth, 100)) {
    throw new BadRequestException('expected a push subscription')
  }
  return { endpoint: b.endpoint, keys: { p256dh: b.keys.p256dh as string, auth: b.keys.auth as string } }
}

// Push notifications when work and training finish (D63).
@Controller('push')
export class PushController {
  constructor(private readonly push: PushService, private readonly sender: PushSender) {}

  @UseGuards(AuthGuard)
  @Get('key')
  key(): { publicKey: string } {
    if (!this.sender.enabled) throw new NotFoundException('push is off')
    return { publicKey: this.sender.publicKey! }
  }

  @UseGuards(AuthGuard)
  @Put('subscription')
  @HttpCode(204)
  async subscribe(@CurrentUid() uid: string, @Body() body: unknown): Promise<void> {
    await this.push.subscribe(uid, parseSubscription(body))
  }

  @UseGuards(AuthGuard)
  @Delete('subscription')
  @HttpCode(204)
  async unsubscribe(@CurrentUid() uid: string, @Body() body: unknown): Promise<void> {
    await this.push.unsubscribe(uid, parseSubscription(body).endpoint)
  }

  @UseGuards(AuthGuard)
  @Post('test')
  async test(@CurrentUid() uid: string): Promise<{ devices: number }> {
    return { devices: await this.push.test(uid) }
  }

  @UseGuards(SchedulerGuard)
  @Post('tick')
  tick(): Promise<{ accounts: number; sent: number }> {
    return this.push.tick()
  }
}
