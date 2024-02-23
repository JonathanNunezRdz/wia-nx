import { AddIcon, RepeatIcon } from '@chakra-ui/icons';
import { Box, IconButton, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import CustomPagination from '@wia-client/src/components/common/CustomPagination';
import LinkButton from '@wia-client/src/components/common/LinkButton';
import Body from '@wia-client/src/components/layout/Body';
import { useAppDispatch, useAppSelector } from '@wia-client/src/store/hooks';
import { selectAuth, selectUser } from '@wia-client/src/store/user';
import { selectWaifus } from '@wia-client/src/store/waifu';
import { getAllWaifusAction } from '@wia-client/src/store/waifu/actions';
import { GetAllWaifusDto } from '@wia-nx/types';
import { useCallback, useEffect } from 'react';

import WaifuCard from './WaifuCard';
import WaifuFilterOptions from './WaifuFilterOptions';
import { usePagination } from '@wia-client/src/components/pagination';
import PageTitle from '@wia-client/src/components/common/PageTitle';

function Waifus() {
	// rtk hooks
	const dispatch = useAppDispatch();
	const { data: user } = useAppSelector(selectUser);
	const {
		data: waifus,
		status: getWaifuStatus,
		totalWaifus,
		appliedFilters,
	} = useAppSelector(selectWaifus);
	const { isLoggedIn } = useAppSelector(selectAuth);

	// use-pagination hook
	const { pages, pagesCount, currentPage, isDisabled, setCurrentPage } =
		usePagination({
			total: totalWaifus,
			limits: {
				inner: 2,
				outer: 2,
			},
			initialState: {
				pageSize: 9,
				isDisabled: false,
				currentPage: appliedFilters.page,
			},
		});

	// functions
	const handleGetWaifus = useCallback(
		(options: GetAllWaifusDto) => {
			setCurrentPage(options.page);
			dispatch(getAllWaifusAction(options));
		},
		[dispatch, setCurrentPage]
	);

	const handleChangePage = (nextPage: number) => {
		if (nextPage === appliedFilters.page) return;
		if (nextPage < 1 || nextPage > pagesCount) return;
		handleGetWaifus({ ...appliedFilters, page: nextPage });
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	// react hooks
	useEffect(() => {
		handleGetWaifus(appliedFilters);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [handleGetWaifus]);

	// render
	return (
		<Body h>
			<VStack w='full' spacing={4}>
				<PageTitle title='waifus'>
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
							aria-label='refresh waifus'
							icon={<RepeatIcon />}
							size='sm'
							mt={1}
							onClick={() => handleGetWaifus(appliedFilters)}
							isLoading={getWaifuStatus === 'loading'}
						/>
					</Box>
				</PageTitle>
				<Box w='full'>
					<WaifuFilterOptions getWaifus={handleGetWaifus} />
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
						{waifus.length > 0 ? (
							waifus.map((element) => (
								<WaifuCard
									key={element.id}
									waifu={element}
									ownId={user.id}
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
