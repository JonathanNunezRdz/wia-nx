import { createAsyncThunk } from '@reduxjs/toolkit';
import {
	CreateMediaResponse,
	CreateMediaThunk,
	HttpError,
} from '@wia-nx/types';

import { getAxiosError } from '@wia-client/src/utils';
import mediaService from '../service';

export const addMediaAction = createAsyncThunk<
	CreateMediaResponse,
	CreateMediaThunk,
	{ rejectValue: HttpError }
>('media/addMedia', async (dto, { rejectWithValue }) => {
	try {
		const { data } = await mediaService.addMedia(dto);
		return data;
	} catch (error) {
		const data = getAxiosError(error);
		return rejectWithValue(data);
	}
});
