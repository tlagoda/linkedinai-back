import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Logger } from '@nestjs/common';

@Injectable()
export class FirebaseService {
  private db: FirebaseFirestore.Firestore;
  private auth: admin.auth.Auth;
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
    this.auth = admin.auth();
  }

  getFirestore(): FirebaseFirestore.Firestore {
    return this.db;
  }

  getAuth(): admin.auth.Auth {
    return this.auth;
  }

  async updateDocInCollection(
    collection: string,
    uid: string,
    data: Record<string, any>,
  ): Promise<void> {
    try {
      const docRef = this.getFirestore().collection(collection).doc(uid);
      await docRef.set(data, { merge: true });
    } catch (error) {
      console.error(`Error while updating collection ${collection}:`, error);
      throw error;
    }
  }
}
