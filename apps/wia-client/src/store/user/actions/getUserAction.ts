import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAxiosError } from '@wia-client/src/utils';
import { GetUserResponse, HttpError } from '@wia-nx/types';
import userService from '../service';

// get actions

export const getUserAction = createAsyncThunk<
	GetUserResponse,
	void,
	{ rejectValue: HttpError }
>('user/getUser', async (_, { rejectWithValue }) => {
	try {
		const { data } = await userService.getUser();
		return data;
	} catch (error) {
		const errorData = getAxiosError(error);
		return rejectWithValue(errorData);
	}
});
