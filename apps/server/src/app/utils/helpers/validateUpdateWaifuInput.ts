import { Error } from '../types/commonTypes';
import { UpdateWaifuInput, ValidWaifuLevels } from '../types/waifuTypes';

const validateUpdateWaifuInput = (
	waifuInput: UpdateWaifuInput
): Error[] | false => {
	const errors: Error[] = [];

	const { id, name, level, imagePath } = waifuInput;

	if (typeof id !== 'number')
		errors.push({
			field: 'id',
			message: 'Id field should not be empty nor 0',
		});

	if (typeof name !== 'undefined' && name === '')
		errors.push({
			field: 'name',
			message: 'Name field should not be empty',
		});

	if (typeof level !== 'undefined' && !ValidWaifuLevels.includes(level))
		errors.push({
			field: 'level',
			message: `Level field should be valid -> ${ValidWaifuLevels.join(
				'|'
			)} `,
		});

	if (typeof imagePath !== 'undefined' && imagePath === '')
		errors.push({
			field: 'imagePath',
			message: 'ImagePath should not be empty',
		});

	return errors.length > 0 ? errors : false;
};

export default validateUpdateWaifuInput;
