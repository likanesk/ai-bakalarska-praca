import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { LogService } from './log.service';
import { LogEntity } from './entity/log.entity';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UserService } from '../user/user.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
@ApiTags('Log')
@Controller('log')
export class LogController {
  constructor(
    private readonly logService: LogService,
    private readonly userService: UserService,
  ) {}

  @ApiOperation({
    summary: 'Return error logs with filter created',
  })
  @ApiQuery({
    name: 'created',
    type: 'string',
    required: false,
    example: new Date().toJSON().slice(0, 10),
  })
  @Get()
  async getRecords(
    @Query('created') created: string,
    @Request() req,
  ): Promise<LogEntity[]> {
    const user = await this.userService.findOne(req.user.username);
    if (user.is_admin === true) {
      return this.logService.findAll(created);
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
}
