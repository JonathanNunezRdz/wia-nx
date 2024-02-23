import { Media } from '.prisma/client';
import { customParamsSerializer } from '@wia-client/src/utils';
import {
	CreateMediaResponse,
	CreateMediaThunk,
	EditMediaResponse,
	EditMediaThunk,
	GetEditMediaResponse,
	GetMediaDto,
	GetMediaResponse,
	GetMediaTitlesDto,
	GetMediaTitlesResponse,
	GetMediaWaifusDto,
	GetMediaWaifusResponse,
	KnowMediaDto,
	KnowMediaResponse,
} from '@wia-nx/types';
import api from '../api';

// get servies

function getMedias(dto: GetMediaDto) {
	return api.get<GetMediaResponse>('/media', {
		params: dto,
		paramsSerializer(params) {
			return customParamsSerializer(params);
		},
	});
}

function getMediaTitles(dto: GetMediaTitlesDto) {
	return api.get<GetMediaTitlesResponse>('/media/titles', {
		params: dto,
		paramsSerializer(params) {
			return customParamsSerializer(params);
		},
	});
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
	for (const [key, value] of Object.entries(editDto)) {
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
			return customParamsSerializer(params);
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
