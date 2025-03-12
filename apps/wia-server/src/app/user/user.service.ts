import {
	ForbiddenException,
	Injectable,
	NotFoundException,
	PreconditionFailedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import {
	EditUserResponse,
	EditUserService,
	GetAllUsersResponse,
	GetUserResponse,
	UserResponse,
	prismaSelectUser,
	type UpdatePasswordService,
} from '@wia-nx/types';
import { upsertUserImage } from '@wia-server/src/utils';
// import { hash } from 'argon2';
// import { applicationDefault, initializeApp } from 'firebase-admin/app';
// import { getStorage } from 'firebase-admin/storage';
// import mongoose, { Schema } from 'mongoose';
// import { readdir } from 'fs/promises';

import { hash, verify } from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';

// import animes from '../../../tmp/dumps/main.animes.json';
// import mangas from '../../../tmp/dumps/main.mangas.json';
// import videogames from '../../../tmp/dumps/main.videogames.json';
// import waifus from '../../../tmp/dumps/main.waifus.json';
// import users from '../../../tmp/dumps/main.users.json';

@Injectable()
export class UserService {
	constructor(
		private prisma: PrismaService,
		private config: ConfigService,
		private storage: StorageService
	) {}

	async getMe(userId: User['id']): Promise<GetUserResponse> {
		return this.prisma.findUniqueUserWithImage(userId);
	}

	async getAllUsers(): Promise<GetAllUsersResponse> {
		const rawUsers = await this.prisma.user.findMany({
			...prismaSelectUser,
		});
		const users: GetAllUsersResponse = rawUsers.map<UserResponse>((user) =>
			this.prisma.transformPrismaUserToUserResponse(user)
		);
		return users;
	}

	// post services

	// patch services

	async editUser(dto: EditUserService): Promise<EditUserResponse> {
		const { userDto, userId, imageFile } = dto;
		let { alias, firstName, lastName } = userDto;
		if (alias) alias = alias.trim();
		if (firstName) firstName = firstName.trim();
		if (lastName) lastName = lastName.trim();

		const oldUser = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
			select: {
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

		if (!oldUser) throw new NotFoundException('user not found');

		const upsertUserImageOptions = upsertUserImage(userDto);

		const updatedUser = await this.prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				alias,
				firstName,
				lastName,
				image: upsertUserImageOptions,
			},
			...prismaSelectUser,
		});

		let image: EditUserResponse['image'];

		if (imageFile && updatedUser.image) {
			if (oldUser.image) {
				const deleteImageFileName = this.storage.getFirebaseImageString(
					updatedUser.uid,
					'user',
					oldUser.image.image.format
				);
				await this.storage.deleteFile(deleteImageFileName);
			}
			image = {
				src: await this.storage.uploadFile(
					imageFile,
					updatedUser.uid,
					'user',
					updatedUser.image.image.format
				),
			};
		}

		return { ...updatedUser, image };
	}

	async updatePassword(dto: UpdatePasswordService) {
		// check confirm password is the same as new password
		if (dto.newPassword !== dto.confirmPassword)
			throw new PreconditionFailedException(
				'new password and confirm password must match'
			);

		// check user
		const user = await this.prisma.user.findUnique({
			where: {
				id: dto.userId,
			},
			select: {
				hash: true,
			},
		});
		if (!user) throw new NotFoundException('user not found');

		// check user current password
		const valid = await verify(user.hash, dto.currentPassword);
		if (!valid) throw new ForbiddenException('incorrect credentials');

		// check new password is not the same as current
		const sameAsCurrent = await verify(user.hash, dto.newPassword);
		if (sameAsCurrent)
			throw new PreconditionFailedException(
				'new password must be different from current'
			);

		// update password
		const newPassword = await hash(dto.newPassword);
		await this.prisma.user.update({
			where: {
				id: dto.userId,
			},
			data: {
				hash: newPassword,
			},
		});
	}

	renameImagesToIds() {
		// const mediaTypes: MediaType[] = ['anime', 'manga', 'videogame'];

		// const promises: Promise<any>[] = [];

		// for (const mediaType of mediaTypes) {
		// 	const imageDir = `/home/jonas/Downloads/google/bucket/wia-web-app.appspot.com/${mediaType}_images`;
		// 	const images = (
		// 		await readdir(imageDir, { withFileTypes: true })
		// 	).filter((dir) => !dir.isDirectory());
		// 	const media = await this.prisma.media.findMany({
		// 		where: {
		// 			type: mediaType,
		// 		},
		// 		select: {
		// 			id: true,
		// 			title: true,
		// 			image: {
		// 				select: {
		// 					image: {
		// 						select: {
		// 							format: true,
		// 						},
		// 					},
		// 				},
		// 			},
		// 		},
		// 	});

		// 	for (let i = 0; i < media.length; i++) {
		// 		const mediaImage = media[i].image;
		// 		if (mediaImage !== null) {
		// 			const imageFileName = formatImageFileName(
		// 				media[i].title,
		// 				mediaImage.image.format
		// 			);
		// 			const image = images.find(
		// 				(image) => image.name === imageFileName
		// 			);
		// 			if (image) {
		// 				const completePath = path.join(imageDir, image.name);
		// 				const newName = `${media[i].id}.${mediaImage.image.format}`;
		// 				const destination = path.resolve(
		// 					'/home/jonas/Downloads/google/bucket/custom-bucket/media',
		// 					newName
		// 				);
		// 				promises.push(copyFile(completePath, destination));
		// 			}
		// 		}
		// 	}
		// }

		// const imageDir = `/home/jonas/Downloads/google/bucket/wia-web-app.appspot.com/waifu_images`;
		// const images = (
		// 	await readdir(imageDir, { withFileTypes: true })
		// ).filter((dir) => !dir.isDirectory());
		// const waifus = await this.prisma.waifu.findMany({
		// 	select: {
		// 		id: true,
		// 		name: true,
		// 		image: {
		// 			select: {
		// 				image: {
		// 					select: {
		// 						format: true,
		// 					},
		// 				},
		// 			},
		// 		},
		// 	},
		// });

		// for (let i = 0; i < waifus.length; i++) {
		// 	const waifuImage = waifus[i].image;
		// 	if (waifuImage !== null) {
		// 		const imageFileName = formatImageFileName(
		// 			waifus[i].name,
		// 			waifuImage.image.format
		// 		);
		// 		const image = images.find(
		// 			(image) => image.name === imageFileName
		// 		);
		// 		if (image) {
		// 			const completePath = path.join(imageDir, image.name);
		// 			const newName = `${waifus[i].id}.${waifuImage.image.format}`;
		// 			const destination = path.resolve(
		// 				'/home/jonas/Downloads/google/bucket/custom-bucket/waifu',
		// 				newName
		// 			);
		// 			promises.push(copyFile(completePath, destination));
		// 		} else {
		// 			console.log('image not found for:', waifus[i].name);
		// 		}
		// 	} else {
		// 		console.log('this waifu has no image:', waifus[i].name);
		// 	}
		// }

		// await Promise.all(promises);

		// const imageDir = `/home/jonas/Downloads/google/bucket/wia-web-app.appspot.com/waifu_images`;
		// const images = (
		// 	await readdir(imageDir, { withFileTypes: true })
		// ).filter((dir) => !dir.isDirectory());
		// const waifus = await this.prisma.waifu.findMany({
		// 	select: {
		// 		id: true,
		// 		name: true,
		// 		image: {
		// 			select: {
		// 				image: {
		// 					select: {
		// 						format: true,
		// 					},
		// 				},
		// 			},
		// 		},
		// 	},
		// });

		// images.forEach((image) => {
		// 	const waifuImage = waifus.find((waifu) => {
		// 		if (waifu.image === null) return false;
		// 		const imageFilename = formatImageFileName(
		// 			waifu.name,
		// 			waifu.image.image.format
		// 		);
		// 		return imageFilename === image.name;
		// 	});
		// 	if (typeof waifuImage === 'undefined') {
		// 		console.log('waifu not found for:', image.name);
		// 	}
		// });
		return false;
	}

	// async mediaFirebase() {
	// 	const ImageFormats: string[] = [
	// 		'apng',
	// 		'avif',
	// 		'gif',
	// 		'jpg',
	// 		'jpeg',
	// 		'jfif',
	// 		'pjpeg',
	// 		'pjp',
	// 		'png',
	// 		'svg',
	// 		'webp',
	// 	];

	// 	try {
	// 		await mongoose.connect(this.config.get('MONGO_URI'));
	// 		mongoose.set('strictQuery', true);
	// 	} catch (error) {
	// 		Logger.error('Error on mongoose connection');
	// 		Logger.error(error.toString());
	// 		return;
	// 	}
	// 	console.log('connected to mongo');

	// 	// create videogame schema
	// 	const childUserSchema = new Schema({
	// 		date: Date,
	// 		uid: String,
	// 	});
	// 	const videogameSchema = new Schema({
	// 		title: String,
	// 		playedBy: [childUserSchema],
	// 		image: {
	// 			has: Boolean,
	// 			path: String,
	// 		},
	// 	});
	// 	const Videogame = mongoose.model('videogame', videogameSchema);

	// 	// find all videogame
	// 	const mongoVideogame = await Videogame.find({}).select({
	// 		title: 1,
	// 		image: 1,
	// 	});
	// 	const getMongoVideogame = () => mongoVideogame;
	// 	type MongoVideogame = ReturnType<typeof getMongoVideogame>[0];
	// 	console.log('found all mongo videogame');

	// 	// init firebase app
	// 	initializeApp({
	// 		credential: applicationDefault(),
	// 		storageBucket: 'wia-web-app.appspot.com',
	// 	});

	// 	// get storage bucket
	// 	const bucket = getStorage().bucket();

	// 	// get all files from videogame images
	// 	const [files] = await bucket.getFiles({
	// 		prefix: 'videogame_images/',
	// 	});
	// 	const getFiles = () => files;
	// 	type FileType = ReturnType<typeof getFiles>[0];
	// 	console.log('found all videogame image files');

	// 	const pairs: {
	// 		videogame: MongoVideogame;
	// 		file: FileType;
	// 	}[] = [];
	// 	mongoVideogame.forEach((videogame) => {
	// 		if (videogame.image.has) {
	// 			const file = files.find(
	// 				(file) => file.name === videogame.image.path
	// 			);
	// 			pairs.push({
	// 				videogame,
	// 				file,
	// 			});
	// 		}
	// 	});

	// 	let skip = false;
	// 	await Promise.all(
	// 		pairs.map(async (pair) => {
	// 			if (skip) return;
	// 			const { videogame, file } = pair;
	// 			const format = videogame.image.path.split('.').pop();
	// 			const newFileName = `videogame_images/${encodeURIComponent(
	// 				videogame.title
	// 			)}.${format}`;

	// 			// if (
	// 			// 	videogame.title !==
	// 			// 	file.name.split('/').pop().split('.').shift()
	// 			// )
	// 			// 	console.log(
	// 			// 		videogame.title,
	// 			// 		'\n',
	// 			// 		file.name,
	// 			// 		'\n',
	// 			// 		newFileName,
	// 			// 		'\n'
	// 			// 	);

	// 			// if (videogame.image.path !== newFileName)
	// 			// 	console.log(
	// 			// 		videogame.title,
	// 			// 		'\n',
	// 			// 		file.name,
	// 			// 		'\n',
	// 			// 		newFileName,
	// 			// 		'\n'
	// 			// 	);

	// 			// try {
	// 			// 	if (skip) return;
	// 			// 	await file.rename(newFileName);
	// 			// 	videogame.image.path = newFileName;
	// 			// 	await videogame.save();
	// 			// } catch (error) {
	// 			// 	skip = true;
	// 			// 	console.error('error at updating', error);
	// 			// 	console.log(pair);
	// 			// }
	// 		})
	// 	);
	// }

	// async waifuFirebase() {
	// 	const ImageFormat: string[] = [
	// 		'apng',
	// 		'avif',
	// 		'gif',
	// 		'jpg',
	// 		'jpeg',
	// 		'jfif',
	// 		'pjpeg',
	// 		'pjp',
	// 		'png',
	// 		'svg',
	// 		'webp',
	// 	];

	// 	// connect to mongo
	// 	try {
	// 		await mongoose.connect(this.config.get('MONGO_URI'));
	// 	} catch (error) {
	// 		Logger.error('Error on mongoose connection');
	// 		Logger.error(error.toString());
	// 		return;
	// 	}
	// 	console.log('connected to mongo');

	// 	// create waifu schema
	// 	const waifuSchema = new Schema({
	// 		name: String,
	// 		uid: String,
	// 		type: Number,
	// 		_anime: { type: Schema.Types.ObjectId, ref: 'Anime' },
	// 		_manga: { type: Schema.Types.ObjectId, ref: 'Manga' },
	// 		_videogame: { type: Schema.Types.ObjectId, ref: 'Videogame' },
	// 		from: String,
	// 		image: {
	// 			has: Boolean,
	// 			path: String,
	// 		},
	// 	});
	// 	const Waifu = mongoose.model('Waifu', waifuSchema);
	// 	mongoose.set('strictQuery', true);

	// 	// find all waifus
	// 	const mongoWaifus = await Waifu.find({}).select({
	// 		name: 1,
	// 		image: 1,
	// 	});
	// 	const getMongoWaifus = () => mongoWaifus;
	// 	type MongoWaifus = ReturnType<typeof getMongoWaifus>[0];
	// 	console.log('found all mongo waifus');

	// 	// init firebase app
	// 	initializeApp({
	// 		credential: applicationDefault(),
	// 		storageBucket: 'wia-web-app.appspot.com',
	// 	});

	// 	// get storage bucket
	// 	const bucket = getStorage().bucket();

	// 	// get all files from waifu images
	// 	const [files] = await bucket.getFiles({
	// 		prefix: 'waifu_images/',
	// 	});
	// 	const getFiles = () => files;
	// 	type FileType = ReturnType<typeof getFiles>[0];
	// 	console.log('found all waifu image files');

	// 	const pairs: {
	// 		waifu: MongoWaifus;
	// 		file: FileType;
	// 	}[] = [];
	// 	mongoWaifus.forEach((waifu) => {
	// 		if (waifu.image.has) {
	// 			const file = files.find(
	// 				(file) => file.name === waifu.image.path
	// 			);
	// 			pairs.push({ waifu, file });
	// 		}
	// 	});

	// 	let skip = false;
	// 	await Promise.all(
	// 		pairs.map(async (pair) => {
	// 			if (skip) return;
	// 			const { waifu, file } = pair;
	// 			const format = waifu.image.path.split('.').pop();
	// 			const newFileName = `waifu_images/${encodeURIComponent(
	// 				waifu.name
	// 			)}.${format}`;
	// 			if (!ImageFormat.includes(format)) {
	// 				skip = true;
	// 				return;
	// 			}

	// 			// try {
	// 			// 	if (
	// 			// 		waifu.name !==
	// 			// 		file.name.split('/').pop().split('.').shift()
	// 			// 	) {
	// 			// console.log(
	// 			// 	waifu.name,
	// 			// 	'\n',
	// 			// 	file.name,
	// 			// 	'\n',
	// 			// 	newFileName,
	// 			// 	'\n'
	// 			// );
	// 			// 	}
	// 			// } catch (error) {
	// 			// 	skip = true;
	// 			// 	console.error(error);
	// 			// 	console.log(pair);
	// 			// }

	// 			// try {
	// 			// 	if (skip) return;
	// 			// 	await file.rename(newFileName);
	// 			// 	waifu.image.path = newFileName;
	// 			// 	await waifu.save();
	// 			// } catch (error) {
	// 			// 	skip = true;
	// 			// 	console.error('error at updating', error);
	// 			// 	console.log(pair);
	// 			// }

	// 			if (waifu.image.path !== newFileName) {
	// 				console.log(
	// 					waifu,
	// 					'\n',
	// 					file.name,
	// 					'\n',
	// 					newFileName,
	// 					'\n'
	// 				);
	// 			}
	// 		})
	// 	);

	// 	// insert to images the image names that don't end with a compatible format
	// 	// const images: Record<string, { metadata: string }> = {};
	// 	// await Promise.all(
	// 	// 	files.map(async (file) => {
	// 	// 		const [meta] = await file.getMetadata();
	// 	// 		if (!ImageFormat.includes(file.name.split('.').pop()))
	// 	// 			images[file.name] = { metadata: meta.contentType };
	// 	// 	})
	// 	// );
	// 	// console.log('found all incompatible image formats');

	// 	// change name of image file in firebase storage along with mongo db waifu.image.path in case it needs to
	// 	// const res: any[] = [];
	// 	// await Promise.all(
	// 	// 	mongoWaifus.map(async (waifu) => {
	// 	// 		if (waifu.image.has && images[waifu.image.path]) {
	// 	// 			const imageType = images[waifu.image.path].metadata
	// 	// 				.split('/')
	// 	// 				.pop();
	// 	// 			const newImageName = `waifu_images/${encodeURIComponent(
	// 	// 				waifu.name
	// 	// 			)}.${imageType}`;
	// 	// 			await bucket.file(waifu.image.path).rename(newImageName);
	// 	// 			waifu.image.path = newImageName;
	// 	// 			await waifu.save();
	// 	// 			res.push({
	// 	// 				oldName: waifu.image.path,
	// 	// 				newName: newImageName,
	// 	// 			});
	// 	// 		}
	// 	// 	})
	// 	// );
	// 	// console.log('changed all image names');
	// 	// res.forEach(console.log);
	// }

	// async checkup() {
	// 	const MediaTypeLabels: string[] = [
	// 		'apng',
	// 		'avif',
	// 		'gif',
	// 		'jpg',
	// 		'jpeg',
	// 		'jfif',
	// 		'pjpeg',
	// 		'pjp',
	// 		'png',
	// 		'svg',
	// 		'webp',
	// 	];
	// 	waifus.forEach((waifu) => {
	// 		if (waifu.image.has) {
	// 			if (
	// 				!MediaTypeLabels.includes(waifu.image.path.split('.').pop())
	// 			) {
	// 				console.log(`${waifu.name} - ${waifu.image.path}`);
	// 			}
	// 		}
	// 	});
	// }

	// async migrate() {
	// 	const parseDateFromOID = (oid: string) =>
	// 		new Date(parseInt(oid.slice(0, 8), 16) * 1000).toISOString();

	// 	// const hashedPassword = await hash('password');
	// 	// const createUsers: Prisma.UserCreateManyInput[] = users.map((elem) => {
	// 	// 	return {
	// 	// 		alias: elem.alias,
	// 	// 		email: elem.email,
	// 	// 		firstName: elem.firstName,
	// 	// 		lastName: elem.lastName,
	// 	// 		hash: hashedPassword,
	// 	// 		uid: elem.uid,
	// 	// 	};
	// 	// });

	// 	// await this.prisma.user.createMany({
	// 	// 	data: createUsers,
	// 	// });

	// 	/**
	// 	 * create an object of users where each key represents the user uid
	// 	 * and the value represents its prisma generated id
	// 	 */
	// 	const createdUsers: Record<string, { id: string }> = {};
	// 	(
	// 		await this.prisma.user.findMany({
	// 			select: {
	// 				uid: true,
	// 				id: true,
	// 			},
	// 		})
	// 	).forEach((user) => {
	// 		createdUsers[user.uid] = { id: user.id };
	// 	});

	// 	console.log('got users ids');

	// 	/**
	// 	 * create an object where each key represents a media title
	// 	 * and its value represents the contents of the original media
	// 	 */
	// 	const originalMedia: Record<
	// 		string,
	// 		{
	// 			knownBy: { uid: string; knownAt: Date }[];
	// 			image: { has: boolean; path: string };
	// 			id: string;
	// 			mongoId: string;
	// 		}
	// 	> = {};
	// 	/**
	// 	 * create an object where each key represents a media id from mongo
	// 	 * and each value represents its id from prisma
	// 	 */
	// 	const mediaByOID: Record<string, string> = {};

	// 	const createMedia: Prisma.MediaCreateManyInput[] = [];

	// 	animes.forEach((anime) => {
	// 		createMedia.push({
	// 			title: anime.title,
	// 			type: 'anime',
	// 			createdAt: parseDateFromOID(anime._id.$oid),
	// 		});

	// 		if (!originalMedia[anime.title])
	// 			originalMedia[anime.title] = {
	// 				knownBy: anime.watchedBy.map((user) => {
	// 					return {
	// 						uid: user.uid,
	// 						knownAt: new Date(user.date.$date),
	// 					};
	// 				}),
	// 				image: { ...anime.image },
	// 				id: '',
	// 				mongoId: anime._id.$oid,
	// 			};
	// 	});

	// 	mangas.forEach((manga) => {
	// 		createMedia.push({
	// 			title: manga.title,
	// 			type: 'manga',
	// 			createdAt: parseDateFromOID(manga._id.$oid),
	// 		});

	// 		if (!originalMedia[manga.title])
	// 			originalMedia[manga.title] = {
	// 				knownBy: manga.readBy.map((user) => {
	// 					return {
	// 						uid: user.uid,
	// 						knownAt: new Date(user.date.$date),
	// 					};
	// 				}),
	// 				image: { ...manga.image },
	// 				id: '',
	// 				mongoId: manga._id.$oid,
	// 			};
	// 	});

	// 	videogames.forEach((videogame) => {
	// 		createMedia.push({
	// 			title: videogame.title,
	// 			type: 'videogame',
	// 			createdAt: parseDateFromOID(videogame._id.$oid),
	// 		});

	// 		if (!originalMedia[videogame.title])
	// 			originalMedia[videogame.title] = {
	// 				knownBy: videogame.playedBy.map((user) => {
	// 					return {
	// 						uid: user.uid,
	// 						knownAt: new Date(user.date.$date),
	// 					};
	// 				}),
	// 				image: { ...videogame.image },
	// 				id: '',
	// 				mongoId: videogame._id.$oid,
	// 			};
	// 	});

	// 	await this.prisma.media.createMany({
	// 		data: createMedia,
	// 	});

	// 	console.log('created media');

	// 	const medias = await this.prisma.media.findMany({
	// 		select: {
	// 			id: true,
	// 			title: true,
	// 		},
	// 	});

	// 	console.log('got media ids');

	// 	medias.forEach((media) => {
	// 		console.log('media title:', media.title);
	// 		console.log('media id:', media.id);
	// 		originalMedia[media.title].id = media.id;
	// 	});

	// 	const mediaPromises: PrismaPromise<unknown>[] = [];
	// 	const imagePromises: PrismaPromise<unknown>[] = [];
	// 	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	// 	Object.entries(originalMedia).forEach(([title, media]) => {
	// 		mediaPromises.push(
	// 			this.prisma.media.update({
	// 				where: {
	// 					id: media.id,
	// 				},
	// 				data: {
	// 					knownBy: {
	// 						create: media.knownBy.map((user) => {
	// 							return {
	// 								user: {
	// 									connect: {
	// 										id: createdUsers[user.uid].id,
	// 									},
	// 								},
	// 								knownAt: user.knownAt.toISOString(),
	// 							};
	// 						}),
	// 					},
	// 				},
	// 			})
	// 		);

	// 		mediaByOID[media.mongoId] = media.id;

	// 		if (media.image.has) {
	// 			imagePromises.push(
	// 				this.prisma.image.create({
	// 					data: {
	// 						format: media.image.path
	// 							.split('.')
	// 							.pop() as ImageFormat,
	// 						media: {
	// 							create: {
	// 								mediaId: media.id,
	// 							},
	// 						},
	// 					},
	// 				})
	// 			);
	// 		}
	// 	});

	// 	await this.prisma.$transaction(mediaPromises);

	// 	console.log('updated media');

	// 	await this.prisma.$transaction(imagePromises);

	// 	console.log('created media images');

	// 	const WaifuLevels = {
	// 		1: 'topWaifu',
	// 		2: 'chunin',
	// 		3: 'genin',
	// 		4: 'nationalTreasure',
	// 	};

	// 	const getWaifus = () => waifus;

	// 	type MediaTypeExt = '_anime' | '_manga' | '_videogame';
	// 	function assertMediaType(from: string): from is MediaType {
	// 		return ['anime', 'manga', 'videogame'].includes(from);
	// 	}
	// 	function assertFromString(from: string): MediaTypeExt {
	// 		if (assertMediaType(from)) {
	// 			return `_${from}`;
	// 		}
	// 		throw new Error(`not a valid media type ${JSON.stringify(from)}`);
	// 	}

	// 	const getMediaIdFromMediaOID = (
	// 		waifu: ReturnType<typeof getWaifus>[0]
	// 	) => {
	// 		const fromKey = assertFromString(waifu.from);
	// 		const mediaTypeFrom = waifu[fromKey];
	// 		if (typeof mediaTypeFrom !== 'undefined') {
	// 			return mediaByOID[mediaTypeFrom.$oid];
	// 		}
	// 		throw new Error(
	// 			`media id not found with OID ${JSON.stringify(waifu)}`
	// 		);
	// 	};

	// 	const createManyWaifus: Prisma.WaifuCreateManyInput[] = [];
	// 	const createWaifuImage: Record<
	// 		string,
	// 		{ format: ImageFormat; waifuId: string }
	// 	> = {};
	// 	waifus.forEach((waifu) => {
	// 		const createWaifu: Prisma.WaifuCreateManyInput = {
	// 			name: waifu.name,
	// 			since: parseDateFromOID(waifu._id.$oid),
	// 			level: WaifuLevels[waifu.type as 1 | 2 | 3 | 4] as WaifuLevel,
	// 			mediaId: getMediaIdFromMediaOID(waifu),
	// 			userId: createdUsers[waifu.uid].id,
	// 			createdAt: parseDateFromOID(waifu._id.$oid),
	// 		};
	// 		createManyWaifus.push(createWaifu);

	// 		if (waifu.image.has) {
	// 			createWaifuImage[`${createWaifu.name}-${createWaifu.mediaId}`] =
	// 				{
	// 					format: waifu.image.path
	// 						.split('.')
	// 						.pop() as ImageFormat,
	// 					waifuId: '',
	// 				};
	// 		}
	// 	});

	// 	await this.prisma.waifu.createMany({
	// 		data: createManyWaifus,
	// 	});

	// 	console.log('created waifus');

	// 	const createdWaifus = await this.prisma.waifu.findMany({
	// 		select: {
	// 			name: true,
	// 			id: true,
	// 			media: {
	// 				select: {
	// 					id: true,
	// 				},
	// 			},
	// 		},
	// 	});

	// 	console.log('got waifus ids');

	// 	createdWaifus.forEach((waifu) => {
	// 		if (createWaifuImage[`${waifu.name}-${waifu.media.id}`])
	// 			createWaifuImage[`${waifu.name}-${waifu.media.id}`].waifuId =
	// 				waifu.id;
	// 	});

	// 	const waifuImagePromises: PrismaPromise<unknown>[] = [];
	// 	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	// 	Object.entries(createWaifuImage).forEach(([nameMediaId, props]) => {
	// 		waifuImagePromises.push(
	// 			this.prisma.image.create({
	// 				data: {
	// 					format: props.format,
	// 					waifu: {
	// 						create: {
	// 							waifu: {
	// 								connect: {
	// 									id: props.waifuId,
	// 								},
	// 							},
	// 						},
	// 					},
	// 				},
	// 			})
	// 		);
	// 	});

	// 	await this.prisma.$transaction(waifuImagePromises);

	// 	console.log('created waifu images');
	// }

	// get services
}
