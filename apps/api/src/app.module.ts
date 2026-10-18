import { AuthModule, authMode } from '@luismlorenzana/uma-server/auth'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ContentModule } from './content/content.module'
import { HealthController } from './health.controller'
import { MasterModule } from './master/master.module'
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
    SaveModule, MasterModule, ContentModule, PushModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
