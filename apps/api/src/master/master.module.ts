import { resolve } from 'node:path'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AuthGuard } from '../auth/auth.guard'
import { BucketMasterSource, DirectoryMasterSource, type MasterSource } from './master-source'
import { MASTER_SOURCE, MasterController } from './master.controller'

@Module({
  controllers: [MasterController],
  providers: [
    AuthGuard,
    {
      provide: MASTER_SOURCE,
      inject: [ConfigService],
      useFactory: (config: ConfigService): MasterSource => {
        const bucket = config.get<string>('MASTER_BUCKET')
        if (bucket) return new BucketMasterSource(bucket)
        return new DirectoryMasterSource(resolve(process.cwd(), config.get<string>('MASTER_DIR') ?? '../../../uma-platform/content/release'))
      },
    },
  ],
})
export class MasterModule {}
