import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { json } from 'express';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Las fotos viajan como texto dentro del JSON, asi que subimos el limite
  // por defecto de Express (100 KB) a 5 MB.
  app.use(json({ limit: '5mb' }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    }),
  );
  
  app.enableCors();

  // --- Configuración de Swagger ---
  const config = new DocumentBuilder()
    .setTitle('API de Gestock')
    .setDescription('Documentación de los endpoints para el sistema de gestión de inventario')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  
  // Monta la interfaz de Swagger en la ruta /api-docs
  SwaggerModule.setup('api-docs', app, document);
  // --------------------------------

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Gestock backend corriendo en http://localhost:${port}`);
  console.log(`Documentación Swagger disponible en http://localhost:${port}/api-docs`);
}
bootstrap();