import { AuthService } from './auth.service';
import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { globalVariable } from '../global/global';
import { FirebaseService } from 'src/firebase/firebase.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly firebaseService: FirebaseService,
  ) {}

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

      const userInformations =
        await this.authService.getLinkedInUserInformations();

      await this.authService.updateUserLinkedInAuthorization(
        state as string,
        true,
      );

      const db = this.firebaseService.getFirestore();
      const userId = userInformations.data.id;
      const userRef = db.collection('users').doc(userId);
      await userRef.set(
        {
          accessToken,
          expiresIn,
        },
        { merge: true },
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
