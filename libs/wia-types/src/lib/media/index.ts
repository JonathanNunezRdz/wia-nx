import { KnownMedia, Media, MediaType, Prisma, User } from '@prisma/client';
import { MyImage, RequestStatus } from '../common';
import { GetMediaDto } from './get-media.dto';
import {
	GetEditMediaResponse,
	GetMediaTitlesResponse,
	GetMediaWaifusResponse,
	MediaResponse,
} from './media.response';

export * from './create-media.dto';
export * from './delete-media.dto';
export * from './edit-media.dto';
export * from './get-media.dto';
export * from './know-media.dto';
export * from './media.response';

export type MediaKnownUser = KnownMedia & {
	user: Pick<User, 'id' | 'alias'> & {
		image?: MyImage;
	};
};

export interface MediaState {
	get: {
		data: MediaResponse[];
		totalMedias: number;
		appliedFilters: GetMediaDto;
	} & RequestStatus;
	add: RequestStatus;
	know: RequestStatus;
	edit: {
		data: GetEditMediaResponse;
		local: RequestStatus;
		server: RequestStatus;
	} & RequestStatus;
	delete: {
		mediaId: Media['id'];
	} & RequestStatus;
	titles: {
		data: GetMediaTitlesResponse;
	} & RequestStatus;
	mediaWaifus: {
		id: Media['id'];
		data: GetMediaWaifusResponse;
	} & RequestStatus;
}

export interface MediaLabel {
	present: { [k in MediaType]: string };
	past: { [k in MediaType]: string };
}

export const prismaSelectMedia = Prisma.validator<Prisma.MediaArgs>()({
	select: {
		id: true,
		createdAt: true,
		updatedAt: true,
		title: true,
		type: true,
		waifus: {
			select: {
				id: true,
				name: true,
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
			take: 3,
			orderBy: {
				createdAt: 'desc',
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
		knownBy: {
			include: {
				user: {
					select: {
						id: true,
						alias: true,
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
				},
			},
			orderBy: {
				knownAt: 'asc',
			},
		},
	},
});

export type PrismaMediaResponse = Prisma.MediaGetPayload<
	typeof prismaSelectMedia
>;

export const prismaMediaFindManyInput = (dto: GetMediaDto) =>
	Prisma.validator<Prisma.MediaFindManyArgs>()({
		where: {
			title: {
				contains: dto.title,
				mode: 'insensitive',
			},
			type: {
				in: dto.type,
			},
			knownBy: {
				some: {
					user: {
						id: {
							in: dto.users,
						},
					},
				},
			},
		},
		take: dto.limit,
		orderBy: {
			createdAt: 'asc',
		},
		skip: (dto.page - 1) * dto.limit,
		select: prismaSelectMedia.select,
	});
