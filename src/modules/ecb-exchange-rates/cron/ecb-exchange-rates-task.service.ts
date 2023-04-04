import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EcbExchangeRatesSaveService } from '../ecb-exchange-rates-save.service';

/**
 * EcbExchangeRatesTask is used to automatically store ECB exchange rates on a daily basis
 */
@Injectable()
export class EcbExchangeRatesTask {
  constructor(
    private ecbExchangeRatesSaveService: EcbExchangeRatesSaveService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_5PM)
  public async storeDailyEcbER() {
    await this.ecbExchangeRatesSaveService.storeDailyEcbER();
  }
}
