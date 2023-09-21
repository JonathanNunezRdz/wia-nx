import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit';
import mediaReducer from './media';
import userReducer from './user';
import waifuReducer from './waifu';

export const store = configureStore({
	reducer: {
		media: mediaReducer,
		waifu: waifuReducer,
		user: userReducer,
	},
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	Action<string>
>;
