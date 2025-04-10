import { Avatar, AvatarProps, Spinner, Tooltip } from '@chakra-ui/react';
import { storage } from '@wia-client/src/store/api/firebase';
import { MyImage } from '@wia-nx/types';
import { getDownloadURL, ref } from 'firebase/storage';
import { useEffect, useState } from 'react';

type UserAvatarProps = {
	image: MyImage;
	name: string;
} & AvatarProps;

export function UserAvatar({ image, name, ...avatarProps }: UserAvatarProps) {
	const [imageSrc, setImageSrc] = useState('');
	const [imageLoading, setImageLoading] = useState(false);

	useEffect(() => {
		const getImage = async () => {
			try {
				setImageLoading(true);
				const res = await getDownloadURL(ref(storage, image.src));
				setImageSrc(res);
			} catch (error) {
				console.error(error);
				const res = await getDownloadURL(
					ref(storage, 'static/Image-not-found.png')
				);
				setImageSrc(res);
			} finally {
				setImageLoading(false);
			}
		};
		getImage();
	}, [image]);

	if (imageLoading) return <Spinner size='lg' />;
	return (
		<Tooltip label={name}>
			<Avatar
				name={name}
				src={imageSrc}
				ignoreFallback
				{...avatarProps}
			/>
		</Tooltip>
	);
}
