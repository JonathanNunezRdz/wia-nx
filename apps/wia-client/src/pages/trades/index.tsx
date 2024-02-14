import { AddIcon, RepeatIcon } from '@chakra-ui/icons';
import { Box, IconButton, Text, VStack } from '@chakra-ui/react';
import LinkButton from '@wia-client/src/components/common/LinkButton';
import PageTitle from '@wia-client/src/components/common/PageTitle';
import Body from '@wia-client/src/components/layout/Body';
import { useAppSelector } from '@wia-client/src/store/hooks';
import { selectAuth } from '@wia-client/src/store/user';
import { NextSeo } from 'next-seo';

function Trades() {
	// rtk hooks
	const { isLoggedIn } = useAppSelector(selectAuth);

	return (
		<Body h>
			<NextSeo title='trades' />
			<VStack w='full' spacing={4}>
				<PageTitle title='trades'>
					{isLoggedIn && (
						<LinkButton
							pathname='/trades/add'
							iconButtonProps={{
								'aria-label': 'add trade',
								icon: <AddIcon />,
								size: 'sm',
								mt: 1,
							}}
						/>
					)}
					<Box>
						<IconButton
							aria-label='refresh trades'
							icon={<RepeatIcon />}
							size='sm'
							mt={1}
						/>
					</Box>
				</PageTitle>
				<Box p={4}>
					<Text fontSize='2xl'>coming soon!</Text>
				</Box>
			</VStack>
		</Body>
	);
}

export default Trades;
