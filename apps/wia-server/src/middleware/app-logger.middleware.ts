import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
	private logger = new Logger('HTTP');

	use(request: Request, response: Response, next: NextFunction): void {
		const startAt = process.hrtime();
		const { ip, method, originalUrl } = request;
		const userAgent = request.get('user-agent') || '';

		response.on('finish', () => {
			const { statusCode } = response;
			const contentLength = response.get('content-length') || '';
			const diff = process.hrtime(startAt);
			const responseTime = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(0);
			const message = `${method} | ${originalUrl} | ${statusCode} | ${responseTime}ms | ${contentLength} - ${userAgent} | ${ip}`;
			if (statusCode < 400) this.logger.log(message);
			else this.logger.error(message);
		});

		next();
	}
}
