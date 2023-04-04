import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants';

/**
 * JwtStrategy uses PassportStrategy to verify the user's existence during JWT token authorization
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration:
        configService.get('nodeEnv') === 'development' ? true : false,
      secretOrKey: jwtConstants.secret,
    });
  }

  /**
   * Depending on the requirements, it evaluates whether the userId in the decoded JWT token
   * matches an entry in user db, or matches a list of revoked tokens
   * @param payload user data
   * @returns Promise<{ userId: any, username: any }>
   */
  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
