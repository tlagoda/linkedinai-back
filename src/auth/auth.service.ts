import { FirebaseService } from './../firebase/firebase.service';
import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { globalVariable } from 'src/global/global';
import * as admin from 'firebase-admin';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private firebaseService: FirebaseService,
  ) {}

  async getLinkedInToken(code: string) {
    const clientId = this.configService.get<string>('LINKEDIN_CLIENT_ID');
    const clientSecret = this.configService.get<string>(
      'LINKEDIN_CLIENT_SECRET',
    );

    const tokenResponse = await axios.post(
      'https://www.linkedin.com/oauth/v2/accessToken',
      null,
      {
        params: {
          grant_type: 'authorization_code',
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri:
            'https://linkedinai-back-357fcb308ceb.herokuapp.com/auth/linkedin/callback',
          scope: 'r_liteprofile r_emailaddress',
        },
      },
    );

    return tokenResponse;
  }

  async getLinkedInUserInformations() {
    try {
      const response = await axios.get('https://api.linkedin.com/v2/me', {
        headers: {
          Authorization: `Bearer ${globalVariable.accessToken}`,
        },
      });

      return response;
    } catch (error) {
      console.error(
        "Erreur lors de l'obtention des informations de l'utilisateur LinkedIn:",
        error,
      );
      throw error;
    }
  }

  async updateUserLinkedInAuthorization(uid: string, authorized: boolean) {
    try {
      const db = this.firebaseService.getFirestore();
      const userRef = db.collection('users').doc(uid);

      await userRef.set({ hasAuthorizedLinkedIn: authorized }, { merge: true });
    } catch (error) {
      console.error('Error updating user authorization:', error);
      throw error;
    }
  }
}
