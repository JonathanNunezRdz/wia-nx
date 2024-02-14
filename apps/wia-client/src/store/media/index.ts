import { Media, User } from '@prisma/client';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { mediaLabel } from '@wia-client/src/utils/constants';
import {
	GetEditMediaResponse,
	GetMediaWaifusResponse,
	MediaState,
} from '@wia-nx/types';
import { RootState } from '..';
import {
	addMediaAction,
	deleteMediaAction,
	editMediaAction,
	getMediaTitlesAction,
	getMediaToEditFromServerAction,
	getMediaWaifusAction,
	getMediasAction,
	knowMediaAction,
} from './actions';

const initialState: MediaState = {
	get: {
		data: [],
		totalMedias: 0,
		status: 'idle',
		error: undefined,
		appliedFilters: {
			page: 1,
			limit: 9,
			title: '',
			type: [],
			users: [],
		},
	},
	add: {
		status: 'idle',
		error: undefined,
	},
	know: {
		status: 'idle',
		error: undefined,
	},
	edit: {
		data: {} as GetEditMediaResponse,
		status: 'idle',
		error: undefined,
		local: {
			status: 'idle',
			error: undefined,
		},
		server: {
			status: 'idle',
			error: undefined,
		},
	},
	delete: {
		error: undefined,
		status: 'idle',
		mediaId: '',
	},
	titles: {
		data: [],
		status: 'idle',
		error: undefined,
	},
	mediaWaifus: {
		id: '',
		data: {} as GetMediaWaifusResponse,
		status: 'idle',
		error: undefined,
	},
};

