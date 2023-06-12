import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { globalVariable } from 'src/global/global';

@Injectable()
export class AuthService {
  constructor(private configService: ConfigService) {}

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
          redirect_uri: 'http://localhost:5000/auth/linkedin/callback',
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
}
