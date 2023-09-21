import { createAsyncThunk } from '@reduxjs/toolkit';
import { EditMediaResponse, EditMediaThunk, HttpError } from '@wia-nx/types';

import { getAxiosError } from '@wia-client/src/utils';
import mediaService from '../service';

export const editMediaAction = createAsyncThunk<
	EditMediaResponse,
	EditMediaThunk,
	{ rejectValue: HttpError }
>('media/editMedia', async (dto, { rejectWithValue }) => {
	try {
		const { data } = await mediaService.editMedia(dto);
		return data;
	} catch (error) {
		const errorData = getAxiosError(error);
		return rejectWithValue(errorData);
	}
});
