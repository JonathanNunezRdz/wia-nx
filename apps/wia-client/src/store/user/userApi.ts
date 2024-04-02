import { GetAllUsersResponse, GetUserResponse } from '@wia-nx/types';
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
	}),
});

export const { resetApiState: resetUserApi } = userApi.util;
export const { useGetMeQuery, useGetMembersQuery } = userApi;
