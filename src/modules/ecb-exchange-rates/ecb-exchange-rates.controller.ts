import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { EcbExchangeRatesSaveService } from './ecb-exchange-rates-save.service';
import { EcbExchangeRatesService } from './ecb-exchange-rates.service';
import { EcbExchangeRatesEntity } from './entity/ecb-exchange-rates.entity';
import { EcbCurrency } from './type/enum/currency.enum';

@ApiBearerAuth('JWT')
@ApiTags('ECB exchange rates')
@UseGuards(JwtAuthGuard)
@Controller('ecb-exchange-rates')
export class EcbExchangeRatesController {
  constructor(
    private ecbExchangeRatesService: EcbExchangeRatesService,
    private ecbExchangeRatesSaveService: EcbExchangeRatesSaveService,
  ) {}

  @ApiOperation({
    summary: 'Return ecb exchange rates with filter created, currency',
  })
  @ApiQuery({
    name: 'created',
    type: 'string',
    required: false,
    example: new Date().toJSON().slice(0, 10),
  })
  @ApiQuery({ name: 'currencyAlias', required: false, enum: EcbCurrency })
  @Get('records')
  getRecords(
    @Query('created') created: string,
    @Query('currencyAlias') currencyAlias: EcbCurrency,
  ): Promise<EcbExchangeRatesEntity[]> {
    return this.ecbExchangeRatesService.findAll(created, currencyAlias);
  }

  @ApiOperation({
    summary: 'Return one ecb exchange rate for specific record_id - UUID',
  })
  @ApiParam({
    name: 'recordId',
    required: true,
    description: 'Enter a record_id in UUID format',
    schema: { type: 'string' },
    type: 'uuid',
  })
  @Get('record/:recordId')
  getRecord(
    @Param('recordId', new ParseUUIDPipe()) recordId: string,
  ): Promise<EcbExchangeRatesEntity> {
    return this.ecbExchangeRatesService.findById(recordId);
  }

  @ApiOperation({
    summary: 'Return all today ecb exchange rates FROM ECB Api - manually',
  })
  @Get('eurofxrefDaily')
  storeDailyEcbER(): Promise<EcbExchangeRatesEntity> {
    return this.ecbExchangeRatesSaveService.storeDailyEcbER();
  }
}
