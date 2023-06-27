import { AuthService } from './auth.service';
import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { FirebaseService } from 'src/firebase/firebase.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly firebaseService: FirebaseService,
  ) {}

  @Get('linkedin/callback')
  async linkedinRedirect(@Req() req: Request, @Res() res: Response) {
    try {
      const { code, state: uid } = req.query;

      // Swap code for access token
      const tokenResponse = await this.authService.getLinkedInToken(
        code.toString(),
      );

      const { access_token: accessToken, expires_in: expiresIn } =
        tokenResponse.data;

      const now = new Date();
      const expirationDate = new Date(now.getTime() + expiresIn * 1000);

      const userInformations =
        await this.authService.getLinkedInUserInformations(accessToken);

      await this.usersService.updateUser(uid as string, {
        linkedInId: userInformations.data.id,
        hasAuthorizedLinkedIn: true,
        linkedInToken: accessToken,
        linkedInTokenExpiresAt: expirationDate,
      });

      await this.firebaseService.updateDocInCollection(
        'linkedin',
        uid as string,
        {
          linkedInId: userInformations.data.id,
          hasAuthorizedLinkedIn: true,
          linkedInToken: accessToken,
          linkedInTokenExpiresAt: expirationDate,
        },
      );

      res.status(200).redirect('http://tldl.fr/generate');
    } catch (error) {
      console.error('Error during LinkedIn callback:', error);
      res.status(500).json({
        message: 'An error occurred during LinkedIn authorization',
      });
    }
  }
}
