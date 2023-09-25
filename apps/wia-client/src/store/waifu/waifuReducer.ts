import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { GetAllWaifusDto } from '@wia-nx/types';
import { RootState } from '..';

type WaifuState = GetAllWaifusDto;

const initialState: WaifuState = {
	limit: 9,
	page: 1,
	level: [],
	name: '',
	users: [],
};

export const waifu = createSlice({
	name: 'waifu',
	initialState,
	reducers: {
		resetWaifuReducer: () => {
			return initialState;
		},
		changePage: (state, action: PayloadAction<GetAllWaifusDto>) => {
			state = {
				...action.payload,
			};
		},
	},
});

export const { resetWaifuReducer, changePage: changeWaifuPage } = waifu.actions;
export default waifu.reducer;
export const selectWaifuPage = (state: RootState) => state.waifu;
