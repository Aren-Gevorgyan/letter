import { Injectable } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FirebaseService {
  private firebaseApp: firebase.app.App;
  private firebaseConfig = {
    projectId: this.configService.get<string>('PROJECT_ID'),
    privateKey: this.configService.get<string>('PRIVATE_KEY'),
    clientEmail: this.configService.get<string>('CLIENT_EMAIL'),
  };
  constructor(private configService: ConfigService) {
    if (!firebase.apps.length) {
      // Initialize Firebase app only if it hasn't been initialized before
      this.firebaseApp = firebase.initializeApp({
        credential: firebase.credential.cert(this.firebaseConfig),
      });
    } else {
      // If app is already initialized, use the existing app instance
      this.firebaseApp = firebase.apps[0];
    }
  }

  getAuth = (): firebase.auth.Auth => {
    return this.firebaseApp.auth();
  };
}
