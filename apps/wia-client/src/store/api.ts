import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { customParamsSerializer, validateJWT } from '../utils';

function getBaseUrl() {
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
	if (!baseUrl) {
		console.error(
			'NEXT_PUBLIC_BASE_URL not available in environment, setting default localhost'
		);
		return 'http://localhost:3333';
	}
	return baseUrl;
}

export const baseApi = createApi({
	baseQuery: fetchBaseQuery({
		baseUrl: `${getBaseUrl()}/api`,
		prepareHeaders: async (headers, api) => {
			const status = validateJWT();
			if (status.valid) {
				console.log('set token in headers');
				headers.set('Authorization', `Bearer ${status.jwt}`);
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
