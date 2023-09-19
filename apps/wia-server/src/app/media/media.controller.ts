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
import { Media, User } from '@prisma/client';
import {
	CreateMediaDto,
	CreateMediaResponse,
	EditMediaDto,
	EditMediaResponse,
	GetEditMediaResponse,
	GetMediaDto,
	GetMediaResponse,
	GetMediaTitlesResponse,
	GetMediaWaifusDto,
	GetMediaWaifusResponse,
	KnowMediaDto,
	KnowMediaResponse,
} from '@wia-nx/types';

import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
	constructor(private readonly mediaService: MediaService) {}

	// get routes

	@Get('')
	getMedias(@Query() dto: GetMediaDto): Promise<GetMediaResponse> {
		return this.mediaService.getMedias(dto);
	}

	@UseGuards(JwtGuard)
	@Get('titles')
	getMediaTitles(
		@GetUser('id') userId: User['id']
	): Promise<GetMediaTitlesResponse> {
		return this.mediaService.getMediaTitles(userId);
	}

	@UseGuards(JwtGuard)
	@Get('edit/:id')
	getEditMedia(
		@GetUser('id') userId: User['id'],
		@Param('id') mediaId: Media['id']
	): Promise<GetEditMediaResponse> {
		return this.mediaService.getEditMedia({ mediaId, userId });
	}

	@Get('waifu/:id')
	getMediaWaifus(
		@Param('id') id: Media['id'],
		@Query() waifuDto: GetMediaWaifusDto
	): Promise<GetMediaWaifusResponse> {
		return this.mediaService.getMediaWaifus({ id, waifuDto });
	}

	// post routes

	@UseGuards(JwtGuard)
	@Post('')
	@UseInterceptors(FileInterceptor('file'))
	createMedia(
		@GetUser('id') userId: User['id'],
		@Body() mediaDto: CreateMediaDto,
		@UploadedFile() imageFile: Express.Multer.File
	): Promise<CreateMediaResponse> {
		return this.mediaService.createMedia({ mediaDto, userId, imageFile });
	}

	// @Post('test_image')
	// @UseInterceptors(FileInterceptor('file'))
	// postImage(
	// 	@Body() dto: PostImageDto,
	// 	@UploadedFile() file: Express.Multer.File
	// ) {
	// 	return this.mediaService.postImage(file, dto.filename, dto.format);
	// }

	// patch routes

	@UseGuards(JwtGuard)
	@Patch('know')
	knowMedia(
		@GetUser('id') userId: User['id'],
		@Body() knowDto: KnowMediaDto
	): Promise<KnowMediaResponse> {
		return this.mediaService.knowMedia({ knowDto, userId });
	}

	@UseGuards(JwtGuard)
	@Patch('')
	@UseInterceptors(FileInterceptor('file'))
	editMedia(
		@GetUser('id') userId: User['id'],
		@Body() editDto: EditMediaDto,
		@UploadedFile() imageFile: Express.Multer.File
	): Promise<EditMediaResponse> {
		return this.mediaService.editMedia({ editDto, userId, imageFile });
	}

	// delete routes

	@UseGuards(JwtGuard)
	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete(':id')
	deleteMedia(
		@GetUser('id') userId: User['id'],
		@Param('id') mediaId: Media['id']
	) {
		return this.mediaService.deleteMedia({ userId, mediaId });
	}
}
