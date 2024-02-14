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
	local?: boolean;
}

const ImageCard = ({
	image,
	type,
	imageName,
	local = false,
}: ImageCardProps) => {
	const [imageSrc, setImageSrc] = useState('');
	useEffect(() => {
		const getImage = async () => {
			if (image && image.src) {
				if (local) {
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
	}, [image, local]);
	const has = !!image;
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
