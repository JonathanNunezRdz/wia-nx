import { ImageFormat } from '@prisma/client';
import { ChangeImageHandler } from '@wia-nx/types';
import { ChangeEvent, useState } from 'react';
import { loadImage } from '.';

export function useImage() {
	const [currentImage, setCurrentImage] = useState('');
	const [imageFile, setImageFile] = useState<File>();
	const [imageFormat, setImageFormat] = useState<ImageFormat | undefined>();

	const handleImageChange: ChangeImageHandler = async (
		event: ChangeEvent<HTMLInputElement>
	) => {
		const res = await loadImage(event.currentTarget.files);
		setCurrentImage(res.result);
		setImageFile(res.image);
		setImageFormat(res.format);
	};

	const resetImage = () => {
		setCurrentImage('');
		setImageFile(undefined);
		setImageFormat(undefined);
	};

	return {
		currentImage,
		imageFile,
		imageFormat,
		handleImageChange,
		resetImage,
	};
}
