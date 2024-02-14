import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { WaifuController } from './waifu.controller';
import { WaifuService } from './waifu.service';

describe('WaifuController', () => {
	let controller: WaifuController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [WaifuController],
			providers: [
				WaifuService,
				PrismaService,
				StorageService,
				ConfigService,
			],
		}).compile();

		controller = module.get<WaifuController>(WaifuController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
