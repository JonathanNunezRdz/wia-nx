import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { stringify } from 'qs';
import { RootState } from '.';

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
			return stringify(params, {
				encode: false,
				arrayFormat: 'comma',
			});
		},
	}),
	tagTypes: [
		'User',
		'Media',
		'Auth',
		'Waifu',
		'Members',
		'MediaTitles',
		'WaifuNames',
		'EditMedia',
		'MediaWaifus',
	],
	endpoints: () => ({}),
});

export const { resetApiState: resetAllApis } = baseApi.util;
