import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import axios from 'axios';

@Controller('auth')
export class AuthController {
  @Get('linkedin/callback')
  async linkedinRedirect(@Req() req: Request, @Res() res: Response) {
    console.log('LinkedIn redirection');
    const { code, state } = req.query;

    // Swap code for access token
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

    const { access_token, expires_in } = tokenResponse.data;

    res.send('LinkedIn callback successful!');
  }
}
