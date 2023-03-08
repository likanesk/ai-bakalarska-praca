import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserActivityEntity } from './entity/user-activity.entity';
import { UserEntity } from './entity/user.entity';
import { UserActivityController } from './user-activity.controller';
import { UserActivityService } from './user-activity.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserActivityEntity])],
  providers: [UserService, UserActivityService],
  controllers: [UserController, UserActivityController],
  exports: [UserService, UserActivityService],
})
export class UserModule {}
