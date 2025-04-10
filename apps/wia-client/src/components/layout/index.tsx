import { Box } from '@chakra-ui/react';
import Footer from './Footer';
import Header from './header';

interface ILayoutProps {
	children: React.ReactNode;
}

function Layout({ children }: ILayoutProps) {
	// rtk hooks
	// const loggedStatus = useGetLoggedStatusQuery();
	// const dispatch = useAppDispatch();
	// const userQuery = useGetMeQuery(undefined, {
	// 	skip: loggedStatus.isError,
	// });

	// effects
	// useEffect(() => {
	// 	if (!checkedToken && !isLoggedIn) {
	// 		dispatch(getLoggedStatus());
	// 	}
	// }, [checkedToken, isLoggedIn, dispatch]);

	// useEffect(() => {
	// 	if (userQuery.isError) {
	// 		if ('status' in userQuery.error) {
	// 			const error = userQuery.error;
	// 			if (error.status === 412) {
	// 				dispatch(signOut());
	// 			}
	// 		}
	// 	}
	// }, [userQuery]);

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
