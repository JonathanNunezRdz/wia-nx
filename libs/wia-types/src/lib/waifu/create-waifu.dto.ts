import { ImageFormat, Media, User, Waifu, WaifuLevel } from '@prisma/client';
import {
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUUID,
} from 'class-validator';

export class CreateWaifuDto {
	@IsString()
	@IsNotEmpty()
	name: Waifu['name'];

	@IsEnum(WaifuLevel, {
		message: `level must be a valid option: ${Object.keys(WaifuLevel).join(
			' | '
		)}`,
	})
	@IsNotEmpty()
	level: WaifuLevel;

	@IsUUID(4)
	mediaId: Media['id'];

	@IsEnum(ImageFormat, {
		message: `imageFormat must be a valid option: ${Object.keys(
			ImageFormat
		).join(' | ')}`,
	})
	@IsOptional()
	imageFormat?: ImageFormat;
}

export interface CreateWaifuService {
	userId: User['id'];
	waifuDto: CreateWaifuDto;
	imageFile?: Express.Multer.File;
}

export interface CreateWaifuThunk {
	waifuDto: CreateWaifuDto;
	imageFile?: File;
}
