import { Module } from '@nestjs/common';
import { WaifuService } from './waifu.service';
import { WaifuController } from './waifu.controller';

@Module({
	controllers: [WaifuController],
	providers: [WaifuService],
})
export class WaifuModule {}
