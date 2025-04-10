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

import Body from '@wia-client/src/components/layout/Body';
import {
	useGetLoggedStatusQuery,
	useGetMediaWaifusQuery,
	useGetMeQuery,
} from '@wia-client/src/store';
import { parseMediaId } from '@wia-client/src/utils';
import WaifuCard from '../../waifus/WaifuCard';
import MediaActionButtons from '../MediaActionButtons';

const MediaWaifus = () => {
	// next hooks
	const router = useRouter();
	const mediaId = parseMediaId(router.query.mediaId);

	// redux hooks
	const loggedStatus = useGetLoggedStatusQuery();
	const userQuery = useGetMeQuery(undefined, {
		skip: !loggedStatus.isSuccess,
	});
	const waifuQuery = useGetMediaWaifusQuery(
		{ id: mediaId, waifuDto: {} },
		{ skip: !router.isReady }
	);
	const dataLoaded = userQuery.isSuccess && waifuQuery.isSuccess;
	const isKnown =
		dataLoaded &&
		waifuQuery.data.media.knownBy.findIndex(
			(user) => user.user.id === userQuery.data.id
		) > -1;

	// effects

	// render
	return (
		<Body h>
			<VStack w='full' spacing='4'>
				<Box w='full'>
					<HStack spacing='4'>
						<Skeleton isLoaded={dataLoaded}>
							<Heading>
								{dataLoaded
									? waifuQuery.data.media.title
									: 'loading'}
							</Heading>
						</Skeleton>
						<Skeleton isLoaded={dataLoaded}>
							{dataLoaded && (
								<MediaActionButtons
									isLoggedIn={loggedStatus.isSuccess}
									query={{
										knownByMe: isKnown,
										mediaIdString: waifuQuery.data.media.id,
										mediaTitle: waifuQuery.data.media.title,
										mediaTypeString:
											waifuQuery.data.media.type,
									}}
								/>
							)}
						</Skeleton>
					</HStack>
					<Skeleton isLoaded={dataLoaded} fadeDuration={1}>
						<Text>
							{dataLoaded
								? waifuQuery.data.media.type
								: 'loading'}
						</Text>
					</Skeleton>
				</Box>
				<Box w='full'>
					<SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing='4'>
						{dataLoaded &&
						waifuQuery.data.media.waifus.length > 0 ? (
							waifuQuery.data.media.waifus.map((waifu) => (
								<WaifuCard
									key={waifu.id}
									waifu={{
										...waifu,
										media: {
											id: waifuQuery.data.media.id,
											title: waifuQuery.data.media.title,
											type: waifuQuery.data.media.type,
										},
									}}
									ownId={userQuery.data.id}
									isLoggedIn={loggedStatus.isSuccess}
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
