import { Controller, Get } from '@nestjs/common';

@Controller('posts')
export class PostsController {
  @Get('generate')
  generate() {
    // La logique pour générer les posts va ici
  }
}
