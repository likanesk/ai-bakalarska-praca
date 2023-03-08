import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UserActivityEntity } from './entity/user-activity.entity';
import { UserActivityService } from './user-activity.service';

@ApiTags('User Activity')
@Controller('user-activity')
export class UserActivityController {
  constructor(private readonly userActivityService: UserActivityService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Get JWT user data from request',
  })
  @Get()
  async getProfile(@Request() req): Promise<UserActivityEntity[]> {
    return await this.userActivityService.findAll(req.user.userId);
  }
}
