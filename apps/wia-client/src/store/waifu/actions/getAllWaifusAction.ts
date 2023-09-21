import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAxiosError } from '@wia-client/src/utils';
import {
	GetAllWaifusDto,
	GetAllWaifusResponse,
	HttpError,
} from '@wia-nx/types';
import waifuService from '../service';

export const getAllWaifusAction = createAsyncThunk<
	GetAllWaifusResponse,
	GetAllWaifusDto,
	{ rejectValue: HttpError }
>('waifu/getAllWaifus', async (dto, { rejectWithValue }) => {
	try {
		const { data } = await waifuService.getAllWaifus(dto);
		return data;
	} catch (error) {
		const errorData = getAxiosError(error);
		return rejectWithValue(errorData);
	}
});
