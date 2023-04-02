import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EcbExchangeRatesTask } from './cron/ecb-exchange-rates-task.service';
import { EcbExchangeRatesSaveService } from './ecb-exchange-rates-save.service';
import { EcbExchangeRatesController } from './ecb-exchange-rates.controller';
import { EcbExchangeRatesService } from './ecb-exchange-rates.service';
import { EcbExchangeRatesEntity } from './entity/ecb-exchange-rates.entity';
import { LogEntity } from '../system/entity/log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([EcbExchangeRatesEntity, LogEntity]),
    HttpModule,
    ScheduleModule.forRoot(),
  ],
  providers: [
    EcbExchangeRatesService,
    EcbExchangeRatesSaveService,
    EcbExchangeRatesTask,
  ],
  controllers: [EcbExchangeRatesController],
  exports: [
    EcbExchangeRatesService,
    EcbExchangeRatesSaveService,
    EcbExchangeRatesTask,
  ],
})
export class EcbExchangeRatesModule {}
