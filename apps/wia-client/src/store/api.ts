import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '.';
import { customParamsSerializer } from '../utils';

function getBaseUrl() {
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
	if (!baseUrl) {
		console.error(
			'NEXT_PUBLIC_BASE_URL not available in environment, setting default localhost'
		);
		return 'http://localhost:3333';
	}
	console.log(`using base url provided: ${baseUrl}`);
	return baseUrl;
}

export const baseApi = createApi({
	baseQuery: fetchBaseQuery({
		baseUrl: `${getBaseUrl()}/api`,
		prepareHeaders: (headers, { getState }) => {
			const token = (getState() as RootState).auth.token;
			if (token) {
				headers.set('Authorization', `Bearer ${token}`);
			}
			return headers;
		},
		paramsSerializer: (params) => {
			return customParamsSerializer(params);
		},
	}),
	tagTypes: ['User', 'Auth', 'Media', 'Members', 'Waifu', 'Trade'],
	endpoints: () => ({}),
});

export const { resetApiState: resetAllApis } = baseApi.util;
