import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsController } from './posts/posts.controller';
import { UsersController } from './users/users.controller'
import { PostsService } from './posts/posts.service';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { FirebaseController } from './firebase/firebase.controller';
import { FirebaseService } from './firebase/firebase.service';
import { UsersService } from './users/users.service';
import { LinkedinService } from './linkedin/linkedin.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [
    AppController,
    PostsController,
    AuthController,
    FirebaseController,
    UsersController
  ],
  providers: [
    AppService,
    PostsService,
    AuthService,
    FirebaseService,
    UsersService,
    LinkedinService,
  ],
})
export class AppModule {}
