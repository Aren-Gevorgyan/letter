import { Injectable, NestMiddleware, SetMetadata } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import { Request, Response } from 'express';
import { FirebaseService } from './firebase-auth';

const ALLOW_ANY = 'ALLOW_ANY';

@Injectable()
export class FirebaseAuthMiddleware implements NestMiddleware {
  private auth: firebase.auth.Auth;

  constructor(private firebaseService: FirebaseService) {
    this.auth = firebaseService.getAuth();
  }

  async use(req: Request, res: Response, next: () => void) {
    const token = req.headers.authorization;
    if (token != null && token != '') {
      try {
        const getToken = token.replace('Bearer ', '');
        const user = await this.auth.verifyIdToken(getToken);
        req['user'] = {
          email: user.email,
          roles: user.roles || [],
          type: user.type,
        };
        next();
      } catch (error) {
        FirebaseAuthMiddleware.accessDenied(req.url, res);
      }
    } else {
      FirebaseAuthMiddleware.accessDenied(req.url, res);
    }
  }

  private static accessDenied(url: string, res: Response) {
    res.status(403).json({
      statusCode: 403,
      timestamp: new Date().toISOString(),
      path: url,
      message: 'access denied',
    });
  }
}

export const AllowAny = () => SetMetadata(ALLOW_ANY, true);
