import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EcbExchangeRatesController } from './ecb-exchange-rates.controller';
import { EcbExchangeRatesSaveService } from './ecb-exchange-rates-save.service';
import { EcbExchangeRatesEntity } from './entity/ecb-exchange-rates.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EcbExchangeRatesEntity]), HttpModule],
  providers: [EcbExchangeRatesSaveService],
  controllers: [EcbExchangeRatesController],
  exports: [EcbExchangeRatesSaveService],
})
export class EcbExchangeRatesModule {}
