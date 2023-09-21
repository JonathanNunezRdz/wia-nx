import {
	GetAllUsersResponse,
	GetUserResponse,
	SignInResponse,
} from '@wia-nx/types';

import api from '../api';

// get services

function getUser() {
	return api.get<GetUserResponse>('/user/me');
}

function getAllUsers() {
	return api.get<GetAllUsersResponse>('/user/all');
}

// post services

function signIn(email: string, password: string) {
	return api.post<SignInResponse>('/auth/signin', { email, password });
}

// patch services

// delete services

const userService = {
	signIn,
	getUser,
	getAllUsers,
};

export default userService;
