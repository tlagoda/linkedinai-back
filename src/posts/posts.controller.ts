import { SharePostDto } from './dto/posts-share.dto';
import { PostsService } from './posts.service';
import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  @Get('generate')
  async generate() {
    return await this.postsService.generate();
  }

  @Post('share')
  async share(@Body() content: SharePostDto) {
    const response = await this.postsService.shareOnLinkedIn(content);
    return response;
  }
}
