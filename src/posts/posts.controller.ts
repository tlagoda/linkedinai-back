import { PostsService } from './posts.service';
import { Controller, Get } from '@nestjs/common';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  @Get('generate')
  async generate() {
    return await this.postsService.generate();
  }
}
