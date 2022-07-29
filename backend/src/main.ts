import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**
   * cors
   */
  app.enableCors();

  /**
   * Importing config module (.env and other settings)
   */
  const config: ConfigService = app.get(ConfigService);

  /**
   * global validation pipes setup
   */
  app.useGlobalPipes(new ValidationPipe());

  /**
   * swagger setup for documentation
   */
  const swaggerConfig = new DocumentBuilder()
    .setTitle('techGulids')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'techGulids',
  });

  await app.listen(config.get('PORT'), () =>
    console.log(`Server started on port: ${config.get('PORT')}`),
  );
}
bootstrap();
