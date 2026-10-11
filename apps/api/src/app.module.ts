import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ContentModule } from './content/content.module'
import { HealthController } from './health.controller'
import { MasterModule } from './master/master.module'
import { PushModule } from './push/push.module'
import { SaveModule } from './save/save.module'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), SaveModule, MasterModule, ContentModule, PushModule],
  controllers: [HealthController],
})
export class AppModule {}
