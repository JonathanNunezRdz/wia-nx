import { User } from '@prisma/client';
import { MyImage } from '../common';

export type EditUserResponse = UserResponse;

export type SignInResponse = {
	accessToken: string;
};

export type GetUserResponse = UserResponse;

export type GetAllUsersResponse = UserResponse[];

export type UserResponse = Omit<User, 'hash'> & {
	image?: MyImage;
};
