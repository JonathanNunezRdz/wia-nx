import { Prisma } from '@prisma/client';
import { EditUserDto } from '@wia-nx/types';

export function upsertUserImage(
	dto: EditUserDto
): Prisma.UserUpdateInput['image'] | undefined {
	if (typeof dto.imageFormat === 'string') {
		return {
			upsert: {
				create: {
					image: {
						create: {
							format: dto.imageFormat,
						},
					},
				},
				update: {
					image: {
						update: {
							format: dto.imageFormat,
						},
					},
				},
			},
		};
	}
	return undefined;
}
