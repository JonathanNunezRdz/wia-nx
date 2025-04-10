import { Button, VStack } from '@chakra-ui/react';
import type { FC } from 'react';

import PageTitle from '@wia-client/src/components/common/PageTitle';
import {
	useGetLoggedStatusQuery,
	useGetMeQuery,
	useSignOutMutation,
} from '@wia-client/src/store';
import ProtectedPage from '../../components/auth/ProtectedPage';
import { EditUser } from './EditUser';
import { UpdatePasswordForm } from './UpdatePasswordForm';

const User: FC = () => {
	// rtk hooks
	const loggedStatus = useGetLoggedStatusQuery();
	const [signOut] = useSignOutMutation();
	const meQuery = useGetMeQuery(undefined, { skip: !loggedStatus.isSuccess });

	const handleSignOut = async () => {
		await signOut();
	};

	return (
		<ProtectedPage originalUrl='/user'>
			<VStack w='full' spacing={4}>
				<PageTitle
					title={`account - ${
						meQuery.isSuccess
							? meQuery.data.alias
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
