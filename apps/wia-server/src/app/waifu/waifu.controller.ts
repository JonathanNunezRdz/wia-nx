import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	Query,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User, Waifu } from '@prisma/client';
import {
	CreateWaifuDto,
	CreateWaifuResponse,
	EditWaifuDto,
	EditWaifuResponse,
	GetAllWaifusDto,
	GetAllWaifusResponse,
	GetEditWaifuResponse,
} from '@wia-nx/types';

import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { WaifuService } from './waifu.service';

@Controller('waifu')
export class WaifuController {
	constructor(private waifuService: WaifuService) {}

	// get routes

	@Get('')
	getAllWaifus(@Query() dto: GetAllWaifusDto): Promise<GetAllWaifusResponse> {
		return this.waifuService.getAllWaifus(dto);
	}

	@UseGuards(JwtGuard)
	@Get('edit/:id')
	getEditWaifu(
		@GetUser('id') userId: User['id'],
		@Param('id') waifuId: Waifu['id']
	): Promise<GetEditWaifuResponse> {
		return this.waifuService.getEditWaifu({ userId, waifuId });
	}

	// post routes

	@UseGuards(JwtGuard)
	@Post('')
	@UseInterceptors(FileInterceptor('file'))
	createWaifu(
		@GetUser('id') userId: User['id'],
		@Body() waifuDto: CreateWaifuDto,
		@UploadedFile() imageFile: Express.Multer.File
	): Promise<CreateWaifuResponse> {
		return this.waifuService.createWaifu({ userId, waifuDto, imageFile });
	}

	// patch routes

	@UseGuards(JwtGuard)
	@Patch('')
	@UseInterceptors(FileInterceptor('file'))
	editWaifu(
		@GetUser('id') userId: User['id'],
		@Body() waifuDto: EditWaifuDto,
		@UploadedFile() imageFile: Express.Multer.File
	): Promise<EditWaifuResponse> {
		return this.waifuService.editWaifu({ userId, waifuDto, imageFile });
	}

	// delete routes

	@UseGuards(JwtGuard)
	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete(':id')
	deleteWaifu(
		@GetUser('id') userId: User['id'],
		@Param('id') waifuId: Waifu['id']
	) {
		return this.waifuService.deleteWaifu({ userId, waifuId });
	}
}
