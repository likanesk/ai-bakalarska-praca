import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserActivityEntity } from './entity/user-activity.entity';

@Injectable()
export class UserActivityService {
  constructor(
    @InjectRepository(UserActivityEntity)
    private userActivityRepository: Repository<UserActivityEntity>,
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
}
