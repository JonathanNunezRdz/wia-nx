import { User, Waifu } from '@prisma/client';

export interface DeleteWaifuDto {
	userId: User['id'];
	waifuId: Waifu['id'];
}
