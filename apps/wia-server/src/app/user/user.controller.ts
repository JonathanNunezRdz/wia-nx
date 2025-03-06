import {
	Body,
	Controller,
	Get,
	Patch,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '@prisma/client';
import {
	EditUserDto,
	GetAllUsersResponse,
	type UpdatePasswordDto,
} from '@wia-nx/types';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(private userService: UserService) {}

	// get routes
	@UseGuards(JwtGuard)
	@Get('me')
	getMe(@GetUser('id') userId: User['id']) {
		return this.userService.getMe(userId);
	}

	@Get('all')
	getAllUsers(): Promise<GetAllUsersResponse> {
		return this.userService.getAllUsers();
	}

	// post routes

	// patch routes

	@UseGuards(JwtGuard)
	@Patch()
	@UseInterceptors(FileInterceptor('file'))
	editUser(
		@GetUser('id') userId: User['id'],
		@Body() userDto: EditUserDto,
		@UploadedFile() imageFile: Express.Multer.File
	) {
		return this.userService.editUser({ userDto, userId, imageFile });
	}

	@UseGuards(JwtGuard)
	@Patch('update-password')
	updatePassword(
		@GetUser('id') userId: User['id'],
		@Body() dto: UpdatePasswordDto
	) {
		// return this.userService.migrate();
		return this.userService.updatePassword({ ...dto, userId });
	}
}
