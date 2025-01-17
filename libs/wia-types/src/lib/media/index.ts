import { KnownMedia, MediaType, Prisma, User } from '@prisma/client';
import { MyImage } from '../common';
import { GetMediaDto } from './get-media.dto';

export * from './create-media.dto';
export * from './delete-media.dto';
export * from './edit-media.dto';
export * from './get-media-titles.dto';
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
		appliedFilters: GetMediaDto;
	};
}

export interface MediaLabel {
	present: { [k in MediaType]: string };
	past: { [k in MediaType]: string };
}

export const prismaSelectMedia = Prisma.validator<Prisma.MediaDefaultArgs>()({
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

export const prismaMediaFindManyInput = (dto: GetMediaDto) => {
	let userFilter: Prisma.MediaFindManyArgs['where'] | undefined;
	if (typeof dto.users !== 'undefined') {
		const { users } = dto;
		if (users.length === 1) {
			userFilter = {
				knownBy: {
					some: {
						user: {
							id: {
								in: users,
							},
						},
					},
				},
			};
		} else if (users.length > 1) {
			userFilter = {
				AND: [
					...users.map((user) => ({
						knownBy: {
							some: {
								user: {
									id: {
										in: [user],
									},
								},
							},
						},
					})),
				],
			};
		}
	}
	return Prisma.validator<Prisma.MediaFindManyArgs>()({
		where: {
			title: {
				contains: dto.title,
				mode: 'insensitive',
			},
			type: {
				in: dto.type,
			},
			...userFilter,
		},
		take: dto.limit,
		orderBy: {
			createdAt: 'desc',
		},
		skip: (dto.page - 1) * dto.limit,
		select: prismaSelectMedia.select,
	});
};
