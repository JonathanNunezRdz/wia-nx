import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { TradeState } from '@wia-nx/types';
import type { RootState } from '..';
import { tradeApi } from './tradeApi';

const initialState: TradeState = {
	get: {
		appliedFilters: {
			page: 1,
			limit: 9,
		},
	},
};

export const tradeSlice = createSlice({
	name: 'trade',
	initialState,
	reducers: {
		changePage: (state, action: PayloadAction<number>) => {
			state.get.appliedFilters.page = action.payload;
		},
	},
	extraReducers(builder) {
		builder.addMatcher(
			tradeApi.endpoints.getTrades.matchFulfilled,
			(state, action) => {
				state.get.appliedFilters = action.meta.arg.originalArgs;
			}
		);
	},
});

export const tradeReducer = tradeSlice.reducer;

export const { changePage: changeTradePage } = tradeSlice.actions;

export const selectTradeFilter = (state: RootState) =>
	state.trade.get.appliedFilters;
