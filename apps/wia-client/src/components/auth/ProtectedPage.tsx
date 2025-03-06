import { Center, Spinner } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';

import { selectAuth } from '@wia-client/src/store/auth';
import { useAppSelector } from '../../store/hooks';
import Body from '../layout/Body';

interface ProtectedPageProps {
	originalUrl: string;
	children: ReactNode;
	centerX?: boolean;
	centerY?: boolean;
}

function ProtectedPage({
	originalUrl,
	children,
	centerX = false,
	centerY = false,
}: ProtectedPageProps) {
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

	return (
		<Body h={centerX} v={centerY}>
			{children}
		</Body>
	);
}

export default ProtectedPage;
