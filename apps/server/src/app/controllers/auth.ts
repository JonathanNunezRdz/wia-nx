import { hash, verify } from 'argon2';
import { Request, Response } from 'express';
import sql from '../db';
import { COOKIE_NAME } from '../utils/constants';
import parseUniqueConstraint from '../utils/helpers/parseUniqueConstraint';
import validateEmail from '../utils/helpers/validateEmail';
import validateRegister from '../utils/helpers/validateRegister';
import { InsertImage, RawImage } from '../utils/types/imageTypes';
import {
	InsertUser,
	RawUser,
	RawUserImage,
	User,
	UserInput,
	UserResponse,
} from '../utils/types/userTypes';

interface Credentials {
	email: string;
	password: string;
}

const postLogin = async (
	req: Request<unknown, unknown, { credentials: Credentials }>,
	res: Response<UserResponse>
) => {
	//get user from credentials and save the session with user.id
	const { credentials } = req.body;
	if (!validateEmail(credentials.email)) {
		res.status(401).send({
			errors: [
				{
					field: 'email',
					message: 'Email not valid',
				},
			],
		});
		return;
	}

	const [user] = await sql<RawUser[]>`
		SELECT * FROM public.user u WHERE u.email = ${credentials.email}
	`;

	if (!user) {
		res.status(401).send({
			errors: [
				{
					field: 'email',
					message: "Email doesn't exist",
				},
			],
		});
		return;
	}

	const valid = await verify(user.password, credentials.password);
	if (!valid) {
		res.status(401).send({
			errors: [
				{
					field: 'password',
					message: 'Incorrect password',
				},
			],
		});
		return;
	}

	const imageResponse = await sql<(RawUserImage & RawImage)[]>`
			SELECT * FROM user_image ui INNER JOIN image i ON ui.image_id = i.id WHERE ui.user_id = ${user.id}
		`;

	const sendUser: User = {
		id: user.id,
		alias: user.alias,
		firstName: user.first_name,
		lastName: user.last_name,
		uid: user.uid,
		email: user.email,
		hasImage: false,
	};

	if (imageResponse.length > 0) {
		sendUser.hasImage = true;
		sendUser.imagePath = imageResponse[0].image_path;
	}

	req.session.userId = user.id;
	res.send({ user: sendUser });
};

const postLogout = async (req: Request, res: Response<boolean>) => {
	req.session.destroy((error) => {
		res.clearCookie(COOKIE_NAME);
		if (error) {
			console.error('logout', error);
			res.send(false);
		} else {
			res.send(true);
		}
	});
};

const getLogin = async (req: Request, res: Response<UserResponse>) => {
	const { userId } = req.session;
	if (userId) {
		const [user] = await sql<RawUser[]>`
            SELECT * FROM public.user u WHERE u.id = ${userId}
        `;
		const imageResponse = await sql<(RawUserImage & RawImage)[]>`
			SELECT * FROM user_image ui INNER JOIN image i ON ui.image_id = i.id WHERE ui.user_id = ${user.id}
		`;

		const sendUser: User = {
			id: user.id,
			alias: user.alias,
			firstName: user.first_name,
			lastName: user.last_name,
			uid: user.uid,
			email: user.email,
			hasImage: false,
		};

		if (imageResponse.length > 0) {
			sendUser.hasImage = true;
			sendUser.imagePath = imageResponse[0].image_path;
		}
		res.send({ user: sendUser });
	} else {
		res.send({
			errors: [
				{
					field: 'auth',
					message: 'Not logged in',
				},
			],
		});
	}
};

const register = async (
	req: Request<unknown, unknown, { userInput: UserInput }>,
	res: Response<UserResponse>
) => {
	const { userInput } = req.body;
	const errors = validateRegister(userInput);
	if (errors) {
		res.send({ errors });
		return;
	}

	const hashedPassword = await hash(userInput.password);
	const insertUser: InsertUser = {
		alias: userInput.alias,
		first_name: userInput.firstName,
		last_name: userInput.lastName,
		uid: userInput.uid,
		email: userInput.email,
		password: hashedPassword,
	};

	try {
		// insert entity user
		const [user] = await sql<RawUser[]>`
			INSERT INTO public.user${sql(insertUser)} RETURNING *
		`;
		const sendUser: User = {
			id: user.id,
			alias: user.alias,
			firstName: user.first_name,
			lastName: user.last_name,
			uid: user.uid,
			email: user.email,
			hasImage: userInput.hasImage,
		};
		if (userInput.hasImage) {
			// insert entity image
			const insertImage: InsertImage = {
				image_path: `/user_images/${user.uid}.${
					userInput.imageFormat || ''
				}`,
			};
			const [image] = await sql<RawImage[]>`
				INSERT INTO image${sql(insertImage)} RETURNING *
			`;
			// insert relation user_image
			const insertUserImage: RawUserImage = {
				user_id: user.id,
				image_id: image.id,
			};
			await sql`
				INSERT INTO user_image${sql(insertUserImage)}
			`;
			sendUser.imagePath = image.image_path;
		}
		req.session.userId = sendUser.id;
		res.send({ user: sendUser });
	} catch (error) {
		if (error.code === '23505') {
			const uniqueError = parseUniqueConstraint(error);
			res.status(400).send({
				errors: [uniqueError],
			});
		} else {
			console.error(error);
		}
	}
};

const test = async (_req: Request, res: Response) => {
	const response = await sql<RawUser[]>`
        SELECT * FROM public.user u 
    `;
	res.send(response);
};

export default {
	getLogin,
	test,
	register,
	postLogin,
	postLogout,
};
