import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './modules/auth/auth.service';
import { LocalAuthGuard } from './modules/auth/guard/local-auth.guard';
import { UserDto } from './modules/user/dto/user.dto';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @ApiBody({
    type: UserDto,
  })
  @ApiOperation({
    summary:
      'Log-in to the app with username:password to get JWT Access token to be used on private API endpoints',
  })
  @Post('auth/login')
  async login(@Request() req) {
    return await this.authService.login(req.user);
  }
}
