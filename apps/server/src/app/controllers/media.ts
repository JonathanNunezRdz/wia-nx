import { Request, Response } from 'express';
import { PendingQuery, Row } from 'postgres';
import sql from '../db';
import parseMediaFilter from '../utils/helpers/parseMediaFilter';
import parseUniqueConstraint from '../utils/helpers/parseUniqueConstraint';
import validateMedia from '../utils/helpers/validateMedia';
import validateMediaFilters from '../utils/helpers/validateMediaFilters';
import validateUpdateMediaInput from '../utils/helpers/validateUpdateMediaInput';
import { WithId } from '../utils/types/commonTypes';
import { InsertImage, RawImage } from '../utils/types/imageTypes';
import {
	InsertMedia,
	KnownBy,
	KnownMediaInput,
	Media,
	MediaInput,
	MediaResponse,
	RawFilteredMedia,
	RawKnownMedia,
	RawMedia,
	RawMediaFilter,
	RawMediaImage,
	UpdateMediaInput,
} from '../utils/types/mediaTypes';
import { RawUserWithImage, User } from '../utils/types/userTypes';

const updateMedia = async (
	req: Request<
		unknown,
		unknown,
		{
			updateMediaInput: UpdateMediaInput;
			updateKnownAtInput?: string;
		}
	>,
	res: Response<MediaResponse>
) => {
	const { updateMediaInput, updateKnownAtInput } = req.body;

	const errors = validateUpdateMediaInput(updateMediaInput);
	if (errors) {
		res.status(400).send({ errors });
		return;
	}

	const { id, title, imagePath } = updateMediaInput;

	// check if media.title needs update
	if (title)
		await sql`
			UPDATE media
			SET title = ${title}, updated_at = now()
			WHERE id = ${id}
		`;

	// columns to fetch for media
	const columns = [
		'm.title',
		'm.type',
		'm.created_at',
		'm.updated_at',
		'km.media_id',
		'km.user_id',
		'km.known_at',
		'u.alias',
		'u.first_name',
		'u.last_name',
		'u.email',
		'u.uid',
	];
	// fetch for media to update and send to frontend
	const rawMedias = await sql<RawFilteredMedia[]>`
		SELECT ${sql(
			columns
		)}, i.image_path media_image_path, ii.image_path media_image_path
		FROM media m
		INNER JOIN known_media km ON m.id = km.media_id 
		INNER JOIN public.user u ON km.user_id = u.id 
		LEFT JOIN media_image mi ON m.id = mi.media_id
		LEFT JOIN image i ON mi.image_id = i.id
		LEFT JOIN user_image ui ON u.id = ui.user_id 
		LEFT JOIN image ii ON ui.image_id = ii.id
		WHERE m.id = ${id}
	`;

	// prepare sendMedia to send to frontend
	const mediaTitleSet = new Set<string>();
	let sendMedia: Media = {} as Media;
	rawMedias.forEach((rawMedia) => {
		const knownByUser: KnownBy = {
			knownAt: rawMedia.known_at,
			user: {
				id: rawMedia.user_id,
				alias: rawMedia.alias,
				email: rawMedia.email,
				firstName: rawMedia.first_name,
				lastName: rawMedia.last_name,
				uid: rawMedia.uid,
				hasImage: !!rawMedia.user_image_path,
				imagePath: rawMedia.user_image_path ?? undefined,
			},
		};
		const mediaToPush: Media = {
			id: rawMedia.media_id,
			title: rawMedia.title,
			type: rawMedia.type,
			createdAt: rawMedia.created_at,
			updatedAt: rawMedia.updated_at,
			hasImage: !!rawMedia.media_image_path,
			imagePath: rawMedia.media_image_path ?? undefined,
			knownBy: [knownByUser],
		};
		if (mediaTitleSet.has(rawMedia.title)) {
			sendMedia.knownBy.push(knownByUser);
		} else {
			mediaTitleSet.add(rawMedia.title);
			sendMedia = { ...mediaToPush };
		}
	});

	// check if media.imagePath needs update or insert
	if (imagePath) {
		sendMedia.hasImage = true;
		sendMedia.imagePath = imagePath;
		// fetch imageId for the current media, can be null
		const [imageId] = await sql<WithId[]>`
			SELECT i.id FROM image i
			INNER JOIN media_image mi ON i.id = mi.image_id
			WHERE mi.media_id = ${id}
		`;
		// if not null, update value
		if (imageId) {
			await sql`
				UPDATE image
				SET image_path = ${imagePath}
				WHERE id = ${imageId.id}
			`;
			// if null, insert a new relation
		} else {
			const insertImage: InsertImage = {
				image_path: imagePath,
			};
			const [image] = await sql<RawImage[]>`
				INSERT INTO image${sql(insertImage)} RETURNING *
			`;
			const insertMediaImage: RawMediaImage = {
				image_id: image.id,
				media_id: sendMedia.id,
			};
			await sql`
				INSERT INTO media_image${sql(insertMediaImage)}
			`;
		}
	}

	// check if media.knownBy[currentUser].knownAt needs update
	if (updateKnownAtInput) {
		// fetch knownMedia relation for current user, can be null
		const [knownMedia] = await sql<RawKnownMedia[]>`
			SELECT * FROM known_media
			WHERE media_id = ${sendMedia.id} AND user_id = ${req.session.userId ?? 0}
		`;

		// if not null, update value
		if (knownMedia) {
			await sql`
				UPDATE known_media
				SET known_at = ${updateKnownAtInput}
				WHERE media_id = ${sendMedia.id} AND user_id = ${req.session.userId ?? 0}
			`;
			const userIndex = sendMedia.knownBy.findIndex(
				(knownUser) => knownUser.user.id === req.session.userId ?? 0
			);
			sendMedia.knownBy[userIndex].knownAt = new Date(updateKnownAtInput);
			// if null, insert a new relation
		} else {
			const insertKnownMedia: RawKnownMedia = {
				known_at: new Date(updateKnownAtInput),
				media_id: sendMedia.id,
				user_id: req.session.userId ?? 0,
			};
			const [newKnownMedia] = await sql<RawKnownMedia[]>`
				INSERT INTO known_media${sql(insertKnownMedia)} RETURNING *
			`;
			const [user] = await sql<RawUserWithImage[]>`
				SELECT u.id, u.alias, u.first_name, u.last_name, u.uid, u.email, i.image_path FROM public.user u 
				LEFT JOIN user_image ui ON u.id = ui.user_id
				LEFT JOIN image i ON ui.image_id = i.id
				WHERE u.id = ${req.session.userId ?? 0}
			`;
			sendMedia.knownBy.push({
				knownAt: newKnownMedia.known_at,
				user: {
					id: user.id,
					alias: user.alias,
					firstName: user.first_name,
					lastName: user.last_name,
					email: user.email,
					uid: user.uid,
					hasImage: !!user.image_path,
					imagePath: user.image_path ?? undefined,
				},
			});
		}
	}

	res.send({ media: sendMedia });
};

