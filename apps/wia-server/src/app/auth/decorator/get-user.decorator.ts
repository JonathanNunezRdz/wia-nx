import {
	ExecutionContext,
	ForbiddenException,
	createParamDecorator,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { Request } from 'express';

export const GetUser = createParamDecorator(
	(data: keyof User, ctx: ExecutionContext) => {
		const request: Request = ctx.switchToHttp().getRequest();
		if (!request.user) {
			throw new ForbiddenException('user not authenticated');
		}

		if (data) return (request.user as User)[data];
		return request.user as User;
	}
);
