import { Link } from '@chakra-ui/next-js';
import { Spinner } from '@chakra-ui/react';
import { useAppSelector } from '@wia-client/src/store/hooks';
import { selectAuth, selectUser } from '@wia-client/src/store/user';
import { useMemo } from 'react';

interface IHeaderLinksProps {
	links: string[];
}

function HeaderLinks({ links }: IHeaderLinksProps) {
	const { isLoggedIn } = useAppSelector(selectAuth);
	const { status, data: user } = useAppSelector(selectUser);

	const LinkComponents = useMemo(() => {
		return links.map((link) => {
			return (
				<Link key={link} href={`/${link}`} me='1rem'>
					{link}
				</Link>
			);
		});
	}, [links]);

	if (isLoggedIn && status === 'loading')
		return (
			<>
				{LinkComponents}
				<Spinner me='1rem' />
			</>
		);

	if (isLoggedIn && status === 'succeeded')
		return (
			<>
				{LinkComponents}
				<Link href='/user' me='1rem'>
					{user.alias}
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
