import {
	Box,
	HStack,
	ListItem,
	Text,
	List,
	Button,
	VStack,
	Center,
} from '@chakra-ui/react';
import { MediaResponse } from '@wia-nx/types';
import { User } from '@prisma/client';
import { Link } from '@chakra-ui/next-js';

import MediaActionButtons from './MediaActionButtons';
import KnownBy from './KnownBy';
import { useCardColor } from '@wia-client/src/utils/constants';
import ImageCard from '@wia-client/src/components/common/ImageCard';
import { useAppSelector } from '@wia-client/src/store/hooks';
import Loading from '@wia-client/src/components/common/Loading';
import { selectDeleteMedia } from '@wia-client/src/store/media';

interface MediaCardProps {
	media: MediaResponse;
	ownId: User['id'];
	isLoggedIn: boolean;
}

const MediaCard = ({ media, ownId, isLoggedIn }: MediaCardProps) => {
	// rtk hooks
	const deleteStatus = useAppSelector(selectDeleteMedia);

	// chakra hooks
	const bg = useCardColor();

	// conditions
	const isKnownByMe =
		media.knownBy.findIndex((user) => user.userId === ownId) !== -1;
	const hasWaifus = media.waifus.length > 0;
	const isDeleting =
		deleteStatus.status === 'loading' && deleteStatus.mediaId === media.id;
	const hasImage = Boolean(media.image);

	// render
	return (
		<Box bg={bg} borderRadius='md' p='4' position='relative'>
			{isDeleting && (
				<Box
					borderRadius='md'
					bg='rgba(0,0,0,0.5)'
					height='100%'
					width='100%'
					position='absolute'
					top='0'
					left='0'
					zIndex={2}
				>
					<Center height='100%'>
						<Loading />
					</Center>
				</Box>
			)}
			<ImageCard
				image={media.image}
				type={media.type}
				imageName={media.title}
			/>
			<Box
				bg='teal.600'
				borderRadius='md'
				p='2'
				mb='4'
				mt={hasImage ? '4' : undefined}
			>
				<HStack justifyContent='space-between'>
					<Text fontSize='sm' fontWeight='medium'>
						{media.type}
					</Text>
					<MediaActionButtons
						isLoggedIn={isLoggedIn}
						query={{
							knownByMe: isKnownByMe,
							mediaIdString: media.id,
							mediaTitle: media.title,
							mediaTypeString: media.type,
						}}
					/>
				</HStack>

				<Text fontWeight='semibold' fontSize='2xl'>
					{media.title}
				</Text>
				<KnownBy users={media.knownBy} ownId={ownId} />
			</Box>
			<Box bg='teal.600' borderRadius='md' p='2'>
				<VStack alignItems='start'>
					<Box>
						<List>
							{hasWaifus ? (
								media.waifus.map((waifu) => (
									<ListItem key={waifu.id}>
										{waifu.name}
									</ListItem>
								))
							) : (
								<ListItem>no waifus</ListItem>
							)}
						</List>
					</Box>

					<Link
						href={{
							pathname: '/media/waifus',
							query: {
								mediaId: media.id,
							},
						}}
						width='full'
					>
						<Button size='sm' width='full'>
							view{isKnownByMe ? '/add' : ''} waifus
						</Button>
					</Link>
				</VStack>
			</Box>
		</Box>
	);
};

export default MediaCard;
