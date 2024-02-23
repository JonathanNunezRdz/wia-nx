import { createSlice } from '@reduxjs/toolkit';
import { TradeState } from '@wia-nx/types';
import { RootState } from '..';
import { addTradeAction, getTradesAction } from './actions';

const initialState: TradeState = {
	get: {
		data: [],
		totalTrades: 0,
		appliedFilters: {
			page: 1,
			limit: 9,
		},
		status: 'idle',
		error: undefined,
	},
	add: {
		error: undefined,
		status: 'idle',
	},
};

export const tradeSlice = createSlice({
	name: 'trade',
	initialState,
	reducers: {},
	extraReducers(builder) {
		builder
			.addCase(getTradesAction.pending, (state) => {
				state.get.status = 'loading';
				state.get.error = undefined;
			})
			.addCase(getTradesAction.fulfilled, (state, action) => {
				state.get.status = 'succeeded';
				state.get.error = undefined;
				state.get.data = action.payload.trades;
				state.get.totalTrades = action.payload.totalTrades;
				state.get.appliedFilters = action.meta.arg;
			})
			.addCase(getTradesAction.rejected, (state, action) => {
				state.get.status = 'failed';
				state.get.error = action.payload;
				state.get.data = [];
				state.get.totalTrades = 0;
			})
			.addCase(addTradeAction.pending, (state) => {
				state.add.status = 'loading';
				state.add.error = undefined;
			})
			.addCase(addTradeAction.fulfilled, (state, action) => {
				state.add.status = 'succeeded';
				state.add.error = undefined;
			})
			.addCase(addTradeAction.rejected, (state, action) => {
				state.add.status = 'failed';
				state.add.error = action.payload;
			});
	},
});

// export const {} = tradeSlice.actions;

export const selectTrades = (state: RootState) => state.trade.get;
export const selectAddTrade = (state: RootState) => state.trade.add;

const tradeReducer = tradeSlice.reducer;
export default tradeReducer;
