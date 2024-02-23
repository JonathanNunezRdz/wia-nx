import { Injectable } from '@nestjs/common';
import {
	CreateTradeService,
	GetTradesDto,
	GetTradesResponse,
	TradeResponse,
	getTradesInput,
} from '@wia-nx/types';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class TradeService {
	constructor(
		private prisma: PrismaService,
		private storage: StorageService
	) {}

	async getTrades(dto: GetTradesDto): Promise<GetTradesResponse> {
		// get transformed input for prisma find many trades
		const input = getTradesInput(dto);
		const totalTrades = await this.prisma.trade.count();
		// get all trades using the transformed input
		const rawTrades = await this.prisma.trade.findMany(input);

		// transform the array into the same but with changed shape of image
		// e.g: sender.image.image.format -> sender.image.src | undefined
		// will transform the sender, recipient, and all waifus
		const trades = rawTrades.map<TradeResponse>((trade) => {
			let senderImage: TradeResponse['sender']['image'];
			if (trade.sender.image) {
				senderImage = {
					src: this.storage.getFirebaseImageString(
						trade.sender.uid,
						'user',
						trade.sender.image.image.format
					),
				};
			}
			const sender: TradeResponse['sender'] = {
				...trade.sender,
				image: senderImage,
			};

			let recipientImage: TradeResponse['recipient']['image'];
			if (trade.recipient.image) {
				recipientImage = {
					src: this.storage.getFirebaseImageString(
						trade.recipient.uid,
						'user',
						trade.recipient.image.image.format
					),
				};
			}
			const recipient: TradeResponse['recipient'] = {
				...trade.recipient,
				image: recipientImage,
			};

			const offeredWaifus = trade.offeredWaifus.map<
				TradeResponse['offeredWaifus'][0]
			>((offeredWaifu) => {
				let image: TradeResponse['offeredWaifus'][0]['image'];
				if (offeredWaifu.image) {
					image = {
						src: this.storage.getFirebaseImageString(
							offeredWaifu.name,
							'waifu',
							offeredWaifu.image.image.format
						),
					};
				}
				return {
					...offeredWaifu,
					image,
				};
			});
			const wantedWaifus = trade.wantedWaifus.map<
				TradeResponse['wantedWaifus'][0]
			>((wantedWaifu) => {
				let image: TradeResponse['wantedWaifus'][0]['image'];
				if (wantedWaifu.image) {
					image = {
						src: this.storage.getFirebaseImageString(
							wantedWaifu.name,
							'waifu',
							wantedWaifu.image.image.format
						),
					};
				}
				return {
					...wantedWaifu,
					image,
				};
			});
			return {
				...trade,
				sender,
				recipient,
				offeredWaifus,
				wantedWaifus,
			};
		});

		return {
			totalTrades,
			trades,
		};
	}

	// NEXT TODO: write postTrade
	async createTrade(dto: CreateTradeService) {
		await this.prisma.trade.create({
			data: {
				senderId: dto.senderId,
				recipientId: dto.tradeDto.recipientId,
				offeredWaifus: {
					connect: dto.tradeDto.offeredWaifus.map((waifuId) => ({
						id: waifuId,
					})),
				},
				wantedWaifus: {
					connect: dto.tradeDto.wantedWaifus.map((waifuId) => ({
						id: waifuId,
					})),
				},
			},
		});
		// first give the offered waifus to recipient
		await this.prisma.waifu.updateMany({
			where: {
				id: {
					in: dto.tradeDto.offeredWaifus,
				},
			},
			data: {
				userId: dto.tradeDto.recipientId,
			},
		});
		// then received the wanted waifus to sender
		await this.prisma.waifu.updateMany({
			where: {
				id: {
					in: dto.tradeDto.wantedWaifus,
				},
			},
			data: {
				userId: dto.senderId,
			},
		});
	}
}
