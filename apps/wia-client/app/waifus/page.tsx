'use client';
import { AddIcon, RepeatIcon } from '@chakra-ui/icons';
import {
	Box,
	HStack,
	Heading,
	IconButton,
	SimpleGrid,
	Text,
	VStack,
} from '@chakra-ui/react';
import CustomPagination from '@wia-client/src/components/common/CustomPagination';
import LinkButton from '@wia-client/src/components/common/LinkButton';
import Body from '@wia-client/src/components/layout/Body';
import { usePagination } from '@wia-client/src/components/pagination';
import WaifuCard from '@wia-client/src/oldPages/waifus/WaifuCard';
import WaifuFilterOptions from '@wia-client/src/oldPages/waifus/WaifuFilterOptions';
import { selectAuth } from '@wia-client/src/store/auth/authReducer';
import { useAppDispatch, useAppSelector } from '@wia-client/src/store/hooks';
import { useGetMeQuery } from '@wia-client/src/store/user';
import { useGetAllWaifusQuery } from '@wia-client/src/store/waifu/waifuApi';
import {
	changeWaifuPage,
	selectWaifuPage,
} from '@wia-client/src/store/waifu/waifuReducer';
import { useEffect } from 'react';

function Waifus() {
	const dispatch = useAppDispatch();
	const { isLoggedIn } = useAppSelector(selectAuth);
	const user = useGetMeQuery(undefined, { skip: !isLoggedIn });
	const { limit, page, level, name, users } = useAppSelector(selectWaifuPage);

	const waifus = useGetAllWaifusQuery({
		limit,
		page,
		level,
		name,
		users,
	});

	const {
		pages,
		pagesCount,
		currentPage,
		isDisabled,
		setIsDisabled,
		setCurrentPage,
	} = usePagination({
		total: waifus.data?.totalWaifus || 0,
		limits: { outer: 2, inner: 2 },
		initialState: {
			pageSize: limit,
			isDisabled: false,
			currentPage: page,
		},
	});

	const handleChangeFilters = (
		options: ReturnType<typeof selectWaifuPage>
	) => {
		dispatch(changeWaifuPage(options));
	};
	const handleChangePage = (nextPage: number) => {
		if (nextPage === page) return;
		if (nextPage < 1) return;
		if (nextPage > pagesCount) return;
		setIsDisabled(true);
		handleChangeFilters({ page: nextPage, limit, level, users, name });
	};

	useEffect(() => {
		if (waifus.isFetching) return;
		if (waifus.isSuccess) {
			setCurrentPage(page);
			setIsDisabled(false);
		}
	}, [
		page,
		waifus.isFetching,
		waifus.isSuccess,
		setCurrentPage,
		setIsDisabled,
	]);

	return (
		<Body h>
			<VStack w='full' spacing={4}>
				<Box w='full'>
					<HStack spacing={4}>
						<Heading as='h2'>waifus</Heading>
						{isLoggedIn && (
							<LinkButton
								pathname='/waifus/add'
								iconButtonProps={{
									'aria-label': 'add waifu',
									icon: <AddIcon />,
									size: 'sm',
									mt: 1,
								}}
							/>
						)}
						<Box>
							<IconButton
								aria-label='reload waifus'
								icon={<RepeatIcon />}
								size='sm'
								mt={1}
								onClick={() => waifus.refetch()}
								isLoading={
									waifus.isLoading || waifus.isFetching
								}
							/>
						</Box>
					</HStack>
					<WaifuFilterOptions getWaifus={handleChangeFilters} />
				</Box>

				<CustomPagination
					pages={pages}
					pagesCount={pagesCount}
					currentPage={currentPage}
					isDisabled={isDisabled}
					onPageChange={handleChangePage}
				/>

				<Box w='full'>
					<SimpleGrid columns={{ sm: 2, md: 3 }} spacing={4}>
						{waifus.isSuccess && waifus.data.waifus.length > 0 ? (
							waifus.data.waifus.map((elem) => (
								<WaifuCard
									key={elem.id}
									waifu={elem}
									ownId={user.data?.id || ''}
									isLoggedIn={isLoggedIn}
								/>
							))
						) : (
							<Box>
								<Text>
									no waifus have been added to the wia
								</Text>
							</Box>
						)}
					</SimpleGrid>
				</Box>

				<CustomPagination
					pages={pages}
					pagesCount={pagesCount}
					currentPage={currentPage}
					isDisabled={isDisabled}
					onPageChange={handleChangePage}
				/>
			</VStack>
		</Body>
	);
}

export default Waifus;
