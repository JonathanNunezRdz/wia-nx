import { Error, WithId, WithImage } from './commonTypes';

export interface RawUser extends WithId {
	alias: string;
	first_name: string;
	last_name: string;
	uid: string;
	email: string;
	password: string;
}

export type InsertUser = Omit<RawUser, 'id'>;

export interface User extends WithImage {
	id: number;
	alias: string;
	firstName: string;
	lastName: string;
	uid: string;
	email: string;
}

export type UserInput = Omit<User, 'id' | 'imagePath'> & {
	imageFormat?: string;
	password: string;
};

export interface RawUserImage {
	user_id: number | null;
	image_id: number | null;
}

export interface UserResponse {
	errors?: Error[];
	user?: User;
}

export interface RawUserWithImage extends Omit<RawUser, 'password'> {
	image_path: string | null;
}
