import { Center, Spinner } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';

import Body from '../layout/Body';
import { useAppSelector } from '../../store/hooks';
import { selectAuth } from '../../store/user';

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
	const { isLoggedIn, checkedJWT } = useAppSelector(selectAuth);
	const router = useRouter();

	useEffect(() => {
		if (!isLoggedIn && checkedJWT) {
			router.push({
				pathname: '/signin',
				query: {
					redirect: originalUrl,
				},
			});
		}
	}, [isLoggedIn, router, originalUrl, checkedJWT]);

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
