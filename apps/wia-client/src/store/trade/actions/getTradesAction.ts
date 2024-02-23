import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAxiosError } from '@wia-client/src/utils';
import { GetTradesDto, GetTradesResponse, HttpError } from '@wia-nx/types';
import tradeService from '../service';

export const getTradesAction = createAsyncThunk<
	GetTradesResponse,
	GetTradesDto,
	{ rejectValue: HttpError }
>('trade/getTrades', async (dto, { rejectWithValue }) => {
	try {
		const { data } = await tradeService.getTrades(dto);
		return data;
	} catch (error) {
		const errorData = getAxiosError(error);
		return rejectWithValue(errorData);
	}
});
