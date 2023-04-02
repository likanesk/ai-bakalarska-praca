import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogEntity } from './entity/log.entity';

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(LogEntity)
    private logRepository: Repository<LogEntity>,
  ) {}

  async storeErrorLogToDb(data: any) {
    const errorLog = new LogEntity();
    errorLog.message = data;
    return await this.logRepository.save(errorLog);
  }
}
