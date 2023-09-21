import { User, Waifu } from '@prisma/client';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { GetEditWaifuResponse, WaifuState } from '@wia-nx/types';

import { RootState } from '..';
import {
	addWaifuAction,
	deleteWaifuAction,
	editWaifuAction,
	getAllWaifusAction,
	getWaifuToEditFromServerAction,
} from './actions';

const initialState: WaifuState = {
	get: {
		data: [],
		totalWaifus: 0,
		status: 'idle',
		error: undefined,
		appliedFilters: {
			page: 1,
			limit: 9,
			name: '',
			level: [],
			users: [],
		},
	},
	add: {
		status: 'idle',
		error: undefined,
	},
	edit: {
		data: {} as GetEditWaifuResponse,
		server: {
			status: 'idle',
			error: undefined,
		},
		local: {
			status: 'idle',
			error: undefined,
		},
		status: 'idle',
		error: undefined,
	},
	delete: {
		status: 'idle',
		error: undefined,
		waifuId: '',
	},
};

export const waifuSlice = createSlice({
	name: 'waifu',
	initialState,
	reducers: {
		resetAddWaifuStatus: (state) => {
			state.add.status = 'idle';
			state.add.error = undefined;
		},
		resetGetWaifuToEdit: (state) => {
			state.edit.data = {} as GetEditWaifuResponse;
			state.edit.local.status = 'idle';
			state.edit.local.error = undefined;
			state.edit.server.status = 'idle';
			state.edit.server.error = undefined;
		},
		getWaifuToEditFromLocal: (
			state,
			action: PayloadAction<{ waifuId: Waifu['id']; userId: User['id'] }>
		) => {
			const { waifuId, userId } = action.payload;
			const index = state.get.data.findIndex(
				(elem) => elem.id === waifuId
			);

			if (
				waifuId === '-1' ||
				state.get.data.length === 0 ||
				index === -1
			) {
				state.edit.local.status = 'failed';
				state.edit.local.error = {
					message: 'waifuId not found in local data',
					error: '',
					statusCode: 418,
				};
			} else {
				const waifu = state.get.data[index];
				const isOwn = waifu.user.id === userId;

				if (!isOwn) {
					state.edit.local.error = {
						message: `this waifu isn't yours`,
						error: '',
						statusCode: 403,
					};
				}
				state.edit.data = {
					id: waifu.id,
					level: waifu.level,
					mediaId: waifu.media.id,
					name: waifu.name,
					since: waifu.since,
					userId: waifu.user.id,
					image: waifu.image,
				};
				state.edit.local.error = undefined;
				state.edit.local.status = 'succeeded';
			}
		},
	},
	extraReducers(builder) {
		builder
			.addCase(getAllWaifusAction.pending, (state) => {
				state.get.error = undefined;
				state.get.status = 'loading';
			})
			.addCase(getAllWaifusAction.fulfilled, (state, action) => {
				state.get.data = action.payload.waifus;
				state.get.totalWaifus = action.payload.totalWaifus;
				state.get.appliedFilters = action.meta.arg;
				state.get.error = undefined;
				state.get.status = 'succeeded';
			})
			.addCase(getAllWaifusAction.rejected, (state, action) => {
				state.get.error = action.payload;
				state.get.status = 'failed';
			})
			.addCase(addWaifuAction.pending, (state) => {
				state.add.status = 'loading';
			})
			.addCase(addWaifuAction.fulfilled, (state, action) => {
				state.get.data.unshift(action.payload);
				state.add.error = undefined;
				state.add.status = 'succeeded';
			})
			.addCase(addWaifuAction.rejected, (state, action) => {
				state.add.error = action.payload;
				state.add.status = 'failed';
			})
			.addCase(getWaifuToEditFromServerAction.pending, (state) => {
				state.edit.server.error = undefined;
				state.edit.server.status = 'loading';
			})
			.addCase(
				getWaifuToEditFromServerAction.fulfilled,
				(state, action) => {
					state.edit.data = action.payload;
					state.edit.server.error = undefined;
					state.edit.server.status = 'succeeded';
				}
			)
			.addCase(
				getWaifuToEditFromServerAction.rejected,
				(state, action) => {
					state.edit.server.error = action.payload;
					state.edit.server.status = 'failed';
				}
			)
			.addCase(editWaifuAction.pending, (state) => {
				state.edit.error = undefined;
				state.edit.status = 'loading';
			})
			.addCase(editWaifuAction.fulfilled, (state, action) => {
				const index = state.get.data.findIndex(
					(waifu) => waifu.id === action.payload.id
				);
				if (index > -1) {
					state.get.data[index] = action.payload;
				}
				state.edit.error = undefined;
				state.edit.status = 'succeeded';
			})
			.addCase(editWaifuAction.rejected, (state, action) => {
				state.edit.error = action.payload;
				state.edit.status = 'failed';
			})
			.addCase(deleteWaifuAction.pending, (state, action) => {
				state.delete.status = 'loading';
				state.delete.waifuId = action.meta.arg.waifuId;
			})
			.addCase(deleteWaifuAction.fulfilled, (state) => {
				state.delete.error = undefined;
				state.delete.status = 'succeeded';
			})
			.addCase(deleteWaifuAction.rejected, (state, action) => {
				state.delete.error = action.payload;
				state.delete.status = 'failed';
			});
	},
});

const waifuReducer = waifuSlice.reducer;

export const {
	resetAddWaifuStatus,
	getWaifuToEditFromLocal,
	resetGetWaifuToEdit,
} = waifuSlice.actions;

export const selectWaifus = (state: RootState) => state.waifu.get;
export const selectAddWaifu = (state: RootState) => state.waifu.add;
export const selectEditWaifu = (state: RootState) => state.waifu.edit;
export const selectDeleteWaifu = (state: RootState) => state.waifu.delete;

export default waifuReducer;
