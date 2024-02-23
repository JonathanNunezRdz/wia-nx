import { ImageFormat, MediaType, WaifuLevel } from '@prisma/client';
import { HttpError, JWTPayload, JWTStatus } from '@wia-nx/types';
import { AxiosError } from 'axios';
import { StorageError, StorageErrorCode } from 'firebase/storage';
import { stringify } from 'qs';
import { ImageFormats, MediaTypes, WaifuLevelLabels } from './constants';

export function getJWTFromLocalStorage() {
	if (typeof process.env.NEXT_PUBLIC_JWT_LOCAL_STORAGE_KEY === 'undefined') {
		throw new Error('env not set');
	}
	return localStorage.getItem(process.env.NEXT_PUBLIC_JWT_LOCAL_STORAGE_KEY);
}

export function invalidateJWT() {
	if (typeof process.env.NEXT_PUBLIC_JWT_LOCAL_STORAGE_KEY === 'undefined') {
		throw new Error('env not set');
	}
	localStorage.removeItem(process.env.NEXT_PUBLIC_JWT_LOCAL_STORAGE_KEY);
}

export function validateJWT(): JWTStatus {
	const jwt = getJWTFromLocalStorage();

	if (jwt !== null) {
		const payloadString = Buffer.from(
			jwt.split('.')[1],
			'base64'
		).toString();
		const { exp } = JSON.parse(payloadString) as JWTPayload;

		if (exp * 1000 > Date.now())
			return {
				jwt,
				valid: true,
			};

		invalidateJWT();
		return { valid: false };
	}
	invalidateJWT();
	return { valid: false };
}

export function setJWT(jwt: string) {
	if (typeof process.env.NEXT_PUBLIC_JWT_LOCAL_STORAGE_KEY === 'undefined') {
		throw new Error('env not set');
	}
	localStorage.setItem(process.env.NEXT_PUBLIC_JWT_LOCAL_STORAGE_KEY, jwt);
}

export function formatDate(dateString?: string) {
	const date = dateString ? new Date(dateString) : new Date();

	const month =
		date.getMonth() + 1 < 10
			? `0${date.getMonth() + 1}`
			: `${date.getMonth() + 1}`;

	const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
	const parsed = `${date.getFullYear()}-${month}-${day}`;

	return parsed;
}

export function prepareDate(dateString: string) {
	return new Date(`${dateString}T00:00:00`).toISOString();
}

export function parseMediaId(mediaId: string | string[] | undefined) {
	if (typeof mediaId === 'object' || typeof mediaId === 'undefined')
		return '';
	return mediaId;
}

export function parseMediaType(mediaType: string | string[] | undefined) {
	if (
		typeof mediaType === 'object' ||
		typeof mediaType === 'undefined' ||
		!isValidMediaType(mediaType)
	)
		return false;
	return mediaType;
}

export function parseWaifuId(waifuId: string | string[] | undefined) {
	if (typeof waifuId === 'object' || typeof waifuId === 'undefined')
		return '';
	return waifuId;
}

export function loadImage(images: FileList | null) {
	return new Promise<{ result: string; format: ImageFormat; image: File }>(
		(resolve, reject) => {
			if (images && images[0]) {
				const reader = new FileReader();
				reader.onload = (event) => {
					if (event.target) {
						const format = images[0].type.split('/').pop();
						if (typeof format === 'undefined') return;
						if (isValidImageFormat(format)) {
							resolve({
								result: event.target.result as string,
								format,
								image: images[0],
							});
						}
					}
				};
				reader.readAsDataURL(images[0]);
			} else reject('not a valid format');
		}
	);
}

export function isValidImageFormat(format: string): format is ImageFormat {
	return ImageFormats.includes(format);
}

export function isValidMediaType(mediaType: string): mediaType is MediaType {
	return MediaTypes.includes(mediaType);
}

export function isValidWaifuLevel(level: string): level is WaifuLevel {
	return Object.keys(WaifuLevelLabels).includes(level);
}

export function getAxiosError(error: unknown) {
	if (error instanceof AxiosError) {
		const { response } = error as AxiosError<HttpError>;
		if (typeof response === 'undefined') throw error;
		return response.data;
	}
	throw error;
}

export const formatImageFileName = (
	name: string,
	format: ImageFormat | string | undefined
) => {
	if (typeof format === 'undefined' || !isValidImageFormat(format))
		throw new Error('not a valid format');
	return `${encodeURIComponent(name)}.${format}`;
};

// PENDING: Unfinished error checking for getting download url of firebase images
export function checkImageError(error: unknown) {
	if (error instanceof StorageError) {
		switch (error.code) {
			case `storage/${StorageErrorCode.OBJECT_NOT_FOUND}`:
				return '';
			case `storage/${StorageErrorCode.UNAUTHORIZED}`:
				return '';
		}
	}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function customParamsSerializer(params: Record<string, any>) {
	return stringify(params, {
		encode: false,
		arrayFormat: 'comma',
	});
}
