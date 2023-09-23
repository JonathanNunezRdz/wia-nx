'use client';
import { Box, Center, Image } from '@chakra-ui/react';
import { MediaResponse, WaifuResponse } from '@wia-nx/types';
import { MediaType } from '@prisma/client';

import Loading from './Loading';
import { useEffect, useState } from 'react';
import { storage } from '@wia-client/src/store/api/firebase';
import { getDownloadURL, ref } from 'firebase/storage';

interface ImageCardProps {
	image: MediaResponse['image'] | WaifuResponse['image'];
	type: MediaType | 'waifu';
	imageName: string;
	imageRoot?: string | undefined;
}

const ImageCard = ({ image, type, imageName }: ImageCardProps) => {
	const [imageSrc, setImageSrc] = useState('');

	useEffect(() => {
		const getImage = async () => {
			if (image && image.src) {
				// const imageBlob = await getBlob(ref(storage, image.src))
				// setImageSrc(URL.createObjectURL(imageBlob));
				const res = await getDownloadURL(ref(storage, image.src));
				setImageSrc(res);
			}
		};
		getImage();
	}, [image]);

	const has = typeof image !== 'undefined';

	if (!has) return <></>;
	return (
		<Box>
			<Center>
				<Image
					objectFit='cover'
					src={imageSrc}
					alt={`${imageName} image`}
					fallback={<Loading />}
					borderRadius='8'
				/>
			</Center>
		</Box>
	);
};

export default ImageCard;
