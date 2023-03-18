import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EcbExchangeRatesTask } from './cron/ecb-exchange-rates-task.service';
import { EcbExchangeRatesSaveService } from './ecb-exchange-rates-save.service';
import { EcbExchangeRatesController } from './ecb-exchange-rates.controller';
import { EcbExchangeRatesEntity } from './entity/ecb-exchange-rates.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([EcbExchangeRatesEntity]),
    HttpModule,
    ScheduleModule.forRoot(),
  ],
  providers: [EcbExchangeRatesSaveService, EcbExchangeRatesTask],
  controllers: [EcbExchangeRatesController],
  exports: [EcbExchangeRatesSaveService, EcbExchangeRatesTask],
})
export class EcbExchangeRatesModule {}
