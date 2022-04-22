import { Error } from '../types/commonTypes';
import { MediaInput } from '../types/mediaTypes';

const validateMedia = (mediaInput: MediaInput): Error[] | false => {
	const errors: Error[] = [];
	if (!mediaInput.title)
		errors.push({
			field: 'title',
			message: 'Title field should not be empty',
		});
	if (!mediaInput.type)
		errors.push({
			field: 'type',
			message: 'Type field should not be empty',
		});
	if (mediaInput.hasImage && !mediaInput.imageFormat)
		errors.push({
			field: 'imageFormat',
			message: 'ImageFormat field should not be empty',
		});
	return errors.length > 0 ? errors : false;
};

export default validateMedia;
