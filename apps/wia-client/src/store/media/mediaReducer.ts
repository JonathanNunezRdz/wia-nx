import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { MediaState, type GetMediaDto } from '@wia-nx/types';
import { RootState } from '..';
import { mediaApi } from './mediaApi';

const initialState: MediaState = {
	get: {
		appliedFilters: {
			page: 1,
			limit: 9,
			title: '',
			type: [],
			users: [],
		},
	},
};

export const mediaSlice = createSlice({
	name: 'media',
	initialState,
	reducers: {
		changePage: (state, action: PayloadAction<GetMediaDto>) => {
			state.get.appliedFilters = action.payload;
		},
	},
	extraReducers(builder) {
		builder.addMatcher(
			mediaApi.endpoints.getMedia.matchFulfilled,
			(state, action) => {
				state.get.appliedFilters = action.meta.arg.originalArgs;
			}
		);
	},
});

const mediaReducer = mediaSlice.reducer;

export const { changePage: changeMediaPage } = mediaSlice.actions;

export const selectMediaFilter = (state: RootState) =>
	state.media.get.appliedFilters;

export default mediaReducer;
