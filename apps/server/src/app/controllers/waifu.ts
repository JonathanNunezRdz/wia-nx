import { Request, Response } from 'express';
import sql from '../db';
import parseUniqueConstraint from '../utils/helpers/parseUniqueConstraint';
import parseWaifuFilter from '../utils/helpers/parseWaifuFilter';
import validateUpdateWaifuInput from '../utils/helpers/validateUpdateWaifuInput';
import validateWaifu from '../utils/helpers/validateWaifu';
import validateWaifuFilter from '../utils/helpers/validateWaifuFilter';
import { WithId } from '../utils/types/commonTypes';
import { InsertImage, RawImage } from '../utils/types/imageTypes';
import { RawMediaWithImage } from '../utils/types/mediaTypes';
import { RawUserWithImage } from '../utils/types/userTypes';
import {
	InsertWaifu,
	RawFilteredWaifus,
	RawWaifu,
	RawWaifuFilter,
	RawWaifuImage,
	UpdateWaifuInput,
	Waifu,
	WaifuInput,
	WaifuResponse,
} from '../utils/types/waifuTypes';

const updateWaifu = async (
	req: Request<
		unknown,
		unknown,
		{
			updateWaifuInput: UpdateWaifuInput;
		}
	>,
	res: Response<WaifuResponse>
) => {
	const { updateWaifuInput } = req.body;
	const errors = validateUpdateWaifuInput(updateWaifuInput);
	if (errors) {
		res.status(400).send({ errors });
		return;
	}

	const { id, name, level, imagePath } = updateWaifuInput;

	const applyUpdate = () => {
		let query = sql``;
		let modified = false;
		if (name) {
			query = sql`SET name = ${name}`;
			modified = true;
		}
		if (level) {
			if (modified) query = sql`${query}, level = ${level}`;
			else query = sql`SET level = ${level}`;
		}
		return query;
	};

	await sql`
		UPDATE waifu
		${applyUpdate()}
		WHERE id = ${id}
	`;

	const columns = [
		'u.alias',
		'u.first_name',
		'u.last_name',
		'u.email',
		'u.uid',
		'w.name',
		'w.level',
		'w.media_id',
		'w.since',
		'w.created_at',
		'm.title',
		'm.type',
	];

	const [rawWaifu] = await sql<RawFilteredWaifus[]>`
		SELECT ${sql(
			columns
		)}, w.id waifu_id, u.id user_id, i.image_path waifu_image_path, ii.image_path user_image_path, iii.image_path media_image_path FROM public.user u
		INNER JOIN waifu w ON u.id = w.user_id
		INNER JOIN media m ON w.media_id = m.id
		LEFT JOIN user_image ui ON u.id = ui.user_id
		LEFT JOIN image i ON ui.image_id = i.id
		LEFT JOIN waifu_image wi ON w.id = wi.waifu_id
		LEFT JOIN image ii ON wi.image_id = ii.id
		LEFT JOIN media_image mi ON w.media_id = mi.media_id
		LEFT JOIN image iii ON mi.image_id = iii.id
		WHERE w.user_id = ${id}
	`;

	const sendWaifu: Waifu = {
		id: rawWaifu.waifu_id,
		name: rawWaifu.name,
		level: rawWaifu.level,
		user: {
			id: rawWaifu.user_id,
			alias: rawWaifu.alias,
			firstName: rawWaifu.first_name,
			lastName: rawWaifu.last_name,
			uid: rawWaifu.uid,
			email: rawWaifu.email,
			hasImage: !!rawWaifu.user_image_path,
			imagePath: rawWaifu.user_image_path || undefined,
		},
		media: {
			id: rawWaifu.media_id,
			title: rawWaifu.title,
			type: rawWaifu.type,
			hasImage: !!rawWaifu.media_image_path,
			imagePath: rawWaifu.media_image_path || undefined,
		},
		since: rawWaifu.since,
		createdAt: rawWaifu.created_at,
		hasImage: !!rawWaifu.waifu_image_path,
		imagePath: rawWaifu.waifu_image_path || undefined,
	};

	if (imagePath) {
		sendWaifu.hasImage = true;
		sendWaifu.imagePath = imagePath;

		const [image_id] = await sql<WithId[]>`
			SELECT i.id
			FROM image i
			INNER JOIN waifu_image wi ON i.id = wi.image_id
			WHERE wi.waifu_id = ${id}
		`;
		if (image_id) {
			await sql`
				UPDATE image
				SET image_path = ${imagePath}
				WHERE id = ${image_id.id}
			`;
		} else {
			const insertImage: InsertImage = {
				image_path: imagePath,
			};
			const [image] = await sql<RawImage[]>`
				INSERT INTO image${sql(insertImage)} RETURNING *
			`;
			const insertWaifuImage: RawWaifuImage = {
				image_id: image.id,
				waifu_id: id,
			};
			await sql`
				INSERT INTO waifu_image${sql(insertWaifuImage)}
			`;
		}
	}

	res.send({ waifu: sendWaifu });
};

