import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
		})
	);
	app.enableCors({
		origin: ['http://localhost:4200', 'https://thewia.vercel.app'],
	});

	const globalPrefix = 'api';
	app.setGlobalPrefix(globalPrefix);

	const port = process.env.PORT || 3333;
	await app.listen(port);
	Logger.log(
		`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
	);
}

bootstrap();
