import { Error } from '../types/commonTypes';
import { WaifuInput } from '../types/waifuTypes';

const validateWaifu = (waifuInput: WaifuInput): Error[] | false => {
	const errors: Error[] = [];
	if (!waifuInput.name)
		errors.push({
			field: 'name',
			message: 'Name field should not be empty',
		});

	if (!waifuInput.level)
		errors.push({
			field: 'level',
			message: 'Level field should not be empty',
		});

	if (waifuInput.hasImage && !waifuInput.imageFormat)
		errors.push({
			field: 'imageFormat',
			message: 'ImageFormat field should not be empty',
		});

	if (!waifuInput.mediaId)
		errors.push({
			field: 'mediaId',
			message: 'MediaId field should not be empty',
		});

	return errors.length > 0 ? errors : false;
};

export default validateWaifu;
