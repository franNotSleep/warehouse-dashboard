import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { getOrThrow } from './config/common.js';
import { initSuperAdmin } from './lib/auth.js';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
const port = process.env.PORT ?? 3030;

async function bootstrap() {
  const trustedOrigins = getOrThrow('TRUSTED_ORIGINS');

  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
    cors: {
      methods: ['POST', 'GET', 'PUT', 'PATCH'],
      origin: trustedOrigins.split(','),
      credentials: true,
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(port);
}

bootstrap()
  .then(async () => {
    console.info(`SERVER LISTENING IN PORT :${port}`);
    await initSuperAdmin();
  })
  .catch((error) => {
    console.log('ERROR starting up the server: ', error);
  });
