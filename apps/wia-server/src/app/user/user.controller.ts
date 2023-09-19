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
import { EditUserDto, GetAllUsersResponse } from '@wia-nx/types';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(private userService: UserService) {}

	// get routes

	@Get('test-rename')
	copyFiles() {
		// return this.userService.renameImagesToIds();
		return false;
	}

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

	@Patch('migrate')
	migrate() {
		return this.userService.migrate();
		// return false;
	}

	// delete routes

	// @Get('checkup')
	// checkup() {
	// 	return this.userService.checkup();
	// }

	// // @Get('waifu_firebase')
	// waifuFirebase() {
	// 	return this.userService.waifuFirebase();
	// }

	// // @Get('media_firebase')
	// mediaFirebase() {
	// 	return this.userService.mediaFirebase();
	// }
}
