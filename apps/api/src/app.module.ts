import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { HealthController } from './health.controller'
import { MasterModule } from './master/master.module'
import { SaveModule } from './save/save.module'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), SaveModule, MasterModule],
  controllers: [HealthController],
})
export class AppModule {}
