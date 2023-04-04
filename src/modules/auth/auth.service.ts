import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserActivityService } from '../user/user-activity.service';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userActivityService: UserActivityService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Validate user by username and password
   * @param userName username
   * @param userPass user password
   * @returns Promise<any>
   */
  async validateUser(userName: string, userPass: string): Promise<any> {
    const user = await this.userService.findOne(userName);
    if (user && user.user_pass === userPass) {
      const { user_pass, ...result } = user;
      return result;
    }
    return null;
  }

  /**
   * Log user into the system
   * @param user user
   * @returns Promise<{ access_token: string }>
   */
  async login(user: any) {
    const payload = { username: user.user_name, sub: user.record_id };

    this.userActivityService.createUserActivity(
      user.record_id,
      '/api/v1/ecb-exhange-rates/auth/login',
    );

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
