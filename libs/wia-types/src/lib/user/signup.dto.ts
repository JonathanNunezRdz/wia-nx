import { ImageFormat } from '@prisma/client';
import {
	IsEmail,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
} from 'class-validator';

export class SignUpDto {
	@IsString()
	@IsNotEmpty()
	alias: string;

	@IsString()
	@IsNotEmpty()
	firstName: string;

	@IsString()
	@IsNotEmpty()
	lastName: string;

	@IsString()
	@IsNotEmpty()
	uid: string;

	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	password: string;

	@IsString()
	@IsNotEmpty()
	secret: string;

	@IsEnum(ImageFormat, {
		message: `imageFormat must be a valid option: ${Object.keys(
			ImageFormat
		).join(' | ')}`,
	})
	@IsOptional()
	imageFormat?: ImageFormat;
}
