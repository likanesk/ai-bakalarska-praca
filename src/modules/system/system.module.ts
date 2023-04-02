import { Module } from '@nestjs/common';
import { LogService } from './log.service';
import { LogEntity } from './entity/log.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogController } from './log.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([LogEntity]), UserModule],
  providers: [LogService],
  controllers: [LogController],
  exports: [LogService],
})
export class SystemModule {}
