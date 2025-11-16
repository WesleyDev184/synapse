import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400,
  });

  const config = new DocumentBuilder()
    .setTitle('Synapse API')
    .setDescription('The Synapse API description')
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('open-api', app, documentFactory);

  app.use(
    '/docs',
    apiReference({
      content: documentFactory,
      theme: 'deepSpace',
    }),
  );

  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
