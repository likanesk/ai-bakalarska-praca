import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { EcbExchangeRatesSaveService } from './ecb-exchange-rates-save.service';
import { EcbExchangeRatesEntity } from './entity/ecb-exchange-rates.entity';

@ApiBearerAuth('JWT')
@ApiTags('ECB exchange rates')
@UseGuards(JwtAuthGuard)
@Controller('ecb-exchange-rates')
export class EcbExchangeRatesController {
  constructor(
    private ecbExchangeRatesSaveService: EcbExchangeRatesSaveService,
  ) {}

  @ApiOperation({
    summary: 'Return all today ecb exchange rates FROM ECB Api - manually',
  })
  @Get('eurofxrefDaily')
  storeDailyEcbER(): Promise<EcbExchangeRatesEntity> {
    return this.ecbExchangeRatesSaveService.storeDailyEcbER();
  }
}
