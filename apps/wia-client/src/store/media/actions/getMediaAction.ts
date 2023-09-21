import { createAsyncThunk } from '@reduxjs/toolkit';
import { GetMediaDto, GetMediaResponse, HttpError } from '@wia-nx/types';

import { getAxiosError } from '@wia-client/src/utils';
import mediaService from '../service';

export const getMediasAction = createAsyncThunk<
	GetMediaResponse,
	GetMediaDto,
	{ rejectValue: HttpError }
>('media/getMedias', async (dto, { rejectWithValue }) => {
	try {
		const { data } = await mediaService.getMedias(dto);
		return data;
	} catch (error) {
		const errorData = getAxiosError(error);
		return rejectWithValue(errorData);
	}
});
