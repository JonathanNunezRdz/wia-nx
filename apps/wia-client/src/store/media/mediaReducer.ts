import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { GetMediaDto } from '@wia-nx/types';
import { RootState } from '..';

type MediaState = GetMediaDto;

const initialState: MediaState = {
	page: 1,
	limit: 9,
	title: '',
	type: [],
	users: [],
};

const media = createSlice({
	name: 'media',
	initialState,
	reducers: {
		resetAnalysisReducer: () => {
			return initialState;
		},
		changePage: (state, action: PayloadAction<GetMediaDto>) => {
			const { page, limit, type, users, title } = action.payload;
			state.page = page;
			state.limit = limit;
			state.type = type;
			state.users = users;
			state.title = title;
		},
	},
});

export const { changePage, resetAnalysisReducer } = media.actions;
export default media.reducer;
export const selectMediaPage = (state: RootState) => state.media;
