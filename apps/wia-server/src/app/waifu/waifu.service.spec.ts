import { Test, TestingModule } from '@nestjs/testing';
import { WaifuService } from './waifu.service';

describe('WaifuService', () => {
	let service: WaifuService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [WaifuService],
		}).compile();

		service = module.get<WaifuService>(WaifuService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
