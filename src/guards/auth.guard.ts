import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(private readonly firebaseService: FirebaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader) {
      this.logger.warn('Authorization header not found');
      throw new UnauthorizedException('Authorization header not found');
    }

    const [bearer, token] = authorizationHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      this.logger.warn('Invalid authorization header');
      throw new UnauthorizedException('Invalid authorization header');
    }

    try {
      const firebaseUser = await this.firebaseService
        .getAuth()
        .verifyIdToken(token);
      request.user = firebaseUser;
      this.logger.log('User is authorized');
      return true;
    } catch (error) {
      this.logger.warn('Invalid token');
      throw new UnauthorizedException('Invalid token');
    }
  }
}
