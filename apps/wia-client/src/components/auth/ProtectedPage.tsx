import { Center, Spinner } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';

import Body from '../layout/Body';
import { useAppSelector } from '../../store/hooks';
import { selectAuth } from '@wia-client/src/store/auth';

interface ProtectedPageProps {
	originalUrl: string;
	children: ReactNode;
	center?: boolean;
}

const ProtectedPage = ({
	originalUrl,
	children,
	center,
}: ProtectedPageProps) => {
	// next hooks
	const router = useRouter();

	// rtk hooks
	const { isLoggedIn, checkedToken } = useAppSelector(selectAuth);

	useEffect(() => {
		if (!isLoggedIn && checkedToken && router.isReady) {
			router.push({
				pathname: '/signin',
				query: {
					redirect: originalUrl,
				},
			});
		}
	}, [isLoggedIn, router, originalUrl, checkedToken]);

	if (!isLoggedIn) {
		return (
			<Center>
				<Spinner />
			</Center>
		);
	}

	if (center)
		return (
			<Body v h>
				{children}
			</Body>
		);

	return <Body>{children}</Body>;
};

export default ProtectedPage;
