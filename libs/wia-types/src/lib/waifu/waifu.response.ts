import { Waifu } from '@prisma/client';
import { PrismaWaifuResponse } from '.';
import { MyImage } from '../common';

export type EditWaifuResponse = WaifuResponse;

export type GetEditWaifuResponse = RawWaifu & {
	image?: MyImage;
};

export type CreateWaifuResponse = WaifuResponse;

export type GetAllWaifusResponse = {
	waifus: WaifuResponse[];
	totalWaifus: number;
};

export type WaifuResponse = Omit<PrismaWaifuResponse, 'image'> & {
	image?: MyImage;
};

export type RawWaifu = Pick<
	Waifu,
	'id' | 'name' | 'level' | 'mediaId' | 'userId' | 'since'
>;
