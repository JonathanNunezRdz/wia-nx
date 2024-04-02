import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { WaifuState } from '@wia-nx/types';
import { RootState } from '..';
import { waifuApi } from './waifuApi';

const initialState: WaifuState = {
	get: {
		appliedFilters: {
			page: 1,
			limit: 9,
			name: '',
			level: [],
			users: [],
		},
	},
};

export const waifuSlice = createSlice({
	name: 'waifu',
	initialState,
	reducers: {
		changePage: (state, action: PayloadAction<number>) => {
			state.get.appliedFilters.page = action.payload;
		},
	},
	extraReducers(builder) {
		builder.addMatcher(
			waifuApi.endpoints.getAllWaifus.matchFulfilled,
			(state, action) => {
				state.get.appliedFilters = action.meta.arg.originalArgs;
			}
		);
	},
});

const waifuReducer = waifuSlice.reducer;
export const { changePage: changeWaifuPage } = waifuSlice.actions;
export const selectWaifuFilter = (state: RootState) =>
	state.waifu.get.appliedFilters;

export default waifuReducer;
