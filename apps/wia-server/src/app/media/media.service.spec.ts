import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { MediaService } from './media.service';

describe('MediaService', () => {
	let service: MediaService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				MediaService,
				PrismaService,
				StorageService,
				ConfigService,
			],
		}).compile();

		service = module.get<MediaService>(MediaService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
