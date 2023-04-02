import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import { AxiosError } from 'axios';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { DataSource, EntityManager, Equal, Repository } from 'typeorm';
import { xml2json } from 'xml-js';

import { EcbExchangeRatesEntity } from './entity/ecb-exchange-rates.entity';
import { EcbCurrency } from './type/enum/currency.enum';
import { LogEntity } from '../system/entity/log.entity';

@Injectable()
export class EcbExchangeRatesSaveService {
  constructor(
    @InjectRepository(EcbExchangeRatesEntity)
    private ecbExchangeRatesEntityRepository: Repository<EcbExchangeRatesEntity>,
    @InjectRepository(LogEntity)
    private logRepository: Repository<LogEntity>,
    private dataSource: DataSource,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async storeDailyEcbER(): Promise<EcbExchangeRatesEntity> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<string>(
          this.configService.get('api.ecbExchangeRates.eurofxrefDaily'),
        )
        .pipe(
          catchError((error: AxiosError) => {
            //  log error to DB Table
            const errorLog = new LogEntity();
            errorLog.message = {
              class: 'EcbExchangeRatesSaveService',
              function: 'storeDailyEcbER',
              input: {},
              message: JSON.stringify(error.response.data),
              status: HttpStatus.INTERNAL_SERVER_ERROR,
            };
            this.logRepository.save(errorLog);

            throw error.response.data;
          }),
        ),
    );
    return this.saveRates(data);
  }

  private async saveRates(data: string): Promise<EcbExchangeRatesEntity> {
    try {
      const dataObject = JSON.parse(xml2json(data));
      const baseElements = dataObject.elements[0].elements[2].elements[0];
      return await this.saveRatesToDb(baseElements);
    } catch (error) {
      const errorMessage = 'Problem parsing xml data from ECB SOAP API!';

      //  log error to DB Table
      const errorLog = new LogEntity();
      errorLog.message = {
        class: 'EcbExchangeRatesSaveService',
        function: 'saveRates',
        input: { data: data },
        message: errorMessage,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
      this.logRepository.save(errorLog);

      this.customThrowErrorHttpException(
        errorMessage,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async getTodayRates(date: string): Promise<number> {
    try {
      return await this.ecbExchangeRatesEntityRepository.count({
        where: {
          created: Equal(new Date(date).toISOString()),
        },
      });
    } catch (error) {
      const errorMessage = 'Can not retrieve today rates data from db!';

      //  log error to DB Table
      const errorLog = new LogEntity();
      errorLog.message = {
        class: 'EcbExchangeRatesSaveService',
        function: 'getTodayRates',
        input: { date: date },
        message: errorMessage,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
      this.logRepository.save(errorLog);

      this.customThrowErrorHttpException(
        errorMessage,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async saveRateToDb(
    manager: EntityManager,
    created: string,
    currency: string,
    spot: number,
  ): Promise<EcbExchangeRatesEntity> {
    try {
      const ecbExchangeRatesEntity = new EcbExchangeRatesEntity();
      ecbExchangeRatesEntity.created = new Date(created).toISOString();
      ecbExchangeRatesEntity.currency = currency;
      ecbExchangeRatesEntity.currency_alias = EcbCurrency[currency];
      ecbExchangeRatesEntity.spot = spot;
      await manager.save(ecbExchangeRatesEntity);
      return ecbExchangeRatesEntity;
    } catch (error) {
      const errorMessage = 'Can not create record rate data to the db!';

      //  log error to DB Table
      const errorLog = new LogEntity();
      errorLog.message = {
        class: 'EcbExchangeRatesSaveService',
        function: 'saveRateToDb',
        input: { created: created, currency: currency, spot: spot },
        message: errorMessage,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
      this.logRepository.save(errorLog);

      this.customThrowErrorHttpException(
        errorMessage,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async saveRatesToDb(data: any): Promise<EcbExchangeRatesEntity> {
    const responseData: EcbExchangeRatesEntity[] = [];
    if ((await this.getTodayRates(data.attributes.time)) === 0) {
      await this.dataSource
        .transaction(async (manager) => {
          for (const key in data) {
            if (key === 'elements') {
              for (const kv in data[key]) {
                const ecbExchangeRatesEntity = this.saveRateToDb(
                  manager,
                  data['attributes']['time'],
                  data[key][kv].attributes['currency'],
                  data[key][kv].attributes['rate'],
                );
                responseData.push(await ecbExchangeRatesEntity);
              }
            }
          }
        })
        .catch((error) => {
          const errorMessage =
            'Check input data if they are successufully parsed, impossible save to DB!';

          //  log error to DB Table
          const errorLog = new LogEntity();
          errorLog.message = {
            class: 'EcbExchangeRatesSaveService',
            function: 'saveRatesToDb',
            input: { data: data },
            message: errorMessage,
            status: HttpStatus.INTERNAL_SERVER_ERROR,
          };
          this.logRepository.save(errorLog);

          this.customThrowErrorHttpException(
            errorMessage,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        });
    }

    return responseData.length > 0
      ? responseData
      : this.errorTodayRatesStoredInDb(data);
  }

  private errorTodayRatesStoredInDb(data: any) {
    const errorMessage = 'Today rates are already stored in db!';

    //  log error to DB Table
    const errorLog = new LogEntity();
    errorLog.message = {
      class: 'EcbExchangeRatesSaveService',
      function: 'saveRatesToDb => errorTodayRatesStoredInDb',
      input: { data: data },
      message: errorMessage,
      status: HttpStatus.CONFLICT,
    };
    this.logRepository.save(errorLog);

    return this.customThrowErrorHttpException(
      errorMessage,
      HttpStatus.CONFLICT,
    );
  }

  private customThrowErrorHttpException(
    errorMessage: string,
    statusCode: number,
  ): any {
    return throwError(() => new HttpException(errorMessage, statusCode));
  }
}
