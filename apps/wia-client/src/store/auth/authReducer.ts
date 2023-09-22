import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { invalidateJWT, setJWT, validateJWT } from '@wia-client/src/utils';
import { RootState } from '..';

type AuthState = {
	token: string | null;
	isLoggedIn: boolean;
	checkedToken: boolean;
};

const initialState: AuthState = {
	token: null,
	isLoggedIn: false,
	checkedToken: false,
};

const auth = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		getLoggedStatus: (state) => {
			const status = validateJWT();
			if (status.valid) {
				state.token = status.jwt;
				state.isLoggedIn = true;
			} else {
				state.token = null;
				state.isLoggedIn = false;
			}
			state.checkedToken = true;
		},
		setCredentials: (
			state,
			action: PayloadAction<{ accessToken: string }>
		) => {
			setJWT(action.payload.accessToken);
			state.token = action.payload.accessToken;
			state.isLoggedIn = true;
			state.checkedToken = true;
		},
		signOut: (state) => {
			invalidateJWT();
			state.token = null;
			state.isLoggedIn = false;
			state.checkedToken = true;
		},
	},
});

export const { getLoggedStatus, setCredentials, signOut } = auth.actions;
export default auth.reducer;
export const selectAuth = (state: RootState) => state.auth;
