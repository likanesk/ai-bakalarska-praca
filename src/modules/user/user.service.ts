import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Not, Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { UserEntity } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async find(userId: string): Promise<UserEntity[]> {
    return await this.userRepository.find({
      select: {
        record_id: true,
        user_name: true,
        user_pass: false,
        is_admin: true,
      },
      where: [{ record_id: Not(Equal(userId)) }],
    });
  }

  async findOne(userName: string): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: [{ user_name: userName }],
    });
  }

  async createUser(userDto: UserDto): Promise<UserEntity> {
    if (
      (await this.userRepository.count({
        where: {
          user_name: Equal(userDto.username),
        },
      })) === 0
    ) {
      const user = new UserEntity();
      user.user_name = userDto.username;
      user.user_pass = userDto.password;
      return await this.userRepository.save(user);
    } else {
      const errorMessage = `The user with same username: ${userDto.username} already exists in db!`;
      console.error(errorMessage);
      throw new HttpException(errorMessage, HttpStatus.CONFLICT);
    }
  }
}
