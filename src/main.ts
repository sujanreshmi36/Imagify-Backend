import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {


  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: "*",
    credentials: true
  });

  app.setGlobalPrefix('api/v1');
  // app.useStaticAssets(path.join(__dirname, '../uploads'));
  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Imagify')
    .setDescription('API Documentation for Imagify')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'access-token',
        description: 'Enter access-token',
        in: 'header',
      },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  // Start the application
  await app.listen(process.env.PORT || 3000);
}
bootstrap()
  .then(() => {
    console.log(`Server started in http://localhost:${process.env.PORT}/api`);
  })
  .catch((e) =>
    console.error(`Error occurred while starting the server: ${e.message}`),
  );
