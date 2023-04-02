import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { UserActivityService } from '../user-activity.service';
import { LogService } from 'src/modules/system/log.service';

@Injectable()
export class UserActivityMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userActivityService: UserActivityService,
    private readonly logService: LogService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (req.headers.authorization) {
      const decodedJwtAccessToken: any = this.jwtService.decode(
        req.headers.authorization.split(' ')[1],
      );

      const activities =
        await this.userActivityService.findActivitiesInActualMonth(
          decodedJwtAccessToken.sub,
        );

      if (activities) {
        await this.userActivityService.createUserActivity(
          decodedJwtAccessToken.sub,
          req.baseUrl,
        );
      } else {
        const errorMessage =
          'You reached your monthly requests limit for your package.';

        await this.logService.storeErrorLogToDb({
          class: 'UserActivityMiddleware',
          function: 'use',
          input: {
            userUUID: decodedJwtAccessToken.sub,
          },
          message: errorMessage,
          status: HttpStatus.FORBIDDEN,
        });

        throw new ForbiddenException(errorMessage);
      }
    }
    next();
  }
}
