import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://tldl.fr', 'https://tldl.fr', 'http://localhost:3000'],
    allowedHeaders: 'Content-Type,Authorization',
    methods: 'GET,POST',
  });

  await app.listen(process.env.PORT || 8888);
}
bootstrap();
