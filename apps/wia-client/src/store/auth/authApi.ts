import { invalidateJWT, setJWT, validateJWT } from '@wia-client/src/utils';
import { SignInDto, SignInResponse } from '@wia-nx/types';
import { baseApi } from '../api';

export const authApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		signIn: builder.mutation<SignInResponse, SignInDto>({
			query(body) {
				return {
					url: 'auth/signin',
					body,
					method: 'POST',
				};
			},
			invalidatesTags: [{ type: 'Auth', id: 'LOGGED_STATUS' }],
		}),
		signOut: builder.mutation<boolean, void>({
			queryFn() {
				try {
					invalidateJWT();
					return {
						data: true,
					};
				} catch (error) {
					return {
						error: {
							error: 'localStorage key not set',
							originalStatus: 418,
							status: 'FETCH_ERROR',
						},
					};
				}
			},
			invalidatesTags: [{ type: 'Auth', id: 'LOGGED_STATUS' }],
		}),
		getLoggedStatus: builder.query<{ token: string }, void>({
			queryFn() {
				console.log('checking logged status');
				const status = validateJWT();
				if (status.valid) {
					console.log('logged in');
					return {
						data: {
							token: status.jwt,
						},
					};
				}
				console.log('not logged in');
				return {
					error: {
						error: 'Not logged in',
						originalStatus: 401,
						status: 'CUSTOM_ERROR',
					},
				};
			},
			providesTags: [{ type: 'Auth', id: 'LOGGED_STATUS' }],
		}),
		setJwt: builder.mutation<boolean, { token: string }>({
			queryFn(data) {
				try {
					setJWT(data.token);
					return {
						data: true,
					};
				} catch (error) {
					return {
						error: {
							error: 'localStorage key not set',
							originalStatus: 418,
							status: 'FETCH_ERROR',
						},
					};
				}
			},
			invalidatesTags: [{ type: 'Auth', id: 'LOGGED_STATUS' }],
		}),
	}),
	overrideExisting: true,
});

export const { resetApiState: resetAuthApi } = authApi.util;
export const {
	useSignInMutation,
	useGetLoggedStatusQuery,
	useSignOutMutation,
	useSetJwtMutation,
} = authApi;
