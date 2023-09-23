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
		}),
	}),
});

export const {
	useSignInMutation,
	util: { resetApiState: resetAuthApi },
} = authApi;