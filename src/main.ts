import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use((err, req, res, next) => {
    const logger = new Logger('App');

    if (err) {
      logger.error('CORS error:', err.message);
    }

    next(err);
  });

  app.enableCors({
    origin: ['http://tldl.fr', 'https://tldl.fr', 'http://localhost:3000'],
    allowedHeaders: 'Content-Type,Authorization',
    methods: 'GET,POST',
  });

  await app.listen(process.env.PORT || 8888);
}
bootstrap();
