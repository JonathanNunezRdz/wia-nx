import { User } from '@prisma/client';
import { IsOptional, IsUUID } from 'class-validator';

export class GetMediaTitlesDto {
	@IsUUID(4)
	@IsOptional()
	memberId?: User['id'];
}

export interface GetMediaTitlesService extends GetMediaTitlesDto {
	userId: User['id'];
}
