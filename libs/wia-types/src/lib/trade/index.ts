import { Prisma } from '@prisma/client';
import { RequestStatus } from '../common';
import { GetTradesDto } from './get-trades.dto';
import { TradeResponse } from './trade.response';

export * from './create-trade.dto';
export * from './get-trades.dto';
export * from './trade.response';

export interface TradeState {
	get: {
		data: TradeResponse[];
		totalTrades: number;
		appliedFilters: {
			page: number;
			limit: number;
		};
	} & RequestStatus;
	add: RequestStatus;
}

export const prismaSelectTrades = Prisma.validator<Prisma.TradeDefaultArgs>()({
	select: {
		id: true,
		createdAt: true,
		updatedAt: true,
		sender: {
			select: {
				id: true,
				uid: true,
				alias: true,
				image: {
					select: {
						image: {
							select: {
								format: true,
							},
						},
					},
				},
			},
		},
		recipient: {
			select: {
				id: true,
				uid: true,
				alias: true,
				image: {
					select: {
						image: {
							select: {
								format: true,
							},
						},
					},
				},
			},
		},
		offeredWaifus: {
			select: {
				image: {
					select: {
						image: {
							select: {
								format: true,
							},
						},
					},
				},
				id: true,
				name: true,
				media: {
					select: {
						title: true,
					},
				},
			},
		},
		wantedWaifus: {
			select: {
				image: {
					select: {
						image: {
							select: {
								format: true,
							},
						},
					},
				},
				id: true,
				name: true,
				media: {
					select: {
						title: true,
					},
				},
			},
		},
	},
});

export type PrismaTradeResponse = Prisma.TradeGetPayload<
	typeof prismaSelectTrades
>;

export const getTradesInput = (dto: GetTradesDto) =>
	Prisma.validator<Prisma.TradeFindManyArgs>()({
		take: dto.limit,
		skip: (dto.page - 1) * dto.limit,
		orderBy: {
			createdAt: 'desc',
		},
		select: prismaSelectTrades.select,
	});
