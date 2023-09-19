import { ImageFormat } from '@prisma/client';
/**
 *
 * @param {string} id id of user | waifu | media
 * @param {ImageFormat} format format of image saved
 * @returns
 */
export const formatImageFileName = (id: string, format: ImageFormat) =>
	`${encodeURIComponent(id)}.${format}`;
