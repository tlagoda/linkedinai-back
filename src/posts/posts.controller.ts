import { SharePostDto } from './dto/posts-share.dto';
import { PostsService } from './posts.service';
import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Query,
} from '@nestjs/common';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  @Get('generate')
  async generate(@Query('prompt') prompt: string) {
    return 'blocked';
    return await this.postsService.generate(prompt);
  }

  @Post('share')
  async share(@Body() postContent: SharePostDto) {
    console.log('share');
    try {
      const response = await this.postsService.shareOnLinkedIn(postContent);
      return response;
    } catch (error) {
      console.error('Error while sharing on LinkedIn:', error);
      throw new InternalServerErrorException('Failed to share on LinkedIn');
    }
  }
}
