import { Waifu } from '@prisma/client';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAxiosError } from '@wia-client/src/utils';
import { GetMediaWaifusDto, HttpError } from '@wia-nx/types';
import { RootState } from '../..';
import { getMediaWaifusAction } from '../../media/actions';
import waifuService from '../service';
import { getAllWaifusAction } from './getAllWaifusAction';

export const deleteWaifuAction = createAsyncThunk<
	void,
	{ waifuId: Waifu['id']; from: '/waifus' | '/media/waifus' },
	{ rejectValue: HttpError; state: RootState }
>(
	'waifu/delete',
	async ({ waifuId, from }, { rejectWithValue, getState, dispatch }) => {
		try {
			await waifuService.deleteWaifu(waifuId);
			const state = getState();
			if (from === '/waifus') {
				dispatch(getAllWaifusAction(state.waifu.get.appliedFilters));
			} else {
				dispatch(
					getMediaWaifusAction({
						id: state.media.mediaWaifus.id,
						dto: {} as GetMediaWaifusDto,
					})
				);
			}
		} catch (error) {
			const errorData = getAxiosError(error);
			return rejectWithValue(errorData);
		}
	}
);
