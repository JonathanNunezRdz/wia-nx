import { MediaFilter, MediaType, RawMediaFilter } from '../types/mediaTypes';

const parseMediaTypes = (
	types: string | undefined
): MediaType[] | undefined => {
	if (types) {
		if (types.includes(',')) return types.split(',') as MediaType[];
		return [types as MediaType];
	}
	return undefined;
};

const parseUserIds = (users: string | undefined): number[] | undefined => {
	if (users) return users.split(',').map((user) => parseInt(user));
	return undefined;
};

const parseMediaFilter = (query: RawMediaFilter): MediaFilter => {
	let limit = Math.min(parseInt(query.limit || '10'), 50);
	if (isNaN(limit)) limit = 10;
	return {
		cursor: query.cursor || new Date().toISOString(),
		limit,
		title: query.title,
		type: parseMediaTypes(query.type),
		users: parseUserIds(query.users),
	};
};

export default parseMediaFilter;
