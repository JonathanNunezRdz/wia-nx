import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit';
import { baseApi } from './api';
import mediaReducer from './media/mediaReducer';
import { tradeReducer } from './trade/tradeReducer';
import waifuReducer from './waifu/waifuReducer';

export * from './auth';
export * from './hooks';
export * from './media';
export * from './user';
export * from './waifu';

export const store = configureStore({
	reducer: {
		media: mediaReducer,
		waifu: waifuReducer,
		trade: tradeReducer,
		[baseApi.reducerPath]: baseApi.reducer,
	},
	middleware: (getDefaultMiddleWare) =>
		getDefaultMiddleWare().concat(baseApi.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	Action<string>
>;
