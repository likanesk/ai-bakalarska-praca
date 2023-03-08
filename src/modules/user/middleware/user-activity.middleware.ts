import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { UserActivityService } from '../user-activity.service';

@Injectable()
export class UserActivityMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userActivityService: UserActivityService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    if (req.headers.authorization) {
      const decodedJwtAccessToken: any = this.jwtService.decode(
        req.headers.authorization.split(' ')[1],
      );

      this.userActivityService.createUserActivity(
        decodedJwtAccessToken.sub,
        req.baseUrl,
      );
    }
    next();
  }
}
