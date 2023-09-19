import { Test, TestingModule } from '@nestjs/testing';
import { WaifuController } from './waifu.controller';
import { WaifuService } from './waifu.service';

describe('WaifuController', () => {
	let controller: WaifuController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [WaifuController],
			providers: [WaifuService],
		}).compile();

		controller = module.get<WaifuController>(WaifuController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
