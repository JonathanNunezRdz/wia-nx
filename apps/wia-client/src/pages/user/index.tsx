import { Button, Heading, VStack } from '@chakra-ui/react';
import { NextSeo } from 'next-seo';
import type { FC } from 'react';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectUser, signOut } from '../../store/user';
import ProtectedPage from '../../components/auth/ProtectedPage';

const User: FC = () => {
	const dispatch = useAppDispatch();
	const { data: user } = useAppSelector(selectUser);

	const handleSignOut = () => {
		dispatch(signOut());
	};

	return (
		<ProtectedPage originalUrl='/user' center>
			<NextSeo title='user' />
			<VStack>
				<Heading>profile - {user.alias}</Heading>
				<Button onClick={handleSignOut}>sign out</Button>
			</VStack>
		</ProtectedPage>
	);
};

export default User;
