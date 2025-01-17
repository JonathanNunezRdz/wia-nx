import { User, WaifuLevel } from '@prisma/client';
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

export class GetAllWaifusDto {
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
	name?: string;

	@Transform(({ value }) => value.split(','))
	@IsArray()
	@ArrayNotEmpty()
	@IsOptional()
	level?: WaifuLevel[];
}
