import { createAsyncThunk } from '@reduxjs/toolkit';
import { GetMediaWaifusDto, HttpError } from '@wia-nx/types';

import { Media } from '@prisma/client';
import { getAxiosError } from '@wia-client/src/utils';
import { RootState } from '../..';
import mediaService from '../service';
import { getMediasAction } from './getMediaAction';
import { getMediaWaifusAction } from './getMediaWaifusAction';

// delete actions

export const deleteMediaAction = createAsyncThunk<
	void,
	{ mediaId: Media['id']; from: '/media' | '/media/waifus' },
	{ rejectValue: HttpError; state: RootState }
>(
	'media/delete',
	async ({ mediaId, from }, { rejectWithValue, getState, dispatch }) => {
		try {
			await mediaService.deleteMedia(mediaId);
			const state = getState();
			if (from === '/media') {
				dispatch(getMediasAction(state.media.get.appliedFilters));
			} else {
				dispatch(
					getMediaWaifusAction({
						id: state.media.mediaWaifus.id,
						dto: {} as GetMediaWaifusDto,
					})
				);
			}
		} catch (error) {
			const data = getAxiosError(error);
			return rejectWithValue(data);
		}
	}
);
