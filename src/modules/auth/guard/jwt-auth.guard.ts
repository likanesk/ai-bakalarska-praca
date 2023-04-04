import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JwtAuthGuard restricts user's access to individual functionalities
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
