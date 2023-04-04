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

  /**
   * Find all actual user activities from db
   * @param userId user UUID
   * @returns Promise<UserActivityEntity[]>
   */
  async findAll(userId: any): Promise<UserActivityEntity[]> {
    return await this.userActivityRepository.find({
      where: [{ user_record_id: userId }],
      order: { created: 'DESC' },
    });
  }

  /**
   * Create and save new user activity to db
   * @param userUUID user UUID
   * @param route endpoint route
   * @returns Promise<UserActivityEntity>
   */
  async createUserActivity(
    userUUID: any,
    route: string,
  ): Promise<UserActivityEntity> {
    const userActivityEntity = new UserActivityEntity();
    userActivityEntity.user_record_id = userUUID;
    userActivityEntity.route = route;
    return await this.userActivityRepository.save(userActivityEntity);
  }

  /**
   * Find all actual user activities in actual month from db
   * @param userUUID user UUID
   * @returns Promise<boolean>
   */
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

    if (user.requests === 0) {
      return true;
    } else {
      if (activities < user.requests) {
        return true;
      } else {
        return false;
      }
    }
  }
}
