import { Media, Waifu } from '@prisma/client';

import { MediaKnownUser } from '.';
import { MyImage } from '../common';
import { WaifuResponse } from '../waifu';

export type EditMediaResponse = MediaResponse;

export type GetEditMediaResponse = RawMedia & {
	knownAt: Date;
	image?: MyImage;
};

export type CreateMediaResponse = MediaResponse;

export type GetMediaResponse = {
	medias: MediaResponse[];
	totalMedias: number;
};

export type MediaResponse = Media & {
	waifus: Pick<Waifu, 'id' | 'name'>[];
	knownBy: MediaKnownUser[];
	image?: MyImage;
};

export type RawMedia = Omit<Media, 'createdAt' | 'updatedAt'>;

export type GetMediaTitlesResponse = {
	id: Media['id'];
	title: Media['title'];
}[];

export type KnowMediaResponse = MediaResponse;

export type GetMediaWaifusResponse = {
	media: Omit<MediaResponse, 'waifus'> & {
		waifus: Omit<WaifuResponse, 'media'>[];
	};
};
