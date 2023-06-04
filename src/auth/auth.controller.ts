import { AuthService } from './auth.service';
import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

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

    const { access_token, expires_in } = tokenResponse.data;

    res.send('LinkedIn callback successful!');
  }
}
