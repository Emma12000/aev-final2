import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, { logger: ['error', 'warn', 'log'] });

  const config = app.get(ConfigService);
  const port = config.get<number>('port') ?? 3001;
  const corsRaw = config.get<string>('corsOrigin') ?? '*';
  // Support comma-separated list of origins (e.g. "https://app.com,http://localhost:5500")
  const corsOrigin = corsRaw === '*' ? '*' : corsRaw.split(',').map(s => s.trim()).filter(Boolean);

  // Security headers
  app.use(helmet());

  // CORS
  app.enableCors({
    origin: corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Global pipes — validate and strip unknown properties
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global filters & interceptors
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger (désactivé en production)
  if (config.get('nodeEnv') !== 'production') {
    const doc = new DocumentBuilder()
      .setTitle('AEV Archives API')
      .setDescription('API du Portail des Archives Numériques — Association Espoir & Vie')
      .setVersion('1.0')
      .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')
      .build();
    const document = SwaggerModule.createDocument(app, doc);
    SwaggerModule.setup('api/docs', app, document, { jsonDocumentUrl: 'api/docs-json' });
    logger.log(`Swagger disponible : http://localhost:${port}/api/docs`);
  }

  await app.listen(port);
  logger.log(`API démarrée sur http://localhost:${port}/api/v1`);
}

bootstrap();
