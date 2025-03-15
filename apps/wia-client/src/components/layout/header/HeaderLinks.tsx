import { Link } from '@chakra-ui/next-js';
import { Avatar, Flex, Spinner, Tooltip } from '@chakra-ui/react';
import { storage } from '@wia-client/src/store/api/firebase';
import { selectAuth } from '@wia-client/src/store/auth/authReducer';
import { useAppSelector } from '@wia-client/src/store/hooks';
import { useGetMeQuery } from '@wia-client/src/store/user';
import type { MyImage } from '@wia-nx/types';
import { getDownloadURL, ref } from 'firebase/storage';
import { useEffect, useMemo, useState } from 'react';

interface IHeaderLinksProps {
	links: string[];
}

function HeaderLinks({ links }: IHeaderLinksProps) {
	// rtk hooks
	const { isLoggedIn } = useAppSelector(selectAuth);
	const {
		data: user,
		isFetching,
		isSuccess,
	} = useGetMeQuery(undefined, {
		skip: !isLoggedIn,
	});

	// sub-components
	const LinkComponents = useMemo(() => {
		return links.map((link) => {
			return (
				<Link key={link} href={`/${link}`} me={4}>
					{link}
				</Link>
			);
		});
	}, [links]);

	// render
	if (isLoggedIn && isFetching)
		return (
			<>
				{LinkComponents}
				<Spinner me={4} />
			</>
		);

	if (isLoggedIn && isSuccess)
		return (
			<>
				{LinkComponents}
				<Link href='/user' me={4}>
					<Flex flexDir='row' alignItems='center' gap='2'>
						{user.image ? (
							<UserAvatar name={user.alias} image={user.image} />
						) : (
							user.alias
						)}
					</Flex>
				</Link>
			</>
		);

	return (
		<>
			{LinkComponents}
			<Link href='/signin' me={4}>
				sign in
			</Link>
		</>
	);
}

type UserAvatarProps = {
	image: MyImage;
	name: string;
};

function UserAvatar({ image, name }: UserAvatarProps) {
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
			<Avatar name={name} src={imageSrc} ignoreFallback />
		</Tooltip>
	);
}

export default HeaderLinks;
