import { Module } from '@nestjs/common';
import { LogService } from './log.service';
import { LogEntity } from './entity/log.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([LogEntity])],
  providers: [LogService],
  exports: [LogService],
})
export class SystemModule {}
