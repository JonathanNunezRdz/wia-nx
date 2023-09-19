import { Media, MediaType, User } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
	ArrayNotEmpty,
	IsArray,
	IsInt,
	IsOptional,
	IsString,
	Max,
	Min,
} from 'class-validator';

export class GetMediaDto {
	@Transform(({ value }) => parseInt(value, 10))
	@IsInt()
	@Min(1)
	page: number;

	@Transform(({ value }) => parseInt(value, 10))
	@IsInt()
	@Max(20)
	@Min(1)
	limit: number;

	@Transform(({ value }) => value.split(','))
	@IsArray()
	@ArrayNotEmpty()
	@IsOptional()
	users?: User['id'][];

	@IsString()
	@IsOptional()
	title?: Media['title'];

	@Transform(({ value }) => value.split(','))
	@IsArray()
	@ArrayNotEmpty()
	@IsOptional()
	type?: MediaType[];
}
