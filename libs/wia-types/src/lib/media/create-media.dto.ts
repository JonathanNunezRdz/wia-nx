import { ImageFormat, Media, MediaType, User } from '@prisma/client';
import {
	IsDateString,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
} from 'class-validator';

export class CreateMediaDto {
	@IsString()
	@IsNotEmpty()
	title: Media['title'];

	@IsEnum(MediaType, {
		message: `type must be a valid option: ${Object.keys(MediaType).join(
			' | '
		)}`,
	})
	@IsNotEmpty()
	type: Media['type'];

	@IsDateString()
	@IsNotEmpty()
	knownAt: string;

	@IsEnum(ImageFormat, {
		message: `format must be a valid option: ${Object.keys(
			ImageFormat
		).join(' | ')}`,
	})
	@IsOptional()
	imageFormat?: ImageFormat;
}

export interface CreateMediaService {
	userId: User['id'];
	mediaDto: CreateMediaDto;
	imageFile?: Express.Multer.File;
}

export interface CreateMediaThunk {
	mediaDto: CreateMediaDto;
	imageFile?: File;
}
