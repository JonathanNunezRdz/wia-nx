import {
	CreateTradeDto,
	CreateTradeResponse,
	GetTradesDto,
	GetTradesResponse,
} from '@wia-nx/types';
import { stringify } from 'qs';

import api from '../api';

function addTrade(dto: CreateTradeDto) {
	return api.post<CreateTradeResponse>('/trade', dto);
}

function getTrades(dto: GetTradesDto) {
	return api.get<GetTradesResponse>('/trade', {
		params: dto,
		paramsSerializer(params) {
			return stringify(params, {
				encode: false,
				arrayFormat: 'comma',
			});
		},
	});
}

const tradeService = {
	addTrade,
	getTrades,
};
export default tradeService;
