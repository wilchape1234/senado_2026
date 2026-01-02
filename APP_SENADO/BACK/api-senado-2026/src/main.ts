import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // 1. Habilitar CORS
  app.enableCors(); 

  // Definimos el puerto en una variable para usarla en el log
  const port = process.env.PORT ?? 3000;

  await app.listen(port);
  
  // 2. Mostrar la dirección en consola
  logger.log(`Servidor corriendo en: http://localhost:${port}`);
}
bootstrap();