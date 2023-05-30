import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsController } from './posts/posts.controller';
import { PostsService } from './posts/posts.service';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, PostsController],
  providers: [AppService, PostsService],
})
export class AppModule {}
