import {
	GetAllUsersResponse,
	GetUserResponse,
	type EditUserResponse,
	type EditUserThunk,
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
		editUser: builder.mutation<EditUserResponse, EditUserThunk>({
			query(body) {
				const { dto, imageFile } = body;
				const formData = new FormData();
				for (const [key, value] of Object.entries(dto)) {
					formData.append(key, value);
				}
				if (imageFile) {
					formData.append('file', imageFile);
				}
				return {
					url: '/user',
					body: formData,
					method: 'PATCH',
				};
			},
			invalidatesTags: [{ type: 'Members' }, { type: 'User' }],
		}),
	}),
});

export const { resetApiState: resetUserApi } = userApi.util;
export const {
	useGetMeQuery,
	useGetMembersQuery,
	useUpdatePasswordMutation,
	useEditUserMutation,
} = userApi;
