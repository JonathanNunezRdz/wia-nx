import { Button, Heading, VStack } from '@chakra-ui/react';
import { NextSeo } from 'next-seo';
import type { FC } from 'react';

import {
	useAppDispatch,
	useAppSelector,
	selectAuth,
	signOut,
	useGetMeQuery,
} from '@wia-client/src/store';
import ProtectedPage from '../../components/auth/ProtectedPage';

const User: FC = () => {
	// rtk hooks
	const dispatch = useAppDispatch();
	const { isLoggedIn } = useAppSelector(selectAuth);
	const userQuery = useGetMeQuery(undefined, { skip: !isLoggedIn });

	const handleSignOut = () => {
		dispatch(signOut());
	};

	return (
		<ProtectedPage originalUrl='/user' center>
			<NextSeo title='user' />
			<VStack>
				<Heading>
					profile -{' '}
					{userQuery.isSuccess
						? userQuery.data.alias
						: 'loading user...'}
				</Heading>
				<Button onClick={handleSignOut}>sign out</Button>
			</VStack>
		</ProtectedPage>
	);
};

export default User;
