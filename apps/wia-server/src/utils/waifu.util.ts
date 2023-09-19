import { Prisma } from '@prisma/client';
import { CreateWaifuDto, EditWaifuDto } from '@wia-nx/types';

export const upsertWaifuImage = (
	dto: EditWaifuDto
): Prisma.WaifuUpdateInput['image'] | undefined => {
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

export const createWaifuImage = (dto: CreateWaifuDto) => {
	const { imageFormat } = dto;
	if (typeof imageFormat === 'string') {
		return {
			create: {
				image: {
					create: {
						format: imageFormat,
					},
				},
			},
		};
	}
};
