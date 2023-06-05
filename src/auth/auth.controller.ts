import { AuthService } from './auth.service';
import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { globalVariable } from '../global/global';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('linkedin/callback')
  async linkedinRedirect(@Req() req: Request, @Res() res: Response) {
    try {
      const { code, state } = req.query;

      // Swap code for access token
      const tokenResponse = await this.authService.getLinkedInToken(
        code.toString(),
      );

      const { access_token: accessToken, expires_in: expiresIn } =
        tokenResponse.data;
      globalVariable.accessToken = accessToken;
      globalVariable.expiresIn = expiresIn;

      const userInformations =
        await this.authService.getLinkedInUserInformations();

      globalVariable.userId = userInformations.data.id;

      res.status(200).json({
        message: 'LinkedIn callback successful!',
        user: userInformations,
      });
    } catch (error) {
      console.error('Error during LinkedIn callback:', error);
      res.status(500).json({
        message: 'An error occurred during LinkedIn callback',
      });
    }
  }
}
