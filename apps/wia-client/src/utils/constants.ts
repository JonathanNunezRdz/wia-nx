import { useColorModeValue } from '@chakra-ui/react';
import { MediaType, WaifuLevel } from '@prisma/client';
import { MediaLabel } from '@wia-nx/types';

export const mediaLabel: MediaLabel = {
	present: {
		anime: 'watch',
		manga: 'read',
		videogame: 'play',
	},
	past: {
		anime: 'watched',
		manga: 'read',
		videogame: 'played',
	},
};

export const WaifuLevelLabels: Record<WaifuLevel, string> = {
	nationalTreasure: 'national treasure',
	freeAgent: 'free agent',
	genin: 'genin',
	chunin: 'chunin',
	jonin: 'jonin',
	topWaifu: 'top waifu',
};

export const MediaTypes = ['anime', 'manga', 'videogame'];

export const useCardColor = () => useColorModeValue('teal.100', 'teal.500');

export const ImageFormats: string[] = [
	'apng',
	'avif',
	'gif',
	'jpg',
	'jpeg',
	'jfif',
	'pjpeg',
	'pjp',
	'png',
	'svg',
	'webp',
];

export type MediaTypeBoolean = Record<MediaType, boolean>;

export type WaifuLevelBoolean = Record<WaifuLevel, boolean>;

export type UserId = '1' | '2' | '3' | '4';

export type UserIdBoolean = Record<UserId, boolean>;

export type WaifuFilterInputs = WaifuLevelBoolean & {
	name: string;
};

export type MediaFilterInputs = MediaTypeBoolean & {
	title: string;
};
