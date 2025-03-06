import type { User } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePasswordDto {
	@IsString()
	@IsNotEmpty()
	currentPassword: string;

	@IsString()
	@IsNotEmpty()
	newPassword: string;

	@IsString()
	@IsNotEmpty()
	confirmPassword: string;
}

export type UpdatePasswordService = {
	userId: User['id'];
} & UpdatePasswordDto;
