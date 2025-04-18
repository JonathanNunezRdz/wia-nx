import { Box, Center, Fade, Flex, Image } from '@chakra-ui/react';
import {
	getDownloadURL,
	ref,
	StorageError,
	StorageErrorCode,
	StorageReference,
} from 'firebase/storage';
import { useEffect, useState } from 'react';

import { storage } from '@wia-client/src/store/api/firebase';
import { MediaResponse, WaifuResponse } from '@wia-nx/types';
import { Loading } from './Loading';
import { FirebaseError } from 'firebase/app';

interface ImageCardProps {
	image: MediaResponse['image'] | WaifuResponse['image'];
	imageName: string;
	imageRoot?: string | undefined;
	isLocal?: boolean;
	imageIsLoading?: boolean;
}

const ImageCard = ({
	image,
	imageName,
	imageIsLoading = false,
	isLocal = false,
}: ImageCardProps) => {
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
						if (
							error instanceof FirebaseError &&
							error.code === 'storage/object-not-found'
						) {
							console.log(
								'ref for:',
								image.src,
								'not found, using dummy image'
							);
							const res = await getDownloadURL(
								ref(storage, 'static/Image-not-found.png')
							);
							setImageSrc(res);
						} else {
							console.log(error);
						}
					}
				}
			}
		};
		getImage();
	}, [image, isLocal]);

	// render
	if (!Boolean(image)) return <></>;
	return (
		<Flex justifyContent='center'>
			<Box maxW='400px'>
				<Center>
					{/* {imageIsLoading ? (
						<Loading />
					) : ( */}
					<Fade in={!imageIsLoading}>
						<Image
							objectFit='cover'
							src={imageSrc}
							alt={`${imageName} image`}
							fallback={<Loading />}
							borderRadius='8'
						/>
					</Fade>
					{/* )} */}
				</Center>
			</Box>
		</Flex>
	);
};

export default ImageCard;
