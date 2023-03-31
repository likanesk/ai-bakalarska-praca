import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Equal, Repository } from 'typeorm';
import { UserActivityEntity } from './entity/user-activity.entity';
import { UserEntity } from './entity/user.entity';

@Injectable()
export class UserActivityService {
  constructor(
    @InjectRepository(UserActivityEntity)
    private userActivityRepository: Repository<UserActivityEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findAll(userId: any): Promise<UserActivityEntity[]> {
    return await this.userActivityRepository.find({
      where: [{ user_record_id: userId }],
      order: { created: 'DESC' },
    });
  }

  async createUserActivity(
    userUUID: any,
    route: string,
  ): Promise<UserActivityEntity> {
    const userActivityEntity = new UserActivityEntity();
    userActivityEntity.user_record_id = userUUID;
    userActivityEntity.route = route;
    return await this.userActivityRepository.save(userActivityEntity);
  }

  async findActivitiesInActualMonth(userUUID: any): Promise<boolean> {
    const date = new Date(),
      y = date.getFullYear(),
      m = date.getMonth();

    const activities = await this.userActivityRepository.count({
      where: {
        user_record_id: Equal(userUUID),
        created: Between(
          new Date(y, m, 1, 0, 0, 0),
          new Date(y, m + 1, 0, 23, 59, 59),
        ),
      },
    });

    const user = await this.userRepository.findOne({
      where: {
        record_id: Equal(userUUID),
      },
    });

    if (activities < user.requests) {
      return true;
    } else {
      return false;
    }
  }
}
