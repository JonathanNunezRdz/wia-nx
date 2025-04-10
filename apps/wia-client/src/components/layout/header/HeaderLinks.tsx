import { Link } from '@chakra-ui/next-js';
import { Flex, Spinner } from '@chakra-ui/react';
import { useGetLoggedStatusQuery } from '@wia-client/src/store';
import { useGetMeQuery } from '@wia-client/src/store/user';
import { useMemo } from 'react';
import { UserAvatar } from '../../common/UserAvatar';

interface IHeaderLinksProps {
	links: string[];
}

function HeaderLinks({ links }: IHeaderLinksProps) {
	// rtk hooks
	const loggedStatus = useGetLoggedStatusQuery();
	const meQuery = useGetMeQuery(undefined, {
		skip: !loggedStatus.isSuccess,
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
	if (meQuery.isFetching)
		return (
			<>
				{LinkComponents}
				<Spinner me={4} />
			</>
		);

	if (meQuery.isSuccess)
		return (
			<>
				{LinkComponents}
				<Link href='/user' me={4}>
					<Flex flexDir='row' alignItems='center' gap='2'>
						{meQuery.data.image ? (
							<UserAvatar
								name={meQuery.data.alias}
								image={meQuery.data.image}
							/>
						) : (
							meQuery.data.alias
						)}
					</Flex>
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
