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

  async findAll(created: string): Promise<any> {
    return this.logRepository.findBy({
      created: created
        ? MoreThanOrEqual(created)
        : Raw((created) => `${created} >= :date`, { date: '2023-02-01' }),
    });
  }

  async storeErrorLogToDb(data: any) {
    const errorLog = new LogEntity();
    errorLog.message = data;
    return await this.logRepository.save(errorLog);
  }
}
