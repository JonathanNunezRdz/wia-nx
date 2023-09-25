import { Waifu } from '@prisma/client';
import {
	CreateWaifuResponse,
	CreateWaifuThunk,
	EditWaifuResponse,
	EditWaifuThunk,
	GetAllWaifusDto,
	GetAllWaifusResponse,
	GetEditWaifuResponse,
} from '@wia-nx/types';
import { baseApi } from '../api';

export const waifuApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getAllWaifus: builder.query<GetAllWaifusResponse, GetAllWaifusDto>({
			query(body) {
				return {
					url: 'waifu',
					method: 'GET',
					params: body,
				};
			},
			providesTags: ['Waifu'],
		}),
		getEditWaifu: builder.query<GetEditWaifuResponse, Waifu['id']>({
			query(body) {
				return {
					url: `waifu/edit/${body}`,
				};
			},
			providesTags: ['EditWaifu'],
		}),
		addWaifu: builder.mutation<CreateWaifuResponse, CreateWaifuThunk>({
			query(body) {
				const { waifuDto, imageFile } = body;
				const formData = new FormData();
				for (const [key, value] of Object.entries(waifuDto)) {
					formData.append(key, value);
				}
				if (imageFile) formData.append('file', imageFile);
				return {
					url: 'waifu',
					method: 'POST',
					body: formData,
				};
			},
			invalidatesTags: ['Waifu', 'WaifuNames'],
		}),
		editWaifu: builder.mutation<EditWaifuResponse, EditWaifuThunk>({
			query(body) {
				const { editDto, imageFile } = body;
				const formData = new FormData();
				for (const [key, value] of Object.entries(editDto)) {
					formData.append(key, value);
				}
				if (imageFile) formData.append('file', imageFile);
				return {
					url: 'waifu',
					method: 'PATCH',
					body: formData,
				};
			},
			invalidatesTags: ['Waifu', 'WaifuNames'],
		}),
		deleteWaifu: builder.mutation<void, Waifu['id']>({
			query(body) {
				return {
					url: `/waifu/${body}`,
					method: 'DELETE',
				};
			},
			invalidatesTags: ['Waifu', 'WaifuNames'],
		}),
	}),
});

export const { resetApiState: resetWaifuApi } = waifuApi.util;
export const {
	useAddWaifuMutation,
	useDeleteWaifuMutation,
	useEditWaifuMutation,
	useGetAllWaifusQuery,
	useGetEditWaifuQuery,
} = waifuApi;
