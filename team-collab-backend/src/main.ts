import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS (frontend connection)
  app.enableCors({
    origin: ["https://team-collaboration-platform-opal.vercel.app",],
    credentials: true,
  });

  // Global Validation Pipe (VERY IMPORTANT)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // removes extra fields
      forbidNonWhitelisted: true, // throws error if extra fields
      transform: true, // auto transform types
    }),
  );

  // Global prefix (clean API structure)
  app.setGlobalPrefix('api');

  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
