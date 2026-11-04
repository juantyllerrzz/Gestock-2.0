import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { json } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Las fotos se suben como texto dentro del JSON
  // por defecto de Express (100 KB) a 5 MB.
  app.use(json({ limit: '5mb' }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  
  app.enableCors();

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Gestack backend corriendo en http://localhost:${port}`);
}
bootstrap();
