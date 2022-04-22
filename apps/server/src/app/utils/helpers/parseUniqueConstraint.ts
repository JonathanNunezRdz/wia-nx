import { Error } from '../types/commonTypes';

const parseUniqueConstraint = (error: any): Error => {
	const field = error.message
		.split('unique constraint')[1]
		.replace(/"/g, '')
		.trim()
		.split('_')[1];

	return {
		field,
		message: `This ${field} has already been used.`,
	};
};

export default parseUniqueConstraint;
