import {
	GetAllUsersResponse,
	GetUserResponse,
	type UpdatePasswordDto,
} from '@wia-nx/types';
import { baseApi } from '../api';

export const userApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getMe: builder.query<GetUserResponse, void>({
			query() {
				return {
					url: '/user/me',
				};
			},
			providesTags: ['User'],
		}),
		getMembers: builder.query<GetAllUsersResponse, void>({
			query() {
				return {
					url: '/user/all',
				};
			},
			providesTags: ['Members'],
		}),
		updatePassword: builder.mutation<void, UpdatePasswordDto>({
			query(body) {
				return {
					url: '/user/update-password',
					method: 'PATCH',
					body,
				};
			},
		}),
	}),
});

export const { resetApiState: resetUserApi } = userApi.util;
export const { useGetMeQuery, useGetMembersQuery, useUpdatePasswordMutation } =
	userApi;
