import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { WaifuService } from './waifu.service';

describe('WaifuService', () => {
	let service: WaifuService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				WaifuService,
				PrismaService,
				StorageService,
				ConfigService,
			],
		}).compile();

		service = module.get<WaifuService>(WaifuService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
