import { Prisma, User } from '@prisma/client';
import { CreateMediaDto, EditMediaDto } from '@wia-nx/types';

export const createMediaImage = (dto: CreateMediaDto) => {
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

export const editMediaImage = (
	dto: EditMediaDto
): Prisma.MediaUpdateInput['image'] | undefined => {
	const { imageFormat } = dto;
	if (typeof imageFormat === 'string') {
		return {
			upsert: {
				create: {
					image: {
						create: {
							format: imageFormat,
						},
					},
				},
				update: {
					image: {
						update: {
							format: imageFormat,
						},
					},
				},
			},
		};
	}
	return undefined;
};

export const editMediaKnownAt = (dto: EditMediaDto, userId: User['id']) => {
	const { knownAt, mediaId } = dto;
	if (typeof knownAt === 'string') {
		return {
			update: {
				data: {
					knownAt,
				},
				where: {
					userId_mediaId: {
						mediaId,
						userId,
					},
				},
			},
		};
	}
	return undefined;
};
