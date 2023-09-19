import { Media, User } from '@prisma/client';
import { IsDateString, IsNotEmpty, IsUUID } from 'class-validator';

export class KnowMediaDto {
	@IsUUID(4)
	mediaId: Media['id'];

	@IsDateString()
	@IsNotEmpty()
	knownAt: string;
}

export interface KnowMediaService {
	userId: User['id'];
	knowDto: KnowMediaDto;
}
