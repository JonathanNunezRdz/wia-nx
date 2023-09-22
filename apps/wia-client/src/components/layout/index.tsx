'use client';
import { useAppDispatch, useAppSelector } from '@wia-client/src/store/hooks';
import { useGetMeQuery } from '@wia-client/src/store/user';

import { useEffect } from 'react';
import Footer from './Footer';
import { Box } from '@chakra-ui/react';
import Header from './header';
import {
	selectAuth,
	getLoggedStatus,
} from '@wia-client/src/store/auth/authReducer';

interface ILayoutProps {
	children: React.ReactNode;
}

function Layout({ children }: ILayoutProps) {
	const dispatch = useAppDispatch();
	const { checkedToken, isLoggedIn } = useAppSelector(selectAuth);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const _ = useGetMeQuery(undefined, {
		skip: !isLoggedIn,
	});

	useEffect(() => {
		if (!checkedToken && !isLoggedIn) {
			dispatch(getLoggedStatus());
		}
	}, [checkedToken, isLoggedIn, dispatch]);

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
