import { GeneratePostDto } from './dto/generate-post.dto';
import { AuthGuard } from './../guards/auth.guard';
import { PostsService } from './posts.service';
import {
  Headers,
  InternalServerErrorException,
  Logger,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
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
  async generate(
    @Body() promptOptions: GeneratePostDto,
    @Headers('authorization') authorization: string,
  ) {
    this.logger.log('Post generation requested...');
    try {
      const token = authorization.split(' ')[1];
      const canGenerate = await this.postsService.canGenerate(token);

      if (!canGenerate) {
        throw new UnauthorizedException('User is not allowed to generate');
      }
      let apiKey = null;

      if (promptOptions.free) {
        apiKey = await this.postsService.getUserApiKey(token);
      }

      const prompt = this.postsService.buildPrompt(promptOptions);
      return await this.postsService.generate(prompt, apiKey);
    } catch (error) {
      this.logger.error(`Error while generating post: ${error.message}`);
    }
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
