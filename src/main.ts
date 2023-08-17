import { HttpsRedirectMiddleware } from './middleware/https-redirect.middleware';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(new HttpsRedirectMiddleware().use);

  app.enableCors({
    origin: [
      'http://tldl.fr',
      'https://tldl.fr',
      'http://localhost:3000',
      'http://www.tldl.fr',
    ],
    allowedHeaders: 'Content-Type,Authorization',
    methods: 'GET,POST,PUT',
  });

  await app.listen(process.env.PORT || 8888);
}
bootstrap();
