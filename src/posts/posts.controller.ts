import { LinkedinService } from './../linkedin/linkedin.service';
import { AuthGuard } from './../guards/auth.guard';
import { SharePostDto } from './dto/posts-share.dto';
import { PostsService } from './posts.service';
import { Req } from '@nestjs/common';
import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly linkedinService: LinkedinService,
  ) {}

  @Get('generate')
  @UseGuards(AuthGuard)
  async generate(@Query('prompt') prompt: string) {
    return { message: 'Coming soon!' };
    // return await this.postsService.generate(prompt);
  }

  @Post('share')
  @UseGuards(AuthGuard)
  async share(@Req() req: Request, @Body() postContent: SharePostDto) {



    //   const token = req.headers.authorization?.split('Bearer ')[1];
    //   try {
    //     const response = await this.postsService.shareOnLinkedIn(
    //       postContent,
    //       token,
    //     );
    //     return response;
    //   } catch (error) {
    //     console.error('Error while sharing on LinkedIn:', error);
    //     throw new InternalServerErrorException('Failed to share on LinkedIn');
    //   }
  }
}
