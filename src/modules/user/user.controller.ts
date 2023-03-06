import {
  Controller,
  Get,
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
import { UserService } from './user.service';

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
  @Post('create')
  async createUser(@Query() userDto: UserDto): Promise<UserEntity> {
    return await this.userService.createUser(userDto);
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
    return await this.userService.find(req.user.userId);
  }
}
