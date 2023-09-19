import { PartialType } from '@nestjs/mapped-types';
import { Media, User } from '@prisma/client';
import { IsUUID } from 'class-validator';

import { CreateMediaDto } from './create-media.dto';

export class EditMediaDto extends PartialType(CreateMediaDto) {
	@IsUUID(4)
	mediaId: Media['id'];
}

export interface EditMediaService {
	userId: User['id'];
	editDto: EditMediaDto;
	imageFile?: Express.Multer.File;
}

export interface GetEditMediaService {
	userId: User['id'];
	mediaId: Media['id'];
}

export interface EditMediaThunk {
	editDto: EditMediaDto;
	imageFile?: File;
}
