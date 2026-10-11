import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AuthGuard } from '../auth/auth.guard'
import { SaveModule } from '../save/save.module'
import { PushController } from './push.controller'
import { FirestorePushRepository, MemoryPushRepository, PUSH_REPOSITORY, type PushRepository } from './push.repository'
import { PushSender } from './push.sender'
import { PushService } from './push.service'
import { SchedulerGuard } from './scheduler.guard'

@Module({
  imports: [SaveModule],
  controllers: [PushController],
  providers: [
    AuthGuard,
    SchedulerGuard,
    PushSender,
    PushService,
    {
      provide: PUSH_REPOSITORY,
      inject: [ConfigService],
      useFactory: (config: ConfigService): PushRepository =>
        (config.get<string>('PERSISTENCE') ?? 'local') === 'firestore' ? new FirestorePushRepository() : new MemoryPushRepository(),
    },
  ],
})
export class PushModule {}
