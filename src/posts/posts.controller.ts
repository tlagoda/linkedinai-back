import { PromptOptionsDto } from './dto/posts-prompt-options.dto';
import { AuthGuard } from './../guards/auth.guard';
import { PostsService } from './posts.service';
import { Headers, InternalServerErrorException, Logger } from '@nestjs/common';
import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('posts')
export class PostsController {
  private readonly logger = new Logger(PostsController.name);

  constructor(private readonly postsService: PostsService) {}

  @Post('generate')
  @UseGuards(AuthGuard)
  async generate(@Body('options') promptOptions: PromptOptionsDto) {
    const prompt = this.postsService.buildPrompt(promptOptions);
    console.log(promptOptions);
    console.log(prompt);
    const aa =  await this.postsService.generate(prompt);
    console.log(aa)
    return aa
  }

  @Post('share')
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('files'))
  async share(
    @Headers('authorization') authHeader: string,
    @Body('content') content: string,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    this.logger.log('New share request...');
    const token = authHeader?.split('Bearer ')[1];

    try {
      const response = await this.postsService.shareOnLinkedIn(
        content ? content : 'th',
        token,
        files,
      );

      return response;
    } catch (error) {
      console.error('Error while sharing on LinkedIn:', error);
      throw new InternalServerErrorException('Failed to share on LinkedIn');
    }
  }
}
