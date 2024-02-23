import { AddIcon, RepeatIcon } from '@chakra-ui/icons';
import { Box, IconButton, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import CustomPagination from '@wia-client/src/components/common/CustomPagination';
import LinkButton from '@wia-client/src/components/common/LinkButton';
import PageTitle from '@wia-client/src/components/common/PageTitle';
import Body from '@wia-client/src/components/layout/Body';
import { usePagination } from '@wia-client/src/components/pagination';
import { useAppDispatch, useAppSelector } from '@wia-client/src/store/hooks';
import { selectTrades } from '@wia-client/src/store/trade';
import { getTradesAction } from '@wia-client/src/store/trade/actions';
import { selectAuth, selectUser } from '@wia-client/src/store/user';
import { GetTradesDto } from '@wia-nx/types';
import { NextSeo } from 'next-seo';
import { useCallback, useEffect } from 'react';
import TradeCard from './TradeCard';

function Trades() {
	// rtk hooks
	const dispatch = useAppDispatch();
	const { isLoggedIn } = useAppSelector(selectAuth);
	const { data: user } = useAppSelector(selectUser);
	const trades = useAppSelector(selectTrades);

	const { pages, pagesCount, currentPage, isDisabled, setCurrentPage } =
		usePagination({
			total: trades.totalTrades,
			limits: {
				inner: 2,
				outer: 2,
			},
			initialState: {
				pageSize: 9,
				isDisabled: false,
				currentPage: trades.appliedFilters.page,
			},
		});

	const handleGetTrades = useCallback(
		(options: GetTradesDto) => {
			setCurrentPage(options.page);
			dispatch(getTradesAction(options));
		},
		[dispatch, setCurrentPage]
	);

	const handleChangePage = (nextPage: number) => {
		if (nextPage === trades.appliedFilters.page) return;
		if (nextPage < 1 || nextPage > pagesCount) return;
		handleGetTrades({ ...trades.appliedFilters, page: nextPage });
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	useEffect(() => {
		handleGetTrades(trades.appliedFilters);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [handleGetTrades]);

	return (
		<Body h>
			<NextSeo title='trades' />
			<VStack w='full' spacing={4}>
				<PageTitle title='trades'>
					{isLoggedIn && (
						<LinkButton
							pathname='/trades/add'
							iconButtonProps={{
								'aria-label': 'add trade',
								icon: <AddIcon />,
								size: 'sm',
								mt: 1,
							}}
						/>
					)}
					<Box>
						<IconButton
							aria-label='refresh trades'
							icon={<RepeatIcon />}
							size='sm'
							mt={1}
							onClick={() =>
								handleGetTrades(trades.appliedFilters)
							}
							isLoading={trades.status === 'loading'}
						/>
					</Box>
				</PageTitle>

				<CustomPagination
					pages={pages}
					pagesCount={pagesCount}
					currentPage={currentPage}
					isDisabled={isDisabled}
					onPageChange={handleChangePage}
				/>

				<Box w='full'>
					<SimpleGrid columns={{ sm: 2, md: 3 }} spacing={4}>
						{trades.status === 'succeeded' ? (
							trades.data.length > 0 ? (
								trades.data.map((trade) => (
									<TradeCard
										key={trade.id}
										trade={trade}
										ownId={user.id}
									/>
								))
							) : (
								<Box>
									<Text>
										no trades have benn added to the wia
									</Text>
								</Box>
							)
						) : (
							<Box>
								<Text>
									{typeof trades.error !== 'undefined'
										? typeof trades.error.message ===
										  'string'
											? trades.error.message
											: trades.error.message.join(' | ')
										: 'Internal server error'}
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

export default Trades;
