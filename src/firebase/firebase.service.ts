import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Logger } from '@nestjs/common';

@Injectable()
export class FirebaseService {
  private db: FirebaseFirestore.Firestore;
  private readonly logger = new Logger(FirebaseService.name);

  constructor(private configService: ConfigService) {
    const firebaseConfigBase64 = this.configService.get<string>(
      'FIREBASE_CONFIG_ENCODED',
    );
    const firebaseConfigJson = Buffer.from(
      firebaseConfigBase64,
      'base64',
    ).toString('utf-8');
    const serviceAccount = JSON.parse(firebaseConfigJson);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });

    this.logger.log('Firebase app has been initialized...');

    this.db = admin.firestore();
  }

  getFirestore(): FirebaseFirestore.Firestore {
    return this.db;
  }
}
