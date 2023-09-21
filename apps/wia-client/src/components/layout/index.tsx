import { useAppDispatch, useAppSelector } from '@wia-client/src/store/hooks';
import {
	selectSignIn,
	selectUser,
	getLoggedStatus,
} from '@wia-client/src/store/user';
import { getUserAction } from '@wia-client/src/store/user/actions';
import { useEffect } from 'react';
import Footer from './Footer';
import { Box } from '@chakra-ui/react';
import Header from './header';

interface ILayoutProps {
	children: React.ReactNode;
}

function Layout({ children }: ILayoutProps) {
	const dispatch = useAppDispatch();
	const signInStatus = useAppSelector(selectSignIn);
	const userStatus = useAppSelector(selectUser);

	useEffect(() => {
		if (signInStatus.status === 'succeeded' && userStatus.status === 'idle')
			dispatch(getUserAction());
	}, [signInStatus.status, userStatus.status, dispatch]);

	useEffect(() => {
		if (signInStatus.status === 'idle' && userStatus.status === 'idle')
			dispatch(getLoggedStatus());
	}, [signInStatus.status, userStatus.status, dispatch]);

	return (
		<Box margin='0 auto' maxWidth={1000} transition='0.5s ease-out'>
			<Box margin='8'>
				<Header />
				<Box as='main' my={22}>
					{children}
				</Box>
				<Footer />
			</Box>
		</Box>
	);
}

export default Layout;
