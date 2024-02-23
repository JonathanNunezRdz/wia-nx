import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAxiosError } from '@wia-client/src/utils';
import { CreateTradeDto, CreateTradeResponse, HttpError } from '@wia-nx/types';
import tradeService from '../service';

export const addTradeAction = createAsyncThunk<
	CreateTradeResponse,
	CreateTradeDto,
	{ rejectValue: HttpError }
>('trade/addTrade', async (dto, { rejectWithValue }) => {
	try {
		const { data } = await tradeService.addTrade(dto);
		return data;
	} catch (error) {
		const errorData = getAxiosError(error);
		return rejectWithValue(errorData);
	}
});
