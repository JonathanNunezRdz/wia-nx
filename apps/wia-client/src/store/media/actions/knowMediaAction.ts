import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAxiosError } from '@wia-client/src/utils';
import { HttpError, KnowMediaDto, KnowMediaResponse } from '@wia-nx/types';

import mediaService from '../service';

// patch actions

export const knowMediaAction = createAsyncThunk<
	KnowMediaResponse,
	KnowMediaDto,
	{ rejectValue: HttpError }
>('media/knowMedia', async (dto, { rejectWithValue }) => {
	try {
		const { data } = await mediaService.knownMedia(dto);
		return data;
	} catch (error) {
		const errorData = getAxiosError(error);
		return rejectWithValue(errorData);
	}
});
