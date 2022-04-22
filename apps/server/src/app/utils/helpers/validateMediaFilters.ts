import moment from 'moment';
import { Error } from '../types/commonTypes';
import { MediaFilter, ValidMediaTypes } from '../types/mediaTypes';

const validateMediaFilters = (mediaFilter: MediaFilter): Error[] | false => {
	const errors: Error[] = [];
	if (typeof mediaFilter.limit === 'number' && mediaFilter.limit === 0)
		errors.push({ field: 'limit', message: 'Limit field should not be 0' });

	if (
		typeof mediaFilter.cursor === 'string' &&
		!moment(mediaFilter.cursor).isValid()
	)
		errors.push({
			field: 'cursor',
			message: 'Cursor field should be of format ISO8601',
		});

	if (typeof mediaFilter.title === 'string' && mediaFilter.title === '')
		errors.push({
			field: 'title',
			message: 'Title field should not be empty',
		});

	if (typeof mediaFilter.type !== 'undefined') {
		const valid = mediaFilter.type.reduce(
			(prev, current) => prev && ValidMediaTypes.includes(current),
			true
		);
		if (!valid)
			errors.push({
				field: 'type',
				message: `Type field should be valid -> ${ValidMediaTypes.join(
					'|'
				)}`,
			});
	}

	if (!!mediaFilter.users && Array.isArray(mediaFilter.users)) {
		if (mediaFilter.users.length === 0) {
			errors.push({
				field: 'users',
				message: 'Users field should not be empty',
			});
		} else {
			const valid = mediaFilter.users.reduce(
				(prev, current) => prev && typeof current === 'number',
				true
			);
			if (!valid)
				errors.push({
					field: 'users',
					message: 'Users field should all be numbers',
				});
		}
	}
	return errors.length > 0 ? errors : false;
};

export default validateMediaFilters;
