import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { Request } from 'express'
import { OAuth2Client } from 'google-auth-library'

/**
 * Lets only Cloud Scheduler's tick in: a Google-signed OIDC token for the scheduler's service account
 * (PUSH_SCHEDULER_EMAIL), minted for this API's URL (PUSH_AUDIENCE). AUTH_MODE=disabled lets anything in locally.
 */
@Injectable()
export class SchedulerGuard implements CanActivate {
  private readonly client = new OAuth2Client()
  constructor(private readonly config: ConfigService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    if (this.config.get<string>('AUTH_MODE') === 'disabled') return true
    const email = this.config.get<string>('PUSH_SCHEDULER_EMAIL')
    const audience = this.config.get<string>('PUSH_AUDIENCE')
    if (!email || !audience) throw new UnauthorizedException('push scheduler not configured')
    const header = ctx.switchToHttp().getRequest<Request>().headers.authorization ?? ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : ''
    if (!token) throw new UnauthorizedException('missing bearer token')
    try {
      const payload = (await this.client.verifyIdToken({ idToken: token, audience })).getPayload()
      if (payload?.email === email && payload.email_verified) return true
    } catch {
      // falls through
    }
    throw new UnauthorizedException('not the scheduler')
  }
}
