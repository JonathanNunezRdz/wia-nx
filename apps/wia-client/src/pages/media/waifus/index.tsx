import {
	Box,
	Heading,
	HStack,
	SimpleGrid,
	Skeleton,
	Text,
	VStack,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { getMediaWaifusAction } from '@wia-client/src/store/media/actions';
import { useAppDispatch, useAppSelector } from '@wia-client/src/store/hooks';
import { selectAuth, selectUser } from '@wia-client/src/store/user';
import {
	resetMediaWaifus,
	selectMediaWaifus,
} from '@wia-client/src/store/media';
import Body from '@wia-client/src/components/layout/Body';
import WaifuCard from '../../waifus/WaifuCard';
import MediaActionButtons from '../MediaActionButtons';

const MediaWaifus = () => {
	// redux hooks
	const dispatch = useAppDispatch();
	const { isLoggedIn } = useAppSelector(selectAuth);
	const {
		data: { id: ownId },
	} = useAppSelector(selectUser);
	const {
		data: { media },
		status,
	} = useAppSelector(selectMediaWaifus);
	const isLoaded = status === 'succeeded';
	const isKnown =
		isLoaded &&
		media.knownBy.findIndex((user) => user.userId === ownId) > -1;

	// next hooks
	const router = useRouter();
	const mediaId = router.query.mediaId;

	// react hooks
	useEffect(() => {
		if (router.isReady) {
			if (status === 'idle') {
				dispatch(
					getMediaWaifusAction({
						id: mediaId as string,
						dto: {},
					})
				);
			}
		}
	}, [dispatch, mediaId, router.isReady, status]);

	useEffect(() => {
		return () => {
			dispatch(resetMediaWaifus());
		};
	}, [dispatch]);

	return (
		<Body h>
			<VStack w='full' spacing='4'>
				<Box w='full'>
					<HStack spacing='4'>
						<Skeleton isLoaded={isLoaded}>
							<Heading>
								{isLoaded ? media.title : 'loading'}
							</Heading>
						</Skeleton>
						<Skeleton isLoaded={isLoaded}>
							{isLoaded && (
								<MediaActionButtons
									isLoggedIn={isLoggedIn}
									query={{
										knownByMe: isKnown,
										mediaIdString: media.id,
										mediaTitle: media.title,
										mediaTypeString: media.type,
									}}
								/>
							)}
						</Skeleton>
					</HStack>
					<Skeleton isLoaded={isLoaded} fadeDuration={1}>
						<Text>{isLoaded ? media.type : 'loading'}</Text>
					</Skeleton>
				</Box>
				<Box w='full'>
					<SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing='4'>
						{isLoaded && media.waifus.length > 0 ? (
							media.waifus.map((waifu) => (
								<WaifuCard
									key={waifu.id}
									waifu={{
										...waifu,
										media: {
											id: media.id,
											title: media.title,
											type: media.type,
										},
									}}
									ownId={ownId}
									isLoggedIn={isLoggedIn}
								/>
							))
						) : (
							<Box>
								<Text>
									no waifus have been added to this media
								</Text>
							</Box>
						)}
					</SimpleGrid>
				</Box>
			</VStack>
		</Body>
	);
};

export default MediaWaifus;
