import type { User } from '@prisma/client';
import { createSlice } from '@reduxjs/toolkit';
import { invalidateJWT, setJWT, validateJWT } from '@wia-client/src/utils';
import { UserState } from '@wia-nx/types';

import { RootState } from '..';
import api from '../api';
import { getAllUsersAction, getUserAction, signInAction } from './actions';

const initialState: UserState = {
	user: {
		data: {} as UserState['user']['data'],
		status: 'idle',
		error: undefined,
	},
	auth: {
		isLoggedIn: false,
		checkedJWT: false,
	},
	signIn: {
		status: 'idle',
		error: undefined,
	},
	signOut: {
		status: 'idle',
		error: undefined,
	},
	members: {
		data: [],
		status: 'idle',
		error: undefined,
	},
};

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		getLoggedStatus: (state) => {
			const status = validateJWT();
			if (status.valid) {
				api.defaults.headers.common[
					'Authorization'
				] = `Bearer ${status.jwt}`;

				state.signIn.status = 'succeeded';
				state.auth.isLoggedIn = true;
			} else {
				api.defaults.headers.common['Authorization'] = '';

				state.signIn.status = 'idle';
				state.auth.isLoggedIn = false;
			}
			state.auth.checkedJWT = true;
		},
		signOut: (state) => {
			invalidateJWT();
			api.defaults.headers.common['Authorization'] = '';

			state.user.data = {} as UserState['user']['data'];
			state.user.status = 'idle';
			state.user.error = undefined;
			state.auth.isLoggedIn = false;
			state.signIn.status = 'idle';
			state.signIn.error = undefined;
			state.signOut.status = 'succeeded';
			state.signOut.error = undefined;
			state.members.data = [];
			state.members.status = 'idle';
			state.members.error = undefined;
		},
		resetSignInStatus: (state) => {
			state.signIn.status = 'idle';
			state.signIn.error = undefined;
		},
	},
	extraReducers(builder) {
		builder
			.addCase(signInAction.pending, (state) => {
				state.signIn.status = 'loading';
			})
			.addCase(signInAction.fulfilled, (state, action) => {
				setJWT(action.payload.accessToken);
				api.defaults.headers.common[
					'Authorization'
				] = `Bearer ${action.payload.accessToken}`;
				state.signIn.status = 'succeeded';
				state.signIn.error = undefined;
				state.auth.isLoggedIn = true;
			})
			.addCase(signInAction.rejected, (state, action) => {
				invalidateJWT();
				state.signIn.status = 'failed';
				state.signIn.error = action.payload;
				state.user.data = {} as User;
			})
			.addCase(getUserAction.pending, (state) => {
				state.user.status = 'loading';
			})
			.addCase(getUserAction.fulfilled, (state, action) => {
				state.user = {
					data: action.payload,
					status: 'succeeded',
					error: undefined,
				};
			})
			.addCase(getUserAction.rejected, (state, action) => {
				state.user.data = {} as User;
				state.user.status = 'failed';
				state.user.error = action.payload;
				if (
					action.payload?.statusCode === 412 ||
					action.payload?.statusCode === 400
				) {
					invalidateJWT();
					state.auth.checkedJWT = true;
					state.auth.isLoggedIn = false;
				}
			})
			.addCase(getAllUsersAction.pending, (state) => {
				state.members.status = 'loading';
			})
			.addCase(getAllUsersAction.fulfilled, (state, action) => {
				state.members.data = action.payload;
				state.members.status = 'succeeded';
				state.members.error = undefined;
			})
			.addCase(getAllUsersAction.rejected, (state, action) => {
				state.members.status = 'failed';
				state.members.error = action.payload;
			});
	},
});

const userReducer = userSlice.reducer;

export const { signOut, getLoggedStatus, resetSignInStatus } =
	userSlice.actions;

export const selectUser = (state: RootState) => state.user.user;
export const selectAuth = (state: RootState) => state.user.auth;
export const selectSignIn = (state: RootState) => state.user.signIn;
export const selectSignOut = (state: RootState) => state.user.signOut;
export const selectAllUsers = (state: RootState) => state.user.members;

export default userReducer;
