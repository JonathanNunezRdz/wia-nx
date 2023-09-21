import { Media } from '.prisma/client';
import {
	CreateMediaResponse,
	CreateMediaThunk,
	EditMediaResponse,
	EditMediaThunk,
	GetEditMediaResponse,
	GetMediaDto,
	GetMediaResponse,
	GetMediaTitlesResponse,
	GetMediaWaifusDto,
	GetMediaWaifusResponse,
	KnowMediaDto,
	KnowMediaResponse,
} from '@wia-nx/types';
import { stringify } from 'qs';
import api from '../api';

// get servies

function getMedias(dto: GetMediaDto) {
	return api.get<GetMediaResponse>('/media', {
		params: dto,
		paramsSerializer(params) {
			return stringify(params, {
				encode: false,
				arrayFormat: 'comma',
			});
		},
	});
}

function getMediaTitles() {
	return api.get<GetMediaTitlesResponse>('/media/titles');
}

function getEditMedia(mediaId: Media['id']) {
	return api.get<GetEditMediaResponse>(`/media/edit/${mediaId}`);
}

// post services

function addMedia(dto: CreateMediaThunk) {
	const { mediaDto, imageFile } = dto;

	const formData = new FormData();
	for (const [key, value] of Object.entries(mediaDto)) {
		formData.append(key, value);
	}

	if (imageFile) formData.append('file', imageFile);

	return api.post<CreateMediaResponse>('/media', formData);
}

// patch services

function knownMedia(dto: KnowMediaDto) {
	return api.patch<KnowMediaResponse>('/media/know', dto);
}

function editMedia(dto: EditMediaThunk) {
	const { editDto, imageFile } = dto;

	const formData = new FormData();
	for (const [key, value] of Object.keys(editDto)) {
		formData.append(key, value);
	}

	if (imageFile) formData.append('file', imageFile);

	return api.patch<EditMediaResponse>('/media', formData);
}

// delete services

function deleteMedia(mediaId: number | string) {
	return api.delete<void>(`/media/${mediaId}`);
}

function getMediaWaifus(title: string, dto: GetMediaWaifusDto) {
	return api.get<GetMediaWaifusResponse>(`/media/waifu/${title}`, {
		params: dto,
		paramsSerializer(params) {
			return stringify(params, {
				encode: false,
				arrayFormat: 'comma',
			});
		},
	});
}

const mediaService = {
	getMediaWaifus,
	getMedias,
	addMedia,
	knownMedia,
	getEditMedia,
	editMedia,
	getMediaTitles,
	deleteMedia,
};

export default mediaService;
