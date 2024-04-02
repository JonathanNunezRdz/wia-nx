import { useState } from 'react';
import {
	Flex,
	FormControl,
	FormLabel,
	IconButton,
	Input,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

import { ChangeImageHandler } from '@wia-nx/types';
import ImageCard from './ImageCard';

type ImageInputProps = {
	currentImage: string;
	imageName: string;
	handleImageChange: ChangeImageHandler;
	handleImageReset: () => void;
	isLocal?: boolean;
};

export default function ImageInput({
	currentImage,
	imageName,
	handleImageChange,
	handleImageReset,
	isLocal,
}: ImageInputProps) {
	// react hooks
	const [imageKey, setImageKey] = useState(0);

	// std functions
	const resetImageHandler = () => {
		setImageKey((prev) => prev + 1);
		handleImageReset();
	};

	return (
		<FormControl>
			<FormLabel htmlFor='image'>image</FormLabel>
			{currentImage !== '' ? (
				<ImageCard
					image={{ src: currentImage }}
					imageName={imageName}
					isLocal={isLocal}
				/>
			) : (
				<></>
			)}
			<Flex mt={2} alignItems='center' gap={2}>
				<Input
					key={imageKey}
					id='image'
					type='file'
					variant='filled'
					accept='image/*'
					onChange={handleImageChange}
					py={2}
					height='auto'
				/>
				{currentImage !== '' ? (
					<IconButton
						aria-label='remove image'
						icon={<DeleteIcon />}
						borderRadius={5}
						colorScheme='red'
						onClick={resetImageHandler}
					/>
				) : (
					<></>
				)}
			</Flex>
		</FormControl>
	);
}
