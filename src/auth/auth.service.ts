import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(private configService: ConfigService) {}

  async getLinkedInToken(code: string) {
    const tokenResponse = await axios.post(
      'https://www.linkedin.com/oauth/v2/accessToken',
      null,
      {
        params: {
          grant_type: 'authorization_code',
          code,
          client_id: 'LINKEDIN_CLIENT_ID',
          client_secret: 'LINKEDIN_CLIENT_SECRET',
          redirect_uri: 'http://localhost:3000/auth/linkedin/callback',
        },
      },
    );

    return tokenResponse;
  }
}
