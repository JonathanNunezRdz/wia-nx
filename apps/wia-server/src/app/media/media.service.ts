import {
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
	CreateMediaResponse,
	CreateMediaService,
	DeleteMediaService,
	EditMediaResponse,
	EditMediaService,
	GetEditMediaResponse,
	GetEditMediaService,
	GetMediaDto,
	GetMediaResponse,
	GetMediaTitlesResponse,
	GetMediaTitlesService,
	GetMediaWaifusResponse,
	GetMediaWaifusService,
	KnowMediaResponse,
	KnowMediaService,
	prismaMediaFindManyInput,
} from '@wia-nx/types';
import {
	createMediaImage,
	editMediaImage,
	editMediaKnownAt,
} from '../../utils';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class MediaService {
	constructor(
		private prisma: PrismaService,
		private storage: StorageService
	) {}

	// get services

	/**
	 * Gets all media from db applying given filters.
	 * If any media contains an image url, the client will download it.
	 * @param {GetMediaDto} dto Media filters
	 * @returns {GetMediaResponse} Media array with number of total medias
	 */
	async getMedias(dto: GetMediaDto): Promise<GetMediaResponse> {
		const input = prismaMediaFindManyInput(dto);
		const totalMedias = await this.prisma.media.count({
			where: input.where,
		});
		const rawMedias = await this.prisma.media.findMany(input);

		const medias: GetMediaResponse['medias'] = rawMedias.map((media) => {
			let image: GetMediaResponse['medias'][number]['image'];
			if (media.image) {
				image = {
					src: this.storage.getFirebaseImageString(
						media.title,
						media.type,
						media.image.image.format
					),
				};
			}

			return {
				...media,
				knownBy: media.knownBy.map((user) => {
					let userImage: GetMediaResponse['medias'][number]['knownBy'][number]['user']['image'];
					if (user.user.image) {
						userImage = {
							src: this.storage.getFirebaseImageString(
								user.user.uid,
								'user',
								user.user.image.image.format
							),
						};
					}
					return {
						...user,
						user: {
							id: user.user.id,
							alias: user.user.alias,
							image: userImage,
						},
					};
				}),
				image,
			};
		});

		return { medias, totalMedias };
	}

	/**
	 * Retrieve media titles that given userId has "known"
	 * @param {GetMediaTitlesService} dto user uuid
	 * @returns {GetMediaTitlesResponse} media titles and id array
	 */
	async getMediaTitles(
		dto: GetMediaTitlesService
	): Promise<GetMediaTitlesResponse> {
		const mediaTitles = await this.prisma.media.findMany({
			where: {
				knownBy: {
					some: {
						userId: {
							in: dto.memberId
								? [dto.userId, dto.memberId]
								: [dto.userId],
						},
					},
				},
			},
			select: {
				id: true,
				title: true,
			},
		});
		return mediaTitles;
	}

	async getEditMedia(
		dto: GetEditMediaService
	): Promise<GetEditMediaResponse> {
		const { userId, mediaId } = dto;

		const media = await this.prisma.media.findFirst({
			where: {
				id: mediaId,
				knownBy: {
					some: {
						userId,
					},
				},
			},
			select: {
				id: true,
				title: true,
				type: true,
				knownBy: {
					select: {
						knownAt: true,
						userId: true,
					},
				},
				image: {
					include: {
						image: {
							select: {
								id: true,
								format: true,
							},
						},
					},
				},
			},
		});

		if (!media) throw new NotFoundException('media not found');

		const knownAt = media.knownBy.find((user) => user.userId === userId);

		if (typeof knownAt === 'undefined')
			throw new ForbiddenException('access to resources denied');

		let image: GetEditMediaResponse['image'];
		if (media.image) {
			image = {
				src: this.storage.getFirebaseImageString(
					media.title,
					media.type,
					media.image.image.format
				),
			};
		}

		return {
			id: media.id,
			title: media.title,
			type: media.type,
			knownAt: knownAt.knownAt,
			image,
		};
	}

	async getMediaWaifus(
		dto: GetMediaWaifusService
	): Promise<GetMediaWaifusResponse> {
		const { id, waifuDto } = dto;
		const { name, level, users } = waifuDto;

		const rawMedia = await this.prisma.media.findUnique({
			where: {
				id,
			},
			include: {
				waifus: {
					where: {
						name,
						level: {
							in: level,
						},
						userId: {
							in: users,
						},
					},
					include: {
						image: {
							include: {
								image: {
									select: {
										format: true,
									},
								},
							},
						},
						user: {
							select: {
								id: true,
								alias: true,
							},
						},
					},
					orderBy: {
						createdAt: 'desc',
					},
				},
				image: {
					include: {
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
									include: {
										image: {
											select: {
												id: true,
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

		if (!rawMedia) throw new NotFoundException('media not found');

		let image: GetMediaWaifusResponse['media']['image'];

		if (rawMedia.image) {
			image = {
				src: this.storage.getFirebaseImageString(
					rawMedia.title,
					rawMedia.type,
					rawMedia.image.image.format
				),
			};
		}

		const waifus: GetMediaWaifusResponse['media']['waifus'] =
			rawMedia.waifus.map((waifu) => {
				let image: GetMediaWaifusResponse['media']['waifus'][number]['image'];
				if (waifu.image) {
					image = {
						src: this.storage.getFirebaseImageString(
							waifu.name,
							'waifu',
							waifu.image.image.format
						),
					};
				}
				return {
					...waifu,
					image,
				};
			});

		return {
			media: {
				...rawMedia,
				knownBy: rawMedia.knownBy.map((user) => {
					return {
						...user,
						user: {
							id: user.user.id,
							alias: user.user.alias,
						},
					};
				}),
				waifus,
				image,
			},
		};
	}

	// post services

	/**
	 * Creates a new media object and saves to db. Accceps an image to save to FirebaseStorage.
	 * Throws if media name already exists.
	 * @param {CreateMediaService} dto media info
	 * @returns {CreateMediaResponse} created media with updated number of medias
	 */
	async createMedia(dto: CreateMediaService): Promise<CreateMediaResponse> {
		const { userId, mediaDto } = dto;
		let { title } = mediaDto;
		const { type, knownAt } = mediaDto;
		title = mediaDto.title.trim();

		const createImage = createMediaImage(mediaDto);

		try {
			const rawMedia = await this.prisma.media.create({
				data: {
					title,
					type,
					image: createImage,
					knownBy: {
						create: [
							{
								user: {
									connect: {
										id: userId,
									},
								},
								knownAt,
							},
						],
					},
				},
				include: {
					image: {
						include: {
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
										include: {
											image: {
												select: {
													id: true,
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

			let image: CreateMediaResponse['image'];

			if (rawMedia.image && dto.imageFile) {
				// TODO: connect to firebase and upload image
				image = {
					src: await this.storage.uploadFile(
						dto.imageFile,
						rawMedia.title,
						rawMedia.type,
						rawMedia.image.image.format
					),
				};
			}

			const media: CreateMediaResponse = {
				...rawMedia,
				waifus: [],
				knownBy: rawMedia.knownBy.map((user) => {
					return {
						...user,
						user: {
							id: user.user.id,
							alias: user.user.alias,
						},
					};
				}),
				image,
			};

			return media;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === 'P2002')
					throw new ForbiddenException(
						`title: '${title}' is already in use`
					);
			}
			throw error;
		}
	}

	// patch services

	async knowMedia(dto: KnowMediaService): Promise<KnowMediaResponse> {
		const { userId, knowDto } = dto;
		const { mediaId, knownAt } = knowDto;

		const rawMedia = await this.prisma.media.update({
			where: {
				id: mediaId,
			},
			data: {
				knownBy: {
					create: [
						{
							user: {
								connect: {
									id: userId,
								},
							},
							knownAt,
						},
					],
				},
			},
			include: {
				waifus: {
					select: {
						id: true,
						name: true,
					},
					take: 3,
				},
				image: {
					include: {
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
									include: {
										image: {
											select: {
												id: true,
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

		let image: KnowMediaResponse['image'];

		if (rawMedia.image) {
			image = {
				src: this.storage.getFirebaseImageString(
					rawMedia.title,
					rawMedia.type,
					rawMedia.image.image.format
				),
			};
		}

		const media: KnowMediaResponse = {
			...rawMedia,
			knownBy: rawMedia.knownBy.map((user) => {
				return {
					...user,
					user: {
						id: user.user.id,
						alias: user.user.alias,
					},
				};
			}),
			image,
		};

		return media;
	}

	async editMedia(dto: EditMediaService): Promise<EditMediaResponse> {
		const { editDto, userId, imageFile } = dto;
		let { title } = editDto;
		const { type, mediaId } = editDto;
		if (title) title = title.trim();

		const editMediaImageOptions = editMediaImage(editDto);
		const editMediaKnownAtOptions = editMediaKnownAt(editDto, userId);

		const oldMedia = await this.prisma.media.findUnique({
			where: {
				id: mediaId,
			},
			select: {
				title: true,
				type: true,
				image: {
					select: {
						image: {
							select: {
								id: true,
								format: true,
							},
						},
					},
				},
			},
		});

		if (!oldMedia) throw new NotFoundException('media not found');

		const rawMedia = await this.prisma.media.update({
			where: {
				id: mediaId,
			},
			data: {
				title,
				type,
				image: editMediaImageOptions,
				knownBy: editMediaKnownAtOptions,
			},
			include: {
				waifus: {
					select: {
						id: true,
						name: true,
					},
					take: 3,
					orderBy: {
						createdAt: 'desc',
					},
				},
				image: {
					include: {
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
									include: {
										image: {
											select: {
												id: true,
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

		let image: EditMediaResponse['image'];

		if (imageFile && rawMedia.image) {
			// originalMedia did have an image before
			if (oldMedia.image) {
				// delete old image
				const deleteImageFileName = this.storage.getFirebaseImageString(
					oldMedia.title,
					oldMedia.type,
					oldMedia.image.image.format
				);
				await this.storage.deleteFile(deleteImageFileName);
			}
			// upload new image
			image = {
				src: await this.storage.uploadFile(
					imageFile,
					rawMedia.title,
					rawMedia.type,
					rawMedia.image.image.format
				),
			};
		} else if (!imageFile && rawMedia.image && oldMedia.image) {
			const oldImageName = this.storage.getFirebaseImageString(
				oldMedia.title,
				oldMedia.type,
				oldMedia.image.image.format
			);
			const newImageName = this.storage.getFirebaseImageString(
				rawMedia.title,
				rawMedia.type,
				rawMedia.image.image.format
			);
			await this.storage.changeFileName(oldImageName, newImageName);
		}

		const media: EditMediaResponse = {
			...rawMedia,
			knownBy: rawMedia.knownBy.map((user) => {
				return {
					...user,
					user: {
						alias: user.user.alias,
						id: user.user.id,
					},
				};
			}),
			image,
		};
		return media;
	}

	async deleteMedia(dto: DeleteMediaService): Promise<void> {
		const { mediaId, userId } = dto;

		const media = await this.prisma.media.findUnique({
			where: {
				id: mediaId,
			},
			select: {
				knownBy: {
					select: {
						userId: true,
					},
				},
			},
		});

		if (!media) throw new NotFoundException('media not found');

		if (media.knownBy.findIndex((users) => users.userId === userId) === -1)
			throw new ForbiddenException('access to resources denied');

		const deletedMedia = await this.prisma.media.delete({
			where: {
				id: mediaId,
			},
			select: {
				id: true,
				title: true,
				type: true,
				image: {
					select: {
						image: {
							select: {
								id: true,
								format: true,
							},
						},
					},
				},
			},
		});

		console.log('deleted media');

		// TODO: update code to make changes in firebase instead
		if (deletedMedia.image) {
			await this.prisma.image.delete({
				where: {
					id: deletedMedia.image.image.id,
				},
			});
			console.log('deleted prisma image');

			const deleteImageFileName = this.storage.getFirebaseImageString(
				deletedMedia.title,
				deletedMedia.type,
				deletedMedia.image.image.format
			);
			await this.storage.deleteFile(deleteImageFileName);
			console.log('deleted media image');
		}
	}
}
