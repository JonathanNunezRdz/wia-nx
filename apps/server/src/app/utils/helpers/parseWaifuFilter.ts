import { RawWaifuFilter, WaifuFilter, WaifuLevel } from '../types/waifuTypes';

const parseWaifuLevels = (
	level: string | undefined
): WaifuLevel[] | undefined => {
	if (level) {
		if (level.includes(',')) return level.split(',') as WaifuLevel[];
		return [level as WaifuLevel];
	}
	return undefined;
};

const parseWaifuFilter = (query: RawWaifuFilter): WaifuFilter => {
	let limit = Math.min(parseInt(query.limit || '10'), 50);
	if (isNaN(limit)) limit = 10;
	return {
		cursor: query.cursor || new Date().toISOString(),
		limit,
		name: query.name,
		level: parseWaifuLevels(query.level),
		user: query.user ? parseInt(query.user) : undefined,
	};
};

export default parseWaifuFilter;
