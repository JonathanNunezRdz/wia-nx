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
					url: '/waifu',
					params: body,
				};
			},
			providesTags: [{ type: 'Waifu', id: 'LIST' }],
		}),
		getEditWaifu: builder.query<GetEditWaifuResponse, string>({
			query(waifuId) {
				return {
					url: `/waifu/edit/${waifuId}`,
				};
			},
			providesTags: [{ type: 'Waifu', id: 'EDIT' }],
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
					body: formData,
					method: 'POST',
				};
			},
			invalidatesTags: [
				{ type: 'Waifu', id: 'LIST' },
				{ type: 'Media', id: 'WAIFUS' },
			],
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
					url: '/waifu',
					body: formData,
					method: 'PATCH',
				};
			},
			invalidatesTags: [
				{ type: 'Waifu', id: 'LIST' },
				{ type: 'Media', id: 'WAIFUS' },
			],
		}),
		deleteWaifu: builder.mutation<void, string>({
			query(waifuId) {
				return {
					url: `/waifu/${waifuId}`,
					method: 'DELETE',
				};
			},
			invalidatesTags: [
				{ type: 'Waifu', id: 'LIST' },
				{ type: 'Media', id: 'WAIFUS' },
			],
		}),
	}),
});

export const { resetApiState: resetWaifuApi } = waifuApi.util;
export const {
	useGetAllWaifusQuery,
	useEditWaifuMutation,
	useAddWaifuMutation,
	useDeleteWaifuMutation,
	useGetEditWaifuQuery,
} = waifuApi;
