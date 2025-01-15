import {
	CreateTradeDto,
	CreateTradeResponse,
	GetTradesDto,
	GetTradesResponse,
} from '@wia-nx/types';
import { baseApi } from '../api';

export const tradeApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getTrades: builder.query<GetTradesResponse, GetTradesDto>({
			query(params) {
				return {
					url: '/trade',
					params,
				};
			},
			providesTags: [{ type: 'Trade', id: 'list' }],
		}),
		addTrade: builder.mutation<CreateTradeResponse, CreateTradeDto>({
			query(body) {
				return {
					url: '/trade',
					body,
				};
			},
			invalidatesTags: ['Trade'],
		}),
	}),
	overrideExisting: true,
});

export const { useAddTradeMutation, useGetTradesQuery } = tradeApi;
