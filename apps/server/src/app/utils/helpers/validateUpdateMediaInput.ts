import { Error } from '../types/commonTypes';
import { UpdateMediaInput } from '../types/mediaTypes';

const validateUpdateMediaInput = (
	mediaInput: UpdateMediaInput
): Error[] | false => {
	const errors: Error[] = [];
	const { id, imagePath, title } = mediaInput;

	if (typeof id !== 'number')
		errors.push({
			field: 'id',
			message: 'Id field should not be empty nor 0',
		});

	if (typeof imagePath !== 'undefined' && imagePath === '')
		errors.push({
			field: 'imagePath',
			message: 'ImagePath should not be empty',
		});

	if (typeof title !== 'undefined' && title === '')
		errors.push({
			field: 'Title',
			message: 'Title should not be empty',
		});

	return errors.length > 0 ? errors : false;
};

export default validateUpdateMediaInput;
