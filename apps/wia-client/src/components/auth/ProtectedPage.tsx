import { Center, Spinner } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';

import { useGetLoggedStatusQuery } from '@wia-client/src/store/auth';
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
	const loggedStatus = useGetLoggedStatusQuery();

	useEffect(() => {
		if (loggedStatus.isError && router.isReady) {
			router.push({
				pathname: '/signin',
				query: {
					redirect: originalUrl,
				},
			});
		}
	}, [loggedStatus, router, originalUrl]);

	if (!loggedStatus.isSuccess) {
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