const getWaifus = async (
	req: Request<unknown, unknown, unknown, RawWaifuFilter>,
	res: Response<WaifuResponse>
) => {
	const waifuFilter = parseWaifuFilter(req.query);
	const errors = validateWaifuFilter(waifuFilter);
	if (errors) {
		res.status(400).send({ errors });
		return;
	}

	console.log('waifu filter', waifuFilter);
	const { limit, name, level, user, cursor } = waifuFilter;

	const columns = [
		'u.alias',
		'u.first_name',
		'u.last_name',
		'u.email',
		'u.uid',
		'w.name',
		'w.level',
		'w.media_id',
		'w.since',
		'w.created_at',
		'm.title',
		'm.type',
	];

	const rawWaifus = await sql<RawFilteredWaifus[]>`
		SELECT ${sql(
			columns
		)}, w.id waifu_id, u.id user_id, i.image_path waifu_image_path, ii.image_path user_image_path, iii.image_path media_image_path FROM public.user u
		INNER JOIN waifu w ON u.id = w.user_id
		INNER JOIN media m ON w.media_id = m.id
		LEFT JOIN user_image ui ON u.id = ui.user_id
		LEFT JOIN image i ON ui.image_id = i.id
		LEFT JOIN waifu_image wi ON w.id = wi.waifu_id
		LEFT JOIN image ii ON wi.image_id = ii.id
		LEFT JOIN media_image mi ON w.media_id = mi.media_id
		LEFT JOIN image iii ON mi.image_id = iii.id
		WHERE w.created_at < ${cursor}
		${name ? sql`AND w.name ILIKE ${'%' + name + '%'}` : sql``}
		${level ? sql`AND w.level IN ${sql(level)}` : sql``}
		${user ? sql`AND w.user_id = ${user}` : sql``}
		ORDER BY w.created_at DESC
		LIMIT ${limit}
	`;

	const sendWaifus = rawWaifus.map((rawWaifu) => {
		const waifu: Waifu = {
			id: rawWaifu.waifu_id,
			name: rawWaifu.name,
			level: rawWaifu.level,
			user: {
				id: rawWaifu.user_id,
				alias: rawWaifu.alias,
				firstName: rawWaifu.first_name,
				lastName: rawWaifu.last_name,
				uid: rawWaifu.uid,
				email: rawWaifu.email,
				hasImage: !!rawWaifu.user_image_path,
				imagePath: rawWaifu.user_image_path || undefined,
			},
			media: {
				id: rawWaifu.media_id,
				title: rawWaifu.title,
				type: rawWaifu.type,
				hasImage: !!rawWaifu.media_image_path,
				imagePath: rawWaifu.media_image_path || undefined,
			},
			since: rawWaifu.since,
			createdAt: rawWaifu.created_at,
			hasImage: !!rawWaifu.waifu_image_path,
			imagePath: rawWaifu.waifu_image_path || undefined,
		};
		return waifu;
	});

	res.send({ waifu: sendWaifus });
};

