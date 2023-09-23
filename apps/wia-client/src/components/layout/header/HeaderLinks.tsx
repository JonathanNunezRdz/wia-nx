import { Link } from '@chakra-ui/next-js';
import { Spinner } from '@chakra-ui/react';
import { selectAuth } from '@wia-client/src/store/auth/authReducer';
import { useAppSelector } from '@wia-client/src/store/hooks';
import { useGetMeQuery } from '@wia-client/src/store/user';
import { useMemo } from 'react';

// async function getData() {
// 	const res = await fetch()
// }

interface IHeaderLinksProps {
	links: string[];
}

function HeaderLinks({ links }: IHeaderLinksProps) {
	const { isLoggedIn } = useAppSelector(selectAuth);
	const user = useGetMeQuery(undefined, {
		skip: !isLoggedIn,
	});

	const LinkComponents = useMemo(() => {
		return links.map((link) => {
			return (
				<Link key={link} href={`/${link}`} me='1rem'>
					{link}
				</Link>
			);
		});
	}, [links]);

	if (user.isLoading)
		return (
			<>
				{LinkComponents}
				<Spinner me='1rem' />
			</>
		);

	if (user.isSuccess)
		return (
			<>
				{LinkComponents}
				<Link href='/user' me='1rem'>
					{user.data.alias}
				</Link>
			</>
		);

	return (
		<>
			{LinkComponents}
			<Link href='/signin' me='1rem'>
				sign in
			</Link>
		</>
	);
}

export default HeaderLinks;
