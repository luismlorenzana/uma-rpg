import { resolve } from 'node:path'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AuthGuard } from '../auth/auth.guard'
import { FirestoreSaveRepository } from './firestore-save.repository'
import { LocalSaveRepository } from './local-save.repository'
import { SaveController } from './save.controller'
import { SAVE_REPOSITORY, type SaveRepository } from './save.repository'

@Module({
  controllers: [SaveController],
  providers: [
    AuthGuard,
    {
      provide: SAVE_REPOSITORY,
      inject: [ConfigService],
      useFactory: (config: ConfigService): SaveRepository =>
        (config.get<string>('PERSISTENCE') ?? 'local') === 'firestore'
          ? new FirestoreSaveRepository()
          : new LocalSaveRepository(resolve(process.cwd(), config.get<string>('LOCAL_SAVE_FILE') ?? '.data/save.json')),
    },
  ],
  exports: [SAVE_REPOSITORY],
})
export class SaveModule {}
