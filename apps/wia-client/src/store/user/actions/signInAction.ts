import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAxiosError } from '@wia-client/src/utils';
import { HttpError, SignInDto, SignInResponse } from '@wia-nx/types';
import userService from '../service';

// post actions

export const signInAction = createAsyncThunk<
	SignInResponse,
	SignInDto,
	{ rejectValue: HttpError }
>('user/signIn', async ({ email, password }, { rejectWithValue }) => {
	try {
		const { data } = await userService.signIn(email, password);
		return data;
	} catch (error) {
		const errorData = getAxiosError(error);
		return rejectWithValue(errorData);
	}
});
