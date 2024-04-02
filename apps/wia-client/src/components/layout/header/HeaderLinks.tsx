import { Link } from '@chakra-ui/next-js';
import { Spinner } from '@chakra-ui/react';
import { selectAuth } from '@wia-client/src/store/auth/authReducer';
import { useAppSelector } from '@wia-client/src/store/hooks';
import { useGetMeQuery } from '@wia-client/src/store/user';
import { useMemo } from 'react';

interface IHeaderLinksProps {
	links: string[];
}

function HeaderLinks({ links }: IHeaderLinksProps) {
	// rtk hooks
	const { isLoggedIn } = useAppSelector(selectAuth);
	const {
		data: user,
		isFetching,
		isSuccess,
	} = useGetMeQuery(undefined, {
		skip: !isLoggedIn,
	});

	// sub-components
	const LinkComponents = useMemo(() => {
		return links.map((link) => {
			return (
				<Link key={link} href={`/${link}`} me={4}>
					{link}
				</Link>
			);
		});
	}, [links]);

	// render
	if (isLoggedIn && isFetching)
		return (
			<>
				{LinkComponents}
				<Spinner me={4} />
			</>
		);

	if (isLoggedIn && isSuccess)
		return (
			<>
				{LinkComponents}
				<Link href='/user' me={4}>
					{user.alias}
				</Link>
			</>
		);

	return (
		<>
			{LinkComponents}
			<Link href='/signin' me={4}>
				sign in
			</Link>
		</>
	);
}

export default HeaderLinks;
