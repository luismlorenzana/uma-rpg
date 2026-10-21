import { resolve } from 'node:path'
import { AuthModule, authMode } from '@luismlorenzana/uma-server/auth'
import { PrivatePackModule, ReleaseProxyModule } from '@luismlorenzana/uma-server/content'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { HealthController } from './health.controller'
import { PushModule } from './push/push.module'
import { SaveModule } from './save/save.module'

// Every route sits behind the shared guard (uma-platform P54, SD3): a Firebase ID token for the owner's email, or the
// fixed local user with AUTH_MODE=disabled. `@Public()` opens a route: /api/health, and the push tick, which keeps its
// own OIDC guard.
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({ mode: authMode(config.get<string>('AUTH_MODE')), allowedEmail: config.get<string>('ALLOWED_EMAIL') ?? '' }),
    }),
    ReleaseProxyModule.forRoot({
      route: 'master',
      bucket: process.env.MASTER_BUCKET,
      dir: resolve(process.cwd(), process.env.MASTER_DIR ?? '../../../uma-platform/content/release'),
    }),
    PrivatePackModule.forRoot({
      route: 'content',
      bucket: process.env.CONTENT_BUCKET,
      dir: resolve(process.cwd(), process.env.CONTENT_DIR ?? '../../content/enemies-release'),
      allow: ['enemies.json', /enemies\/[a-z0-9]+(-[a-z0-9]+)*-(face|art|splash)\.[a-f0-9]{8}\.webp/],
    }),
    SaveModule, PushModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
