import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsController } from './posts/posts.controller';
import { PostsService } from './posts/posts.service';
import { ConfigModule } from '@nestjs/config';
import { LinkedinController } from './linkedin/linkedin.controller';
import { LinkedinService } from './linkedin/linkedin.service';
import { AuthController } from './auth/auth.controller';


@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, PostsController, LinkedinController, AuthController],
  providers: [AppService, PostsService, LinkedinService],
})
export class AppModule {}
