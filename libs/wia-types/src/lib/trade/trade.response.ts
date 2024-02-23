import { PrismaTradeResponse } from '.';
import { MyImage } from '../common';

export type CreateTradeResponse = TradeResponse;

export type GetTradesResponse = {
	trades: TradeResponse[];
	totalTrades: number;
};

export type TradeResponse = Omit<
	PrismaTradeResponse,
	'sender' | 'recipient' | 'offeredWaifus' | 'wantedWaifus'
> & {
	sender: TradeMember;
	recipient: TradeMember;
	offeredWaifus: TradeWaifu[];
	wantedWaifus: TradeWaifu[];
};

export type TradeMember = Omit<PrismaTradeResponse['sender'], 'image'> & {
	image?: MyImage;
};

export type TradeWaifu = Omit<
	PrismaTradeResponse['offeredWaifus'][0],
	'image'
> & {
	image?: MyImage;
};
