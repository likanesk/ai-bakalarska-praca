import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Raw, Repository } from 'typeorm';
import { LogEntity } from './entity/log.entity';

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(LogEntity)
    private logRepository: Repository<LogEntity>,
  ) {}

  /**
   * Find all logs from db filtered by creation date
   * @param created the date when records were created
   * @returns Promise<any>
   */
  async findAll(created: string): Promise<any> {
    return this.logRepository.findBy({
      created: created
        ? MoreThanOrEqual(created)
        : Raw((created) => `${created} >= :date`, { date: '2023-02-01' }),
    });
  }

  /**
   * Store error log to db by data
   * @param data data
   * @returns Promise<LogEntity>
   */
  async storeErrorLogToDb(data: any) {
    const errorLog = new LogEntity();
    errorLog.message = data;
    return await this.logRepository.save(errorLog);
  }
}
