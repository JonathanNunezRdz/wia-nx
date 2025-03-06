import { Prisma } from '@prisma/client';
import { RequestStatus } from '../common';
import { GetAllUsersResponse, GetUserResponse } from './user.response';

export * from './edit-user.dto';
export * from './signin.dto';
export * from './signup.dto';
export * from './update-password.dto';
export * from './user.response';

export interface UserState {
	user: {
		data: GetUserResponse;
	} & RequestStatus;
	auth: {
		isLoggedIn: boolean;
		checkedJWT: boolean;
	};
	signIn: RequestStatus;
	signOut: RequestStatus;
	members: {
		data: GetAllUsersResponse;
	} & RequestStatus;
}

export const prismaSelectUser = Prisma.validator<Prisma.UserDefaultArgs>()({
	select: {
		id: true,
		createdAt: true,
		updatedAt: true,
		alias: true,
		firstName: true,
		lastName: true,
		uid: true,
		email: true,
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

export type PrismaUserResponse = Prisma.UserGetPayload<typeof prismaSelectUser>;
