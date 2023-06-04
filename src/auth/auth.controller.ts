import { AuthService } from './auth.service';
import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { globalVariable } from '../global/global';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('linkedin/callback')
  async linkedinRedirect(@Req() req: Request, @Res() res: Response) {
    console.log('LinkedIn redirection');
    const { code, state } = req.query;

    // Swap code for access token
    const tokenResponse = await this.authService.getLinkedInToken(
      code.toString(),
    );

    const { access_token: accessToken, expires_in: expiresIn } =
      tokenResponse.data;
    globalVariable.accessToken = accessToken;
    globalVariable.expiresIn = expiresIn;

    //TODO
    res.send('LinkedIn callback successful!');
  }
}
