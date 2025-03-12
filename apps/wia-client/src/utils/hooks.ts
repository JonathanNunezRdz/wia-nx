import { ImageFormat } from '@prisma/client';
import { ChangeImageHandler, type MyImage } from '@wia-nx/types';
import { ChangeEvent, useEffect, useState } from 'react';
import { loadImage } from '.';

type UseImageProps = {
	originalImage?: MyImage;
};

export function useImage({ originalImage }: UseImageProps = {}) {
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
		setCurrentImage(originalImage?.src || '');
		setImageFile(undefined);
		setImageFormat(undefined);
	};

	useEffect(() => {
		if (originalImage) {
			setCurrentImage(originalImage.src);
		}
	}, [originalImage]);

	return {
		currentImage,
		imageFile,
		imageFormat,
		handleImageChange,
		resetImage,
	};
}
