import {
	Box,
	HStack,
	ListItem,
	Text,
	List,
	Button,
	VStack,
} from '@chakra-ui/react';
import { User } from '@prisma/client';
import { Link } from '@chakra-ui/next-js';

import { MediaResponse } from '@wia-nx/types';
import { useCardColor } from '@wia-client/src/utils';
import ImageCard from '@wia-client/src/components/common/ImageCard';
import MediaActionButtons from './MediaActionButtons';
import KnownBy from './KnownBy';

interface MediaCardProps {
	media: MediaResponse;
	ownId: User['id'];
	isLoggedIn: boolean;
}

const MediaCard = ({ media, ownId, isLoggedIn }: MediaCardProps) => {
	// rtk hooks
	// const deleteStatus = useAppSelector(selectDeleteMedia);

	// chakra hooks
	const bg = useCardColor();

	// conditions
	const isKnownByMe =
		media.knownBy.findIndex((user) => user.userId === ownId) !== -1;
	const hasWaifus = media.waifus.length > 0;
	const hasImage = Boolean(media.image);

	// render
	return (
		<Box bg={bg} borderRadius='md' p='4' position='relative'>
			{/* show a loading indicator if this media is being deleted */}
			<ImageCard image={media.image} imageName={media.title} />
			<Box
				bg='teal.600'
				borderRadius='md'
				p={2}
				mb={4}
				mt={hasImage ? 4 : undefined}
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
			<Box bg='teal.600' borderRadius='md' p={2}>
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
