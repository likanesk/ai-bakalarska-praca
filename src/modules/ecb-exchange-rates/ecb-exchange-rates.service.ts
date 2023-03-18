import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Equal, MoreThanOrEqual, Not, Raw, Repository } from 'typeorm';

import { EcbExchangeRatesEntity } from './entity/ecb-exchange-rates.entity';
import { EcbCurrency } from './type/enum/currency.enum';

@Injectable()
export class EcbExchangeRatesService {
  constructor(
    @InjectRepository(EcbExchangeRatesEntity)
    private ecbExchangeRatesEntityRepository: Repository<EcbExchangeRatesEntity>,
  ) {}

  async findAll(created: string, currencyAlias: EcbCurrency): Promise<any> {
    return this.ecbExchangeRatesEntityRepository.findBy({
      created: created
        ? MoreThanOrEqual(created)
        : Raw((created) => `${created} >= :date`, { date: '2023-02-01' }),
      currency_alias: currencyAlias ? Equal(currencyAlias) : Not(''),
    });
  }

  async findById(recordId: string): Promise<EcbExchangeRatesEntity> {
    return this.ecbExchangeRatesEntityRepository.findOne({
      where: { record_id: recordId },
    });
  }
}
