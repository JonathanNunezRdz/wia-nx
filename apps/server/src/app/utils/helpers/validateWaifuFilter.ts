import moment from 'moment';
import { Error } from '../types/commonTypes';
import { ValidWaifuLevels, WaifuFilter } from '../types/waifuTypes';

const validateWaifuFilter = (waifuFilter: WaifuFilter): Error[] | false => {
	const errors: Error[] = [];
	if (waifuFilter.limit === 0)
		errors.push({ field: 'limit', message: 'Limit field should not be 0' });

	if (
		typeof waifuFilter.cursor === 'string' &&
		!moment(waifuFilter.cursor).isValid()
	)
		errors.push({
			field: 'cursor',
			message: 'Cursor field should be of format ISO8601',
		});

	if (typeof waifuFilter.name === 'string' && waifuFilter.name === '')
		errors.push({
			field: 'name',
			message: 'Name field should not be emtpy',
		});

	if (typeof waifuFilter.level !== 'undefined') {
		const valid = waifuFilter.level.reduce(
			(prev, current) => prev && ValidWaifuLevels.includes(current),
			true
		);
		if (!valid)
			errors.push({
				field: 'level',
				message: `Level field should be valid -> ${ValidWaifuLevels.join(
					'|'
				)}`,
			});
	}

	return errors.length > 0 ? errors : false;
};

export default validateWaifuFilter;
