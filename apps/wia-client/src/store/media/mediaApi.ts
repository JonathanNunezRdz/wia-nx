import {
	CreateMediaResponse,
	CreateMediaThunk,
	EditMediaResponse,
	EditMediaThunk,
	GetEditMediaResponse,
	GetMediaDto,
	GetMediaResponse,
	GetMediaTitlesResponse,
	GetMediaWaifusResponse,
	GetMediaWaifusService,
	KnowMediaDto,
	KnowMediaResponse,
} from '@wia-nx/types';
import { baseApi } from '../api';

export const mediaApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getMedia: builder.query<GetMediaResponse, GetMediaDto>({
			query(body) {
				return {
					url: 'media',
					method: 'GET',
					params: body,
				};
			},
			providesTags: ['Media'],
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
					url: 'media',
					method: 'POST',
					body: formData,
				};
			},
			invalidatesTags: ['Media', 'MediaTitles'],
		}),
		editMedia: builder.mutation<EditMediaResponse, EditMediaThunk>({
			query(body) {
				const { editDto, imageFile } = body;
				const formData = new FormData();
				for (const [key, value] of Object.keys(editDto)) {
					formData.append(key, value);
				}
				if (imageFile) formData.append('file', imageFile);
				return {
					url: 'media',
					method: 'PATCH',
					body: formData,
				};
			},
			invalidatesTags: ['Media', 'MediaTitles', 'EditMedia'],
		}),
		deleteMedia: builder.mutation<void, { mediaId: string }>({
			query(body) {
				return {
					url: `media/${body.mediaId}`,
					method: 'DELETE',
				};
			},
			invalidatesTags: [
				'Media',
				'MediaTitles',
				'Waifu',
				'WaifuNames',
				'MediaWaifus',
			],
		}),
		getMediaTitles: builder.query<GetMediaTitlesResponse, void>({
			query() {
				return {
					url: 'media/titles',
					method: 'GET',
				};
			},
			providesTags: ['MediaTitles'],
		}),
		getMediaToEdit: builder.query<GetEditMediaResponse, string>({
			query(body) {
				return {
					url: `media/edit/${body}`,
					method: 'GET',
				};
			},
			providesTags: (result) => {
				if (result) return [{ type: 'EditMedia', id: result.id }];
				return ['EditMedia'];
			},
		}),
		getMediaWaifus: builder.query<
			GetMediaWaifusResponse,
			GetMediaWaifusService
		>({
			query(body) {
				return {
					url: `media/waifu/${body.id}`,
					method: 'GET',
					params: body,
				};
			},
			providesTags: ['MediaWaifus'],
		}),
		knowMedia: builder.mutation<KnowMediaResponse, KnowMediaDto>({
			query(body) {
				return {
					url: 'media/know',
					method: 'PATCH',
					body,
				};
			},
			invalidatesTags: ['Media'],
		}),
	}),
});

export const { resetApiState: resetMediaApi } = mediaApi.util;
export const {
	useAddMediaMutation,
	useDeleteMediaMutation,
	useEditMediaMutation,
	useGetMediaQuery,
	useGetMediaTitlesQuery,
	useGetMediaToEditQuery,
	useGetMediaWaifusQuery,
	useKnowMediaMutation,
} = mediaApi;
