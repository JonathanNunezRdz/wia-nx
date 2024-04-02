import { Box, Center, HStack, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { User } from '@prisma/client';

import { useCardColor, WaifuLevelLabels } from '@wia-client/src/utils';
import { WaifuResponse } from '@wia-nx/types';
import ImageCard from '@wia-client/src/components/common/ImageCard';
import Loading from '@wia-client/src/components/common/Loading';
import WaifuActionButtons from './WaifuActionButtons';

interface WaifuCardProps {
	waifu: WaifuResponse;
	ownId: User['id'];
	isLoggedIn: boolean;
}

const WaifuCard = ({ waifu, ownId, isLoggedIn }: WaifuCardProps) => {
	// react hooks
	const [isDeleting, setIsDeleting] = useState(false);

	// chakra hooks
	const bg = useCardColor();

	// conditions
	const isOwnedWaifu = waifu.user.id === ownId;
	const hasImage = Boolean(waifu.image);

	// render
	return (
		<Box bg={bg} borderRadius='md' p={4} position='relative'>
			{isDeleting && (
				<Box
					borderRadius='md'
					bg='rgba(0,0,0,0.5)'
					height='100%'
					width='100%'
					position='absolute'
					top={0}
					left={0}
					zIndex={2}
				>
					<Center height='100%'>
						<Loading />
					</Center>
				</Box>
			)}
			<ImageCard image={waifu.image} imageName={waifu.name} />
			<Box
				bg='teal.600'
				borderRadius='md'
				p={2}
				mt={hasImage ? 4 : undefined}
			>
				<HStack justifyContent='space-between'>
					<Text fontSize='sm' fontWeight='medium'>
						{WaifuLevelLabels[waifu.level]}
					</Text>
					<WaifuActionButtons
						isLoggedIn={isLoggedIn}
						waifuIsOwn={isOwnedWaifu}
						waifuId={waifu.id}
						setIsDeleting={setIsDeleting}
					/>
				</HStack>

				<Text fontWeight='semibold' fontSize='2xl'>
					{waifu.name}
				</Text>
				<Text opacity='0.8' fontSize='sm'>
					Since: {new Date(waifu.since).toDateString()}
				</Text>
				<Text opacity='0.8' fontSize='sm'>
					Owner: {ownId === waifu.user.id ? 'me' : waifu.user.alias}
				</Text>
			</Box>
		</Box>
	);
};

export default WaifuCard;
