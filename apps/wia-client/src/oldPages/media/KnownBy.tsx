import { Box, Text } from '@chakra-ui/react';
import { MediaKnownUser } from '@wia-nx/types';
import { User } from '@prisma/client';

interface KnownByProps {
	users: MediaKnownUser[];
	ownId: User['id'];
}

const KnownBy = ({ users, ownId }: KnownByProps) => {
	return (
		<Box my='2'>
			{users.map(({ user, knownAt }, i) => (
				<Text key={user.id} opacity='0.8' fontSize='sm'>
					{ownId === user.id ? 'me' : user.alias} -{' '}
					{new Date(knownAt).toDateString()}
				</Text>
			))}
		</Box>
	);
};

export default KnownBy;
