import { createAsyncThunk } from '@reduxjs/toolkit';
import { GetMediaTitlesResponse, HttpError } from '@wia-nx/types';

import { getAxiosError } from '@wia-client/src/utils';
import mediaService from '../service';

export const getMediaTitlesAction = createAsyncThunk<
	GetMediaTitlesResponse,
	void,
	{ rejectValue: HttpError }
>('media/getMediatitles', async (_, { rejectWithValue }) => {
	try {
		const { data } = await mediaService.getMediaTitles();
		return data;
	} catch (error) {
		const errorData = getAxiosError(error);
		return rejectWithValue(errorData);
	}
});
