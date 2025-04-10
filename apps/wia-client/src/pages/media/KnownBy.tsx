import { Box, Flex, Text } from '@chakra-ui/react';
import { MediaKnownUser } from '@wia-nx/types';
import { User } from '@prisma/client';
import { UserAvatar } from '@wia-client/src/components/common/UserAvatar';

interface KnownByProps {
	users: MediaKnownUser[];
	ownId: User['id'];
}

const KnownBy = ({ users, ownId }: KnownByProps) => {
	return (
		<Box my='2'>
			{users.map(({ user, knownAt }, i) => (
				<Flex key={user.id} alignItems='center'>
					{user.image ? (
						<UserAvatar
							image={user.image}
							name={ownId === user.id ? 'me' : user.alias}
							me='1'
							size='sm'
						/>
					) : null}
					<Text opacity='0.8' fontSize='sm'>
						{user.image
							? null
							: ownId === user.id
							? 'me'
							: user.alias}{' '}
						- {new Date(knownAt).toDateString()}
					</Text>
				</Flex>
			))}
		</Box>
	);
};

export default KnownBy;
