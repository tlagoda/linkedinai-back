import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  @Get('linkedin/callback')
  linkedinRedirect(@Req() req: Request, @Res() res: Response) {
    // TODO
  }
}