const getMedias = async (
	req: Request<unknown, unknown, unknown, RawMediaFilter>,
	res: Response<MediaResponse>
) => {
	// TODO: add user filter
	const mediaFilter = parseMediaFilter(req.query);
	const errors = validateMediaFilters(mediaFilter);
	if (errors) {
		res.status(400).send({ errors });
		return;
	}

	console.log('media filter', mediaFilter);
	const { cursor, limit, title, type, users } = mediaFilter;

	const filterUser = (userId: number) => {
		const tableName = sql`km${userId}`;
		return sql`
			INNER JOIN (SELECT * 
						FROM known_media
						WHERE user_id = ${userId}) ${tableName} ON km.media_id = ${tableName}.media_id
		`;
	};

	const filterUsers = (userIds: number[]) => {
		let query: PendingQuery<Row[]> = sql`
			INNER JOIN (SELECT km.media_id 
						FROM known_media km
		`;
		userIds.forEach((id, i) => {
			if (i === userIds.length - 1)
				query = sql`${query} WHERE km.user_id = ${id}) kms ON m.id = kms.media_id`;
			else query = sql`${query} ${filterUser(id)}`;
		});
		return query;
	};

	/**
	 * id: null,
    title: 'Naruto Series',
    type: 'anime',
    created_at: 2022-04-04T01:33:57.840Z,
    updated_at: 2022-04-04T01:40:13.481Z,
    user_id: null,
    media_id: 1,
    known_at: 2022-03-03T01:35:04.423Z,
    alias: 'jonas',
    first_name: 'Jonathan',
    last_name: 'Nunez',
    uid: 'asdlfkhassdfsdfdnifugasduyfgasvdbudgf',
    password: '$argon2i$v=19$m=4096,t=3,p=1$QucYEHRTdNa5IgeQb1jdpQ$s+A94s26V22uItq/2l2xFgb9eu0iDOON1k1Zy4uyL0s',
    email: 'jonas@jonas.com',
    image_id: null,
    image_path: null
	 */

	const columns = [
		'm.title',
		'm.type',
		'm.created_at',
		'm.updated_at',
		'km.media_id',
		'km.user_id',
		'km.known_at',
		'u.alias',
		'u.first_name',
		'u.last_name',
		'u.email',
		'u.uid',
	];
	// fetch for media to send to frontend
	const rawMedias = await sql<RawFilteredMedia[]>`
		SELECT ${sql(
			columns
		)}, i.image_path media_image_path, ii.image_path media_image_path
		FROM media m
		${users ? filterUsers(users) : sql``}
		INNER JOIN known_media km ON m.id = km.media_id 
		INNER JOIN public.user u ON km.user_id = u.id 
		LEFT JOIN media_image mi ON m.id = mi.media_id
		LEFT JOIN image i ON mi.image_id = i.id
		LEFT JOIN user_image ui ON u.id = ui.user_id 
		LEFT JOIN image ii ON ui.image_id = ii.id
		WHERE m.created_at < ${cursor}
		${title ? sql`AND m.title ILIKE ${'%' + title + '%'}` : sql``}
		${type ? sql`AND m.type IN ${sql(type)}` : sql``}
		ORDER BY m.created_at DESC
		LIMIT ${limit}
	`;

	// prepare sendMedias to send to frontend
	const mediaTitleSet = new Set<string>();
	const sendMedias: Media[] = [];
	rawMedias.forEach((rawMedia) => {
		const knownByUser: KnownBy = {
			knownAt: rawMedia.known_at,
			user: {
				id: rawMedia.user_id,
				alias: rawMedia.alias,
				email: rawMedia.email,
				firstName: rawMedia.first_name,
				lastName: rawMedia.last_name,
				uid: rawMedia.uid,
				hasImage: !!rawMedia.user_image_path,
				imagePath: rawMedia.user_image_path || undefined,
			},
		};
		const mediaToPush: Media = {
			id: rawMedia.media_id,
			title: rawMedia.title,
			type: rawMedia.type,
			createdAt: rawMedia.created_at,
			updatedAt: rawMedia.updated_at,
			hasImage: !!rawMedia.media_image_path,
			imagePath: rawMedia.media_image_path || undefined,
			knownBy: [knownByUser],
		};
		if (mediaTitleSet.has(rawMedia.title)) {
			const mediaIndex = sendMedias.findIndex(
				(mediaElem) => mediaElem.title === rawMedia.title
			);
			sendMedias[mediaIndex].knownBy.push(knownByUser);
		} else {
			mediaTitleSet.add(rawMedia.title);
			sendMedias.push(mediaToPush);
		}
	});

	res.send({ media: sendMedias });
};

