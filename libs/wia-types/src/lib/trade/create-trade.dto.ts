import { User, Waifu } from '@prisma/client';
// import { Transform } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateTradeDto {
	@IsUUID()
	@IsNotEmpty()
	recipientId: User['id'];

	// @Transform(({ value }) => value.split(','))
	@IsArray()
	@ArrayNotEmpty()
	offeredWaifus: Waifu['id'][];

	// @Transform(({ value }) => value.split(','))
	@IsArray()
	@ArrayNotEmpty()
	wantedWaifus: Waifu['id'][];
}

export interface CreateTradeService {
	senderId: User['id'];
	tradeDto: CreateTradeDto;
}
