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

  /**
   * Find all ecb exchange rates filtered by creation date and currency alias from db
   * @param created the date when records were created
   * @param currencyAlias ecb currency alias
   * @returns Promise<any>
   */
  async findAll(created: string, currencyAlias: EcbCurrency): Promise<any> {
    return this.ecbExchangeRatesEntityRepository.findBy({
      created: created
        ? MoreThanOrEqual(created)
        : Raw((created) => `${created} >= :date`, { date: '2023-02-01' }),
      currency_alias: currencyAlias ? Equal(currencyAlias) : Not(''),
    });
  }

  /**
   * Find specific ecb exchange rate by UUID
   * @param recordId ecb exchange rate UUID
   * @returns Promise<EcbExchangeRatesEntity>
   */
  async findById(recordId: string): Promise<EcbExchangeRatesEntity> {
    return this.ecbExchangeRatesEntityRepository.findOne({
      where: { record_id: recordId },
    });
  }
}
