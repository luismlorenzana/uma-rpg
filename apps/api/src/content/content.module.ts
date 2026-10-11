import { resolve } from 'node:path'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AuthGuard } from '../auth/auth.guard'
import { BucketMasterSource, type MasterSource } from '../master/master-source'
import { DirectoryContentSource } from './content-source'
import { CONTENT_SOURCE, ContentController } from './content.controller'

@Module({
  controllers: [ContentController],
  providers: [
    AuthGuard,
    {
      provide: CONTENT_SOURCE,
      inject: [ConfigService],
      useFactory: (config: ConfigService): MasterSource => {
        const bucket = config.get<string>('CONTENT_BUCKET')
        if (bucket) return new BucketMasterSource(bucket)
        return new DirectoryContentSource(resolve(process.cwd(), config.get<string>('CONTENT_DIR') ?? '../../content/release'))
      },
    },
  ],
})
export class ContentModule {}
