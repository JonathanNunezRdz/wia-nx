import type { Prisma } from '@prisma/client';
import { SignUpDto } from '@wia-nx/types';

export const createUserImage = (
	dto: SignUpDto
): Prisma.UserCreateInput['image'] => {
	if (typeof dto.imageFormat === 'string') {
		return {
			create: {
				image: {
					create: {
						format: dto.imageFormat,
					},
				},
			},
		};
	}
	return undefined;
};
