import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { LogEntity } from 'src/modules/system/entity/log.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(LogEntity)
    private logRepository: Repository<LogEntity>,
  ) {
    super();
  }

  async validate(userName: string, userPass: string): Promise<any> {
    const user = await this.authService.validateUser(userName, userPass);
    if (!user) {
      //  log error to DB Table
      const errorLog = new LogEntity();
      errorLog.message = {
        class: 'LocalStrategy',
        function: 'validate',
        input: { userName: userName, userPass: '?????????' },
        message: 'Unauthorized',
        status: HttpStatus.UNAUTHORIZED,
      };
      this.logRepository.save(errorLog);

      throw new UnauthorizedException();
    }
    return user;
  }
}
