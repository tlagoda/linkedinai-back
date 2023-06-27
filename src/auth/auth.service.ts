import { FirebaseService } from './../firebase/firebase.service';
import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
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

  async verifyLinkedInToken(uid: string): Promise<boolean> {
    try {
      const userRef = this.firebaseService
        .getFirestore()
        .collection('linkedin')
        .doc(uid);
      const snapshot = await userRef.get();
      const userData = snapshot.data();

      if (
        !userData ||
        !userData.linkedInToken ||
        !userData.linkedInTokenExpiresAt
      ) {
        return false; // Token or expiration date is missing
      }

      const linkedInTokenExpiresAt = userData.linkedInTokenExpiresAt;
      const now = new Date().getTime();

      if (now >= linkedInTokenExpiresAt) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error verifying LinkedIn token:', error);
      throw error;
    }
  }

  async refreshLinkedInToken(uid: string): Promise<string> {
    try {
      const userRef = this.firebaseService
        .getFirestore()
        .collection('users')
        .doc(uid);

      // TODO: refrash linkedin token
      return;
      const refreshedToken = 'NEW_LINKEDIN_TOKEN';
      await userRef.update({
        linkedInToken: refreshedToken,
      });

      return refreshedToken;
    } catch (error) {
      console.error('Error refreshing LinkedIn token:', error);
      throw error;
    }
  }

  async getLinkedInTokenFromFirebaseToken(
    firebaseToken: string,
  ): Promise<string> {
    try {
      const { uid } = await this.firebaseService
        .getAuth()
        .verifyIdToken(firebaseToken);

      const linkedinRef = this.firebaseService
        .getFirestore()
        .collection('linkedin')
        .doc(uid);

      const snapshot = await linkedinRef.get();
      const linkedinData = snapshot.data();

      if (!linkedinData || !linkedinData.linkedInToken) {
        throw new Error('No such user found, or no suck linkedin token found.');
      }

      return linkedinData.linkedInToken;
    } catch (error) {
      this.logger.error(error);
    }
  }

  async;
}
