import { Box, Center, Image } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getDownloadURL, ref } from 'firebase/storage';

import { MediaResponse, WaifuResponse } from '@wia-nx/types';
import { storage } from '@wia-client/src/store/api/firebase';
import Loading from './Loading';

interface ImageCardProps {
	image: MediaResponse['image'] | WaifuResponse['image'];
	imageName: string;
	imageRoot?: string | undefined;
	isLocal?: boolean;
}

const ImageCard = ({ image, imageName, isLocal = false }: ImageCardProps) => {
	// react hooks
	const [imageSrc, setImageSrc] = useState('');

	// effects
	useEffect(() => {
		const getImage = async () => {
			if (image && image.src) {
				if (isLocal) {
					setImageSrc(image.src);
				} else {
					// const imageBlob = await getBlob(ref(storage, image.src))
					// setImageSrc(URL.createObjectURL(imageBlob));
					try {
						const res = await getDownloadURL(
							ref(storage, image.src)
						);
						setImageSrc(res);
					} catch (error) {
						console.error(error);
						const res = await getDownloadURL(
							ref(storage, 'static/Image-not-found.png')
						);
						setImageSrc(res);
					}
				}
			}
		};
		getImage();
	}, [image, isLocal]);

	// constants
	const has = Boolean(image);

	// render
	if (!has) return <></>;
	return (
		<Box maxW='400px'>
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
