import { Media, User, Waifu, WaifuLevel } from '@prisma/client';
import { Transform } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsOptional, IsString } from 'class-validator';

export class GetMediaWaifusDto {
	@IsString()
	@IsOptional()
	name?: Waifu['name'];

	@Transform(({ value }) => value.split(',').map(Number))
	@IsArray()
	@ArrayNotEmpty()
	@IsOptional()
	users?: User['id'][];

	@Transform(({ value }) => value.split(','))
	@IsArray()
	@ArrayNotEmpty()
	@IsOptional()
	level?: WaifuLevel[];
}

export interface GetMediaWaifusService {
	id: Media['id'];
	waifuDto: GetMediaWaifusDto;
}
