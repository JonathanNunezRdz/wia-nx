import {
	CreateMediaResponse,
	CreateMediaThunk,
	EditMediaResponse,
	EditMediaThunk,
	GetEditMediaResponse,
	GetMediaDto,
	GetMediaResponse,
	GetMediaTitlesDto,
	GetMediaTitlesResponse,
	GetMediaWaifusResponse,
	GetMediaWaifusThunk,
	KnowMediaDto,
	KnowMediaResponse,
} from '@wia-nx/types';
import { baseApi } from '../api';

export const mediaApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getMedia: builder.query<GetMediaResponse, GetMediaDto>({
			query(body) {
				return {
					url: '/media',
					params: body,
				};
			},
			providesTags: [{ type: 'Media', id: 'LIST' }],
		}),
		getMediaTitles: builder.query<
			GetMediaTitlesResponse,
			GetMediaTitlesDto
		>({
			query(body) {
				return {
					url: '/media/titles',
					params: body,
				};
			},
			providesTags: [{ type: 'Media', id: 'TITLES' }],
		}),
		getEditMedia: builder.query<GetEditMediaResponse, string>({
			query(mediaId) {
				return {
					url: `/media/edit/${mediaId}`,
				};
			},
			providesTags: [{ type: 'Media', id: 'EDIT' }],
		}),
		getMediaWaifus: builder.query<
			GetMediaWaifusResponse,
			GetMediaWaifusThunk
		>({
			query(body) {
				return {
					url: `/media/waifu/${body.id}`,
					params: body.waifuDto,
				};
			},
			providesTags: [{ type: 'Media', id: 'WAIFUS' }],
		}),
		addMedia: builder.mutation<CreateMediaResponse, CreateMediaThunk>({
			query(body) {
				const { mediaDto, imageFile } = body;
				const formData = new FormData();
				for (const [key, value] of Object.entries(mediaDto)) {
					formData.append(key, value);
				}
				if (imageFile) formData.append('file', imageFile);
				return {
					url: '/media',
					method: 'POST',
					body: formData,
				};
			},
			invalidatesTags: [
				{ type: 'Media', id: 'LIST' },
				{ type: 'Media', id: 'TITLES' },
			],
		}),
		knowMedia: builder.mutation<KnowMediaResponse, KnowMediaDto>({
			query(body) {
				return {
					url: '/media/know',
					method: 'PATCH',
					body,
				};
			},
			invalidatesTags: [
				{ type: 'Media', id: 'LIST' },
				{ type: 'Media', id: 'TITLES' },
			],
		}),
		editMedia: builder.mutation<EditMediaResponse, EditMediaThunk>({
			query(body) {
				const { editDto, imageFile } = body;
				const formData = new FormData();
				for (const [key, value] of Object.entries(editDto)) {
					formData.append(key, value);
				}
				if (imageFile) formData.append('file', imageFile);
				return {
					url: '/media',
					method: 'PATCH',
					body: formData,
				};
			},
			invalidatesTags: [
				{ type: 'Media', id: 'LIST' },
				{ type: 'Media', id: 'TITLES' },
			],
		}),
		deleteMedia: builder.mutation<void, number | string>({
			query(mediaId) {
				return {
					url: `/media/${mediaId}`,
					method: 'DELETE',
				};
			},
			invalidatesTags: ['Media'],
		}),
	}),
});

export const { resetApiState: resetMediaApi } = mediaApi.util;
export const {
	useGetMediaQuery,
	useGetMediaTitlesQuery,
	useAddMediaMutation,
	useDeleteMediaMutation,
	useEditMediaMutation,
	useGetEditMediaQuery,
	useGetMediaWaifusQuery,
	useKnowMediaMutation,
} = mediaApi;
