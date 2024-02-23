import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateTradeDto, GetTradesDto, GetTradesResponse } from '@wia-nx/types';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { TradeService } from './trade.service';

@Controller('trade')
export class TradeController {
	constructor(private readonly tradeService: TradeService) {}

	@Get('')
	getTrades(@Query() dto: GetTradesDto): Promise<GetTradesResponse> {
		return this.tradeService.getTrades(dto);
	}

	@UseGuards(JwtGuard)
	@Post('')
	createTrade(
		@GetUser('id') userId: User['id'],
		@Body() tradeDto: CreateTradeDto
	): Promise<void> {
		return this.tradeService.createTrade({ senderId: userId, tradeDto });
	}
}
