import { AuthGuard } from './../guards/auth.guard';
import { SharePostDto } from './dto/posts-share.dto';
import { PostsService } from './posts.service';
import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('generate')
  @UseGuards(AuthGuard)
  async generate(@Query('prompt') prompt: string) {
    return { message: 'Coming soon!' };
    // return await this.postsService.generate(prompt);
  }

  @Post('share')
  @UseGuards(AuthGuard)
  async share(@Body() postContent: SharePostDto) {
    try {
      const response = await this.postsService.shareOnLinkedIn(postContent);
      return response;
    } catch (error) {
      console.error('Error while sharing on LinkedIn:', error);
      throw new InternalServerErrorException('Failed to share on LinkedIn');
    }
  }
}
