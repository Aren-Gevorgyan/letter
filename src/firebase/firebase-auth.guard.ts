import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { SetMetadata } from '@nestjs/common';

const PassportAuthGuard = AuthGuard('firebase-auth');
const ALLOW_ANY = 'allow-any';

@Injectable()
export class FirebaseAuthGuard extends PassportAuthGuard {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context) {
    const allowAny = this.reflector.getAllAndOverride<boolean>(ALLOW_ANY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (user) return user;
    if (allowAny) return null;
    throw new UnauthorizedException();
  }
}

export const AllowAny = () => SetMetadata(ALLOW_ANY, true);
