import { Waifu } from '@prisma/client';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAxiosError } from '@wia-client/src/utils';
import { GetEditWaifuResponse, HttpError } from '@wia-nx/types';
import waifuService from '../service';

export const getWaifuToEditFromServerAction = createAsyncThunk<
	GetEditWaifuResponse,
	Waifu['id'],
	{ rejectValue: HttpError }
>('waifu/getEditWaifu', async (waifuId, { rejectWithValue }) => {
	try {
		const { data } = await waifuService.getEditWaifu(waifuId);
		return data;
	} catch (error) {
		const errorData = getAxiosError(error);
		return rejectWithValue(errorData);
	}
});
