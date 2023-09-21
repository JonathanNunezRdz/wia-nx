import { Prisma, Waifu } from '@prisma/client';
import { RequestStatus } from '../common';
import { GetAllWaifusDto } from './get-all-waifus.dto';
import { GetEditWaifuResponse, WaifuResponse } from './waifu.response';

export * from './create-waifu.dto';
export * from './delete-waifu.dto';
export * from './edit-waifu.dto';
export * from './get-all-waifus.dto';
export * from './get-media-waifu.dto';
export * from './waifu.response';

export interface WaifuState {
	get: {
		data: WaifuResponse[];
		totalWaifus: number;
		appliedFilters: GetAllWaifusDto;
	} & RequestStatus;
	add: RequestStatus;
	edit: {
		data: GetEditWaifuResponse;
		local: RequestStatus;
		server: RequestStatus;
	} & RequestStatus;
	delete: {
		waifuId: Waifu['id'];
	} & RequestStatus;
}

export const prismaSelectWaifu = Prisma.validator<Prisma.WaifuDefaultArgs>()({
	select: {
		id: true,
		createdAt: true,
		updatedAt: true,
		name: true,
		level: true,
		since: true,
		media: {
			select: {
				id: true,
				title: true,
				type: true,
			},
		},
		user: {
			select: {
				id: true,
				alias: true,
			},
		},
		image: {
			select: {
				image: {
					select: {
						format: true,
					},
				},
			},
		},
	},
});

export type PrismaWaifuResponse = Prisma.WaifuGetPayload<
	typeof prismaSelectWaifu
>;

export const prismaWaifuFindManyInput = (dto: GetAllWaifusDto) =>
	Prisma.validator<Prisma.WaifuFindManyArgs>()({
		where: {
			name: {
				contains: dto.name,
				mode: 'insensitive',
			},
			level: {
				in: dto.level,
			},
			user: {
				id: {
					in: dto.users,
				},
			},
		},
		take: dto.limit,
		skip: (dto.page - 1) * dto.limit,
		orderBy: {
			createdAt: 'desc',
		},
		select: prismaSelectWaifu.select,
	});