export const mediaSlice = createSlice({
	name: 'media',
	initialState,
	reducers: {
		resetGetMediaToEdit: (state) => {
			state.edit.data = {} as GetEditMediaResponse;
			state.edit.status = 'idle';
			state.edit.error = undefined;
			state.edit.local.status = 'idle';
			state.edit.local.error = undefined;
			state.edit.server.status = 'idle';
			state.edit.server.error = undefined;
		},
		resetAddMediaStatus: (state) => {
			state.add.status = 'idle';
			state.add.error = undefined;
		},
		getMediaToEditFromLocal: (
			state,
			action: PayloadAction<{ mediaId: Media['id']; userId: User['id'] }>
		) => {
			const { mediaId, userId } = action.payload;
			const index = state.get.data.findIndex(
				(elem) => elem.id === mediaId
			);

			if (
				mediaId === '-1' ||
				state.get.data.length === 0 ||
				index === -1
			) {
				state.edit.local.status = 'failed';
				state.edit.local.error = {
					message: 'mediaId not found in local data',
					error: '',
					statusCode: 418,
				};
			} else {
				const media = state.get.data[index];
				const userIndex = media.knownBy.findIndex(
					(user) => user.userId === userId
				);

				if (userIndex === -1) {
					state.edit.local.status = 'failed';
					state.edit.local.error = {
						message: `you haven't ${
							mediaLabel.past[media.type]
						} this media`,
						error: '',
						statusCode: 403,
					};
				} else {
					state.edit.data.id = media.id;
					state.edit.data.title = media.title;
					state.edit.data.type = media.type;
					state.edit.data.knownAt = new Date(
						media.knownBy[userIndex].knownAt
					);
					state.edit.data.image = media.image;
					state.edit.local.status = 'succeeded';
					state.edit.local.error = undefined;
				}
			}
		},
		resetMediaTitles: (state) => {
			state.titles.data = [];
			state.titles.status = 'idle';
			state.titles.error = undefined;
		},
		resetMediaWaifus: (state) => {
			state.mediaWaifus.id = '';
			state.mediaWaifus.data = {} as GetMediaWaifusResponse;
			state.mediaWaifus.error = undefined;
			state.mediaWaifus.status = 'idle';
		},
	},
	extraReducers(builder) {
		builder
			.addCase(getMediasAction.pending, (state) => {
				state.get.error = undefined;
				state.get.status = 'loading';
			})
			.addCase(getMediasAction.fulfilled, (state, action) => {
				state.get.data = action.payload.medias;
				state.get.totalMedias = action.payload.totalMedias;
				state.get.appliedFilters = action.meta.arg;
				state.get.error = undefined;
				state.get.status = 'succeeded';
			})
			.addCase(getMediasAction.rejected, (state, action) => {
				state.get.error = action.payload;
				state.get.status = 'failed';
			})
			.addCase(addMediaAction.pending, (state) => {
				state.add.status = 'loading';
			})
			.addCase(addMediaAction.fulfilled, (state, action) => {
				state.get.data = [action.payload, ...state.get.data];
				state.add.error = undefined;
				state.add.status = 'succeeded';
			})
			.addCase(addMediaAction.rejected, (state, action) => {
				state.add.error = action.payload;
				state.add.status = 'failed';
			})
			.addCase(knowMediaAction.pending, (state) => {
				state.know.error = undefined;
				state.know.status = 'loading';
			})
			.addCase(knowMediaAction.fulfilled, (state, action) => {
				const index = state.get.data.findIndex(
					(media) => media.id === action.payload.id
				);
				if (index > -1) {
					state.get.data[index] = action.payload;
				}
				state.know.error = undefined;
				state.know.status = 'succeeded';
			})
			.addCase(knowMediaAction.rejected, (state, action) => {
				state.know.error = action.payload;
				state.know.status = 'failed';
			})
			.addCase(getMediaToEditFromServerAction.pending, (state) => {
				state.edit.server.error = undefined;
				state.edit.server.status = 'loading';
			})
			.addCase(
				getMediaToEditFromServerAction.fulfilled,
				(state, action) => {
					state.edit.data = action.payload;
					state.edit.server.error = undefined;
					state.edit.server.status = 'succeeded';
				}
			)
			.addCase(
				getMediaToEditFromServerAction.rejected,
				(state, action) => {
					state.edit.server.error = action.payload;
					state.edit.server.status = 'failed';
				}
			)
			.addCase(editMediaAction.pending, (state) => {
				state.edit.error = undefined;
				state.edit.status = 'loading';
			})
			.addCase(editMediaAction.fulfilled, (state, action) => {
				const index = state.get.data.findIndex(
					(media) => media.id === action.payload.id
				);
				if (index > -1) {
					state.get.data[index] = action.payload;
				}

				state.edit.error = undefined;
				state.edit.status = 'succeeded';
			})
			.addCase(editMediaAction.rejected, (state, action) => {
				state.edit.error = action.payload;
				state.edit.status = 'failed';
			})
			.addCase(getMediaTitlesAction.pending, (state) => {
				state.titles.error = undefined;
				state.titles.status = 'loading';
			})
			.addCase(getMediaTitlesAction.fulfilled, (state, action) => {
				state.titles.data = action.payload;
				state.titles.status = 'succeeded';
				state.titles.error = undefined;
			})
			.addCase(getMediaTitlesAction.rejected, (state, action) => {
				state.titles.error = action.payload;
				state.titles.status = 'failed';
			})
			.addCase(getMediaWaifusAction.pending, (state, action) => {
				state.mediaWaifus.status = 'loading';
				state.mediaWaifus.id = action.meta.arg.id;
				state.mediaWaifus.error = undefined;
			})
			.addCase(getMediaWaifusAction.fulfilled, (state, action) => {
				state.mediaWaifus.data = action.payload;
				state.mediaWaifus.error = undefined;
				state.mediaWaifus.status = 'succeeded';
			})
			.addCase(getMediaWaifusAction.rejected, (state, action) => {
				state.mediaWaifus.error = action.payload;
				state.mediaWaifus.status = 'failed';
			})
			.addCase(deleteMediaAction.pending, (state, action) => {
				state.delete.status = 'loading';
				state.delete.mediaId = action.meta.arg.mediaId;
			})
			.addCase(deleteMediaAction.fulfilled, (state) => {
				state.delete.error = undefined;
				state.delete.status = 'succeeded';
			})
			.addCase(deleteMediaAction.rejected, (state, action) => {
				state.delete.error = action.payload;
				state.delete.status = 'failed';
			});
	},
});

const mediaReducer = mediaSlice.reducer;

export const {
	resetAddMediaStatus,
	getMediaToEditFromLocal,
	resetGetMediaToEdit,
	resetMediaTitles,
	resetMediaWaifus,
} = mediaSlice.actions;

export const selectMedia = (state: RootState) => state.media.get;
export const selectAddMedia = (state: RootState) => state.media.add;
export const selectKnowMedia = (state: RootState) => state.media.know;
export const selectEditMedia = (state: RootState) => state.media.edit;
export const selectDeleteMedia = (state: RootState) => state.media.delete;
export const selectMediaTitles = (state: RootState) => state.media.titles;
export const selectMediaWaifus = (state: RootState) => state.media.mediaWaifus;

export default mediaReducer;
