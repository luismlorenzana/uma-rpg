import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ContentModule } from './content/content.module'
import { HealthController } from './health.controller'
import { MasterModule } from './master/master.module'
import { SaveModule } from './save/save.module'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), SaveModule, MasterModule, ContentModule],
  controllers: [HealthController],
})
export class AppModule {}