const deleteWaifu = async (
	req: Request<{ id: string }>,
	res: Response<boolean>
) => {
	const { id } = req.params;
	const realId = parseInt(id);

	await sql`
		DELETE FROM waifu WHERE id = ${realId}
	`;

	res.send(true);
};

const postWaifu = async (
	req: Request<
		unknown,
		unknown,
		{
			waifuInput: WaifuInput;
		}
	>,
	res: Response<WaifuResponse>
) => {
	const { waifuInput } = req.body;
	const errors = validateWaifu(waifuInput);
	if (errors) {
		res.status(400).send({ errors });
		return;
	}

	try {
		// prepare waifu entity to insert
		const insertWaifu: InsertWaifu = {
			name: waifuInput.name,
			level: waifuInput.level,
			user_id: req.session.userId ?? 0,
			media_id: waifuInput.mediaId,
			since: new Date(),
		};
		// insert waifu entity
		const [waifu] = await sql<RawWaifu[]>`
            INSERT INTO waifu${sql(insertWaifu)} RETURNING *
        `;

		// fetch current user
		const [user] = await sql<RawUserWithImage[]>`
            SELECT u.id, u.alias, u.first_name, u.last_name, u.uid, u.email, i.image_path FROM public.user u 
            LEFT JOIN user_image ui ON u.id = ui.user_id
            LEFT JOIN image i ON ui.image_id = i.id
            WHERE u.id = ${req.session.userId ?? 0}
        `;

		// fetch media from waifu
		const [rawMediaWithImage] = await sql<RawMediaWithImage[]>`
            SELECT m.id, m.title, m.type, i.image_path FROM media m
            LEFT JOIN media_image mi ON m.id = mi.media_id
            LEFT JOIN image i ON mi.image_id = i.id
            WHERE m.id = ${waifuInput.mediaId}
        `;

		// prepare waifu object to send to frontend
		const sendWaifu: Waifu = {
			id: waifu.id,
			name: waifu.name,
			level: waifu.level,
			user: {
				id: user.id,
				alias: user.alias,
				firstName: user.first_name,
				lastName: user.last_name,
				email: user.email,
				uid: user.uid,
				hasImage: !!user.image_path,
				imagePath: user.image_path || undefined,
			},
			media: {
				id: rawMediaWithImage.id,
				title: rawMediaWithImage.title,
				type: rawMediaWithImage.type,
				hasImage: !!rawMediaWithImage.image_path,
				imagePath: rawMediaWithImage.image_path || undefined,
			},
			hasImage: waifuInput.hasImage,
			since: waifu.since,
			createdAt: waifu.created_at,
		};

		if (waifuInput.hasImage) {
			// prepare image entity to insert
			const insertImage: InsertImage = {
				image_path: `/waifu_images/${waifu.id}.${waifuInput.imageFormat}`,
			};
			// insert image entity
			const [image] = await sql<RawImage[]>`
                INSERT INTO image${sql(insertImage)} RETURNING *
            `;

			// prepare waifu_image relation to insert
			const insertWaifuImage: RawWaifuImage = {
				waifu_id: waifu.id,
				image_id: image.id,
			};
			// insert waifu_image relation
			await sql`
                INSERT INTO waifu_image${sql(insertWaifuImage)}
            `;

			sendWaifu.imagePath = image.image_path;
		}

		res.send({ waifu: sendWaifu });
	} catch (error) {
		if (error.code === '23505') {
			const uniqueError = parseUniqueConstraint(error);
			res.status(400).send({ errors: [uniqueError] });
		}
	}
};

export default {
	postWaifu,
	deleteWaifu,
	getWaifus,
	updateWaifu,
};
