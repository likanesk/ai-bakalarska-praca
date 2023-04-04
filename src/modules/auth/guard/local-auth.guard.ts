import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * LocalAuthGuard restricts user's access to individual functionalities
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
