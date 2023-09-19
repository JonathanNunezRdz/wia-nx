import { ImageFormat, User } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class EditUserDto {
	@IsString()
	@IsOptional()
	alias?: User['alias'];

	@IsString()
	@IsOptional()
	firstName?: User['firstName'];

	@IsString()
	@IsOptional()
	lastName?: User['lastName'];

	@IsString()
	@IsOptional()
	password?: string;

	@IsEnum(ImageFormat, {
		message: `imageFormat must be a valid option: ${Object.keys(
			ImageFormat
		).join(' | ')}`,
	})
	@IsOptional()
	imageFormat?: ImageFormat;
}

export interface EditUserService {
	userId: User['id'];
	userDto: EditUserDto;
	imageFile?: Express.Multer.File;
}
