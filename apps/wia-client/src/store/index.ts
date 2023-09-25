import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit';
import { baseApi } from './api';
import authReducer from './auth/authReducer';
import mediaReducer from './media/mediaReducer';
import waifuReducer from './waifu/waifuReducer';

export const store = configureStore({
	reducer: {
		auth: authReducer,
		media: mediaReducer,
		waifu: waifuReducer,
		[baseApi.reducerPath]: baseApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(baseApi.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	Action<string>
>;
