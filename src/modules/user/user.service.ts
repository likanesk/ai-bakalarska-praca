import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Not, Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { UserEntity } from './entity/user.entity';
import { UserPackage } from './type/enum/package.enum';
import { LogEntity } from '../system/entity/log.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(LogEntity)
    public logRepository: Repository<LogEntity>,
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

  async findOneById(recordId: string): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: {
        record_id: Equal(recordId),
      },
    });
  }

  async createUser(
    userDto: UserDto,
    packageAlias: UserPackage,
  ): Promise<UserEntity> {
    if (
      (await this.userRepository.count({
        where: {
          user_name: Equal(userDto.username),
        },
      })) === 0
    ) {
      const UserPackageKey =
        Object.keys(UserPackage)[
          Object.values(UserPackage).indexOf(packageAlias)
        ];

      const user = new UserEntity();
      user.user_name = userDto.username;
      user.user_pass = userDto.password;
      user.requests = +UserPackageKey.replace('requests', '');
      return await this.userRepository.save(user);
    } else {
      const errorMessage = `The user with same username: ${userDto.username} already exists in db!`;

      //  log error to DB Table
      userDto.password = '?????????';
      const errorLog = new LogEntity();
      errorLog.message = {
        class: 'UserService',
        function: 'createUser',
        input: {
          userDto: JSON.stringify(userDto),
        },
        message: errorMessage,
        status: HttpStatus.CONFLICT,
      };
      this.logRepository.save(errorLog);

      throw new HttpException(errorMessage, HttpStatus.CONFLICT);
    }
  }

  async deleteUser(recordId: string): Promise<any> {
    const user = await this.findOneById(recordId);
    if (user) {
      try {
        await this.userRepository.remove(user);
        return {
          message: `The user with UUID: ${recordId} was removed from db!`,
        };
      } catch (error) {
        //  log error to DB Table
        const errorLog = new LogEntity();
        errorLog.message = {
          class: 'UserService',
          function: 'deleteUser',
          input: {
            recordId: recordId,
          },
          message: JSON.stringify(error),
          status: HttpStatus.INTERNAL_SERVER_ERROR,
        };
        this.logRepository.save(errorLog);

        throw new HttpException(
          'Can not remove record from db!',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } else {
      const errorMessage = `The user with UUID: ${recordId} doesn't exists in db!`;

      //  log error to DB Table
      const errorLog = new LogEntity();
      errorLog.message = {
        class: 'UserService',
        function: 'deleteUser',
        input: {
          recordId: recordId,
        },
        message: errorMessage,
        status: HttpStatus.NOT_FOUND,
      };
      this.logRepository.save(errorLog);

      throw new HttpException(errorMessage, HttpStatus.NOT_FOUND);
    }
  }
}
