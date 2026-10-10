import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { json } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Las fotos viajan como texto dentro del JSON, asi que subimos el limite
  // por defecto de Express (100 KB) a 5 MB.
  app.use(json({ limit: '5mb' }));

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );
  app.enableCors();

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Gestock backend corriendo en http://localhost:${port}`);
}
bootstrap();