import { Button, VStack } from '@chakra-ui/react';
import type { FC } from 'react';

import PageTitle from '@wia-client/src/components/common/PageTitle';
import {
	selectAuth,
	signOut,
	useAppDispatch,
	useAppSelector,
	useGetMeQuery,
} from '@wia-client/src/store';
import ProtectedPage from '../../components/auth/ProtectedPage';
import { EditUser } from './EditUser';
import { UpdatePasswordForm } from './UpdatePasswordForm';

const User: FC = () => {
	// rtk hooks
	const dispatch = useAppDispatch();
	const { isLoggedIn } = useAppSelector(selectAuth);
	const userQuery = useGetMeQuery(undefined, { skip: !isLoggedIn });

	const handleSignOut = () => {
		dispatch(signOut());
	};

	return (
		<ProtectedPage originalUrl='/user'>
			<VStack w='full' spacing={4}>
				<PageTitle
					title={`account - ${
						userQuery.isSuccess
							? userQuery.data.alias
							: 'loading user...'
					}`}
				>
					<Button onClick={handleSignOut}>sign out</Button>
				</PageTitle>

				<EditUser />

				<UpdatePasswordForm />
			</VStack>
		</ProtectedPage>
	);
};

export default User;
