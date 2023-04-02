import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  ParseUUIDPipe,
  Post,
  Query,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UserDto } from './dto/user.dto';
import { UserEntity } from './entity/user.entity';
import { UserPackage } from './type/enum/package.enum';
import { UserService } from './user.service';
import { LogEntity } from '../system/entity/log.entity';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({
    summary: 'Create new user account with defying username + password',
  })
  @ApiQuery({
    name: 'username',
    type: 'string',
    required: true,
  })
  @ApiQuery({
    name: 'password',
    type: 'string',
    required: true,
  })
  @ApiQuery({ name: 'packageAlias', required: true, enum: UserPackage })
  @Post('create')
  async createUser(
    @Query() userDto: UserDto,
    @Query('packageAlias') packageAlias: UserPackage,
  ): Promise<UserEntity> {
    return await this.userService.createUser(userDto, packageAlias);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Get from JWT data for logged user from request',
  })
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Return all users in system, except the logged one',
  })
  @Get('list')
  async getUsers(@Request() req): Promise<UserEntity[]> {
    const user = await this.userService.findOne(req.user.username);
    if (user.is_admin === true) {
      return await this.userService.find(req.user.userId);
    } else {
      const errorMessage = `As you are not ADMIN, you can't display system users!`;

      //  log error to DB Table
      const errorLog = new LogEntity();
      errorLog.message = {
        class: 'UserController',
        function: 'getUsers',
        input: {
          userId: req.user.userId,
        },
        message: errorMessage,
        status: HttpStatus.CONFLICT,
      };
      this.userService.logRepository.save(errorLog);

      throw new HttpException(errorMessage, HttpStatus.CONFLICT);
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary:
      "ADMIN user can delete user from the system. He can't delete itself!",
  })
  @ApiQuery({
    name: 'recordId',
    type: 'string',
    required: true,
  })
  @Delete('delete')
  async deleteUser(
    @Query('recordId', new ParseUUIDPipe()) recordId: string,
    @Request() req,
  ): Promise<any> {
    const user = await this.userService.findOne(req.user.username);
    if (user.is_admin === true) {
      if (recordId !== req.user.userId) {
        return await this.userService.deleteUser(recordId);
      } else {
        const errorMessage = `Even you are ADMIN, you can't remove yourself from the system! Only other users!`;

        //  log error to DB Table
        const errorLog = new LogEntity();
        errorLog.message = {
          class: 'UserController',
          function: 'deleteUser',
          input: {
            recordId: recordId,
          },
          message: errorMessage,
          status: HttpStatus.CONFLICT,
        };
        this.userService.logRepository.save(errorLog);

        throw new HttpException(errorMessage, HttpStatus.CONFLICT);
      }
    } else {
      const errorMessage = `As you are not ADMIN, you can't remove user or yourself from the system!`;

      //  log error to DB Table
      const errorLog = new LogEntity();
      errorLog.message = {
        class: 'UserController',
        function: 'deleteUser',
        input: {
          recordId: recordId,
        },
        message: errorMessage,
        status: HttpStatus.CONFLICT,
      };
      this.userService.logRepository.save(errorLog);

      throw new HttpException(errorMessage, HttpStatus.CONFLICT);
    }
  }
}
