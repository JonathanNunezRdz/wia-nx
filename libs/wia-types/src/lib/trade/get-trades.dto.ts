import { Transform } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class GetTradesDto {
	@Transform(({ value }) => parseInt(value, 10))
	@IsInt()
	@Min(1)
	page: number;

	@Transform(({ value }) => parseInt(value, 10))
	@IsInt()
	@Max(20)
	@Min(1)
	limit: number;
}
