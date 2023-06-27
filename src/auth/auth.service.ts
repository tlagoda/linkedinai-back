import { FirebaseService } from './../firebase/firebase.service';
import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { globalVariable } from 'src/global/global';
import { Logger } from '@nestjs/common';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private configService: ConfigService,
    private firebaseService: FirebaseService,
  ) {}

  async getLinkedInToken(code: string) {
    const clientId = this.configService.get<string>('LINKEDIN_CLIENT_ID');
    const clientSecret = this.configService.get<string>(
      'LINKEDIN_CLIENT_SECRET',
    );

    this.logger.log('Retrieving access token from LinkedIn...');

    const tokenResponse = await axios.post(
      'https://www.linkedin.com/oauth/v2/accessToken',
      null,
      {
        params: {
          grant_type: 'authorization_code',
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: 'http://localhost:8888/auth/linkedin/callback',
          scope: 'r_liteprofile r_emailaddress',
        },
      },
    );
    //https://linkedinai-back-357fcb308ceb.herokuapp.com/auth/linkedin/callback'
    return tokenResponse;
  }

  async getLinkedInUserInformations(accessToken: string) {
    this.logger.log('Retrieving user informations from LinkedIn...');

    try {
      const response = await axios.get('https://api.linkedin.com/v2/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
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

      this.logger.log('LinkedIn Authorization correctly updated...');
    } catch (error) {
      console.error('Error updating user authorization:', error);
      throw error;
    }
  }
}
