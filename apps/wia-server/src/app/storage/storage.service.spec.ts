import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { StorageService } from './storage.service';

describe('StorageService', () => {
	let service: StorageService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [StorageService, ConfigService],
		}).compile();

		service = module.get<StorageService>(StorageService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should print env set', () => {
		const path = service.getFirebaseImageString('Naruto', 'anime', 'jpg');
		expect(path).toContain('test');
	});
});