const postMedia = async (
	req: Request<
		unknown,
		unknown,
		{
			mediaInput: MediaInput;
			knownMediaInput: Omit<KnownMediaInput, 'mediaId'>;
		}
	>,
	res: Response<MediaResponse>
) => {
	const { mediaInput, knownMediaInput } = req.body;
	const errors = validateMedia(mediaInput);
	if (errors) {
		res.status(400).send({ errors });
		return;
	}

	const { hasImage, title, type, imageFormat } = mediaInput;
	const { knownAt } = knownMediaInput;

	try {
		// prepare media entity to insert
		const insertMedia: InsertMedia = {
			title,
			type,
		};
		// insert media entity
		const [media] = await sql<RawMedia[]>`
			INSERT INTO media${sql(insertMedia)} RETURNING *
		`;

		// prepare media object to send to frontend
		const sendMedia: Media = {
			id: media.id,
			title: media.title,
			type: media.type,
			createdAt: media.created_at,
			updatedAt: media.updated_at,
			hasImage,
			knownBy: [],
		};

		if (hasImage) {
			// prepare image entity to insert
			const insertImage: InsertImage = {
				image_path: `/${type}_images/${media.id}.${imageFormat}`,
			};
			// insert image entity
			const [image] = await sql<RawImage[]>`
            	INSERT INTO image${sql(insertImage)} RETURNING *
        	`;

			// prepare media_image relation to insert
			const insertMediaImage: RawMediaImage = {
				media_id: media.id,
				image_id: image.id,
			};
			// insert media_image relation
			await sql`
            	INSERT INTO media_image${sql(insertMediaImage)}
        	`;

			sendMedia.imagePath = image.image_path;
		}

		// prepare known_media relation to insert
		const insertKnownMedia: RawKnownMedia = {
			media_id: media.id,
			user_id: req.session.userId ?? 0,
			known_at: new Date(knownAt),
		};
		// insert known_media relation
		const [knownMedia] = await sql<RawKnownMedia[]>`
			INSERT INTO known_media${sql(insertKnownMedia)} RETURNING *
		`;

		// select current user entity
		const [user] = await sql<RawUserWithImage[]>`
			SELECT u.id, u.alias, u.first_name, u.last_name, u.uid, u.email, i.image_path FROM public.user u 
			LEFT JOIN user_image ui ON u.id = ui.user_id
			LEFT JOIN image i ON ui.image_id = i.id
			WHERE u.id = ${req.session.userId ?? 0}
		`;

		// prepare user object to send to frontend
		const sendUser: User = {
			id: user.id,
			alias: user.alias,
			email: user.email,
			firstName: user.first_name,
			lastName: user.last_name,
			uid: user.uid,
			hasImage: !!user.image_path,
			imagePath: user.image_path ?? undefined,
		};

		// finish preparing media object to send to frontend
		sendMedia.knownBy.push({
			knownAt: knownMedia.known_at,
			user: sendUser,
		});

		res.send({ media: sendMedia });
	} catch (error) {
		if (error.code === '23505') {
			const uniqueError = parseUniqueConstraint(error);
			res.status(400).send({
				errors: [uniqueError],
			});
		}
	}
};

export default {
	postMedia,
	getMedias,
	updateMedia,
};
