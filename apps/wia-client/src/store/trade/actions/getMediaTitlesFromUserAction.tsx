import { createAsyncThunk } from '@reduxjs/toolkit';
import {
	GetMediaTitlesDto,
	GetMediaTitlesResponse,
	HttpError,
} from '@wia-nx/types';
import mediaService from '../../media/service';
import { getAxiosError } from '@wia-client/src/utils';

export const getMediaTitlesFromUserAction = createAsyncThunk<
	GetMediaTitlesResponse,
	GetMediaTitlesDto,
	{ rejectValue: HttpError }
>('trade/getMediaTitlesFromUser', async (dto, { rejectWithValue }) => {
	try {
		const { data } = await mediaService.getMediaTitles(dto);
		return data;
	} catch (error) {
		const errorData = getAxiosError(error);
		return rejectWithValue(errorData);
	}
});
