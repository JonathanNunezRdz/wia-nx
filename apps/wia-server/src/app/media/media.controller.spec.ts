import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

describe('MediaController', () => {
	let controller: MediaController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [MediaController],
			providers: [
				MediaService,
				PrismaService,
				JwtService,
				ConfigService,
				StorageService,
			],
		}).compile();

		controller = module.get<MediaController>(MediaController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
