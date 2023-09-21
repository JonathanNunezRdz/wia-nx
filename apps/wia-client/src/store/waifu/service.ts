import { Waifu } from '@prisma/client';
import {
	CreateWaifuResponse,
	CreateWaifuThunk,
	EditWaifuResponse,
	EditWaifuThunk,
	GetAllWaifusDto,
	GetAllWaifusResponse,
	GetEditWaifuResponse,
} from '@wia-nx/types';
import { stringify } from 'qs';

import api from '../api';

// get services

function getAllWaifus(dto: GetAllWaifusDto) {
	return api.get<GetAllWaifusResponse>('/waifu', {
		params: dto,
		paramsSerializer(params) {
			return stringify(params, {
				encode: false,
				arrayFormat: 'comma',
			});
		},
	});
}

function getEditWaifu(waifuId: Waifu['id']) {
	return api.get<GetEditWaifuResponse>(`waifu/edit/${waifuId}`);
}

// post services

function addWaifu(dto: CreateWaifuThunk) {
	const { waifuDto, imageFile } = dto;

	const formData = new FormData();
	for (const [key, value] of Object.entries(waifuDto)) {
		formData.append(key, value);
	}
	if (imageFile) formData.append('file', imageFile);
	return api.post<CreateWaifuResponse>('/waifu', formData);
}

// patch services

function editWaifu(dto: EditWaifuThunk) {
	const { editDto, imageFile } = dto;

	const formData = new FormData();
	for (const [key, value] of Object.entries(editDto)) {
		formData.append(key, value);
	}
	if (imageFile) formData.append('file', imageFile);
	return api.patch<EditWaifuResponse>('/waifu', formData);
}

// delete services

function deleteWaifu(waifuId: Waifu['id']) {
	return api.delete<void>(`/waifu/${waifuId}`);
}

const waifuService = {
	editWaifu,
	getAllWaifus,
	addWaifu,
	getEditWaifu,
	deleteWaifu,
};

export default waifuService;
