import { LinkedinService } from './../linkedin/linkedin.service';
import { AuthGuard } from './../guards/auth.guard';
import { PostsService } from './posts.service';
import { Headers, InternalServerErrorException } from '@nestjs/common';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

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
  @UseInterceptors(FilesInterceptor('files'))
  async share(
    @Headers('authorization') authHeader: string,
    @Body('content') content: string,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    const token = authHeader?.split('Bearer ')[1];

    try {
      const response = await this.postsService.shareOnLinkedIn(
        'th',
        token,
        files,
      );
      console.log('files', files)
      console.log(token)
      console.log(response);
      return response;
    } catch (error) {
      console.error('Error while sharing on LinkedIn:', error);
      throw new InternalServerErrorException('Failed to share on LinkedIn');
    }
  }
}
