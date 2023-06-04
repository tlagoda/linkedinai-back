import { SharePostDto } from './dto/posts-share.dto';
import { PostsService } from './posts.service';
import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  @Get('generate')
  async generate() {
    return await this.postsService.generate();
  }

  @Post('share')
  async share(@Body() content: SharePostDto) {
    try {
      const response = await this.postsService.shareOnLinkedIn(content);
      return response;
    } catch (error) {
      console.error('Error while sharing on LinkedIn:', error);
      throw new InternalServerErrorException('Failed to share on LinkedIn');
    }
  }
}
