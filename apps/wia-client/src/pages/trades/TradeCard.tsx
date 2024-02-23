import { Box, Text } from '@chakra-ui/react';
import { User } from '@prisma/client';
import { useCardColor } from '@wia-client/src/utils/constants';
import { TradeResponse } from '@wia-nx/types';

type TradeCardProps = {
	trade: TradeResponse;
	ownId: User['id'];
};

export default function TradeCard({ trade, ownId }: TradeCardProps) {
	// chakra hooks
	const bg = useCardColor();

	const isSender = trade.sender.id === ownId;
	const isRecipient = trade.recipient.id === ownId;

	return (
		<Box bg={bg} borderRadius='md' p={4}>
			<Box>
				<Text>{isSender ? 'You' : trade.sender.alias} gave:</Text>
				{trade.offeredWaifus.map((waifu) => (
					<Text key={waifu.id}>
						{waifu.name} ({waifu.media.title})
					</Text>
				))}
			</Box>
			<Box>
				<Text>
					...and received from{' '}
					{isRecipient ? 'you' : trade.recipient.alias}:
				</Text>
				{trade.wantedWaifus.map((waifu) => (
					<Text key={waifu.id}>
						{waifu.name} ({waifu.media.title})
					</Text>
				))}
			</Box>
		</Box>
	);
}
