import { AddIcon, RepeatIcon } from '@chakra-ui/icons';
import { Box, IconButton, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import CustomPagination from '@wia-client/src/components/common/CustomPagination';
import LinkButton from '@wia-client/src/components/common/LinkButton';
import { Loading } from '@wia-client/src/components/common/Loading';
import PageTitle from '@wia-client/src/components/common/PageTitle';
import Body from '@wia-client/src/components/layout/Body';
import { useGetLoggedStatusQuery, useGetMeQuery } from '@wia-client/src/store';
import { useAppDispatch, useAppSelector } from '@wia-client/src/store/hooks';
import { useGetTradesQuery } from '@wia-client/src/store/trade/tradeApi';
import {
	changeTradePage,
	selectTradeFilter,
} from '@wia-client/src/store/trade/tradeReducer';
import { type GetTradesDto, type HttpError } from '@wia-nx/types';
import { NextSeo } from 'next-seo';
import { useCallback, useMemo } from 'react';
import TradeCard from './TradeCard';

function Trades() {
	// rtk hooks
	const dispatch = useAppDispatch();
	const loggedStatus = useGetLoggedStatusQuery();
	const userQuery = useGetMeQuery(undefined, {
		skip: !loggedStatus.isSuccess,
	});
	const appliedFilters = useAppSelector(selectTradeFilter);
	const tradeQuery = useGetTradesQuery(appliedFilters);

	const handleGetTrades = useCallback(
		(options: GetTradesDto) => {
			dispatch(changeTradePage(options.page));
		},
		[dispatch]
	);

	const mainContent = useMemo(() => {
		if (tradeQuery.isFetching) return <Loading />;
		if (tradeQuery.isSuccess) {
			if (tradeQuery.data.trades.length > 0) {
				return tradeQuery.data.trades.map((item) => (
					<TradeCard
						key={item.id}
						trade={item}
						ownId={userQuery.data?.id ?? ''}
					/>
				));
			}
			return (
				<Box>
					<Text>no trades have happened in the wia</Text>
				</Box>
			);
		}
		if (tradeQuery.isError) {
			if ('status' in tradeQuery.error) {
				const { status } = tradeQuery.error;
				if (status === 'FETCH_ERROR') {
					return (
						<Box>
							<Text>an error has ocurred, try again later</Text>
						</Box>
					);
				}
				const parsedError = tradeQuery.error.data as HttpError;
				return (
					<Box>
						<Text>
							{typeof parsedError.message === 'string'
								? parsedError.message
								: parsedError.message.join('\n')}
						</Text>
					</Box>
				);
			}
		}
		return <></>;
	}, [tradeQuery, userQuery]);

	return (
		<Body h>
			<NextSeo title='trades' />
			<VStack w='full' spacing={4}>
				<PageTitle title='trades'>
					{loggedStatus.isSuccess && (
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
							onClick={() => handleGetTrades(appliedFilters)}
							isLoading={tradeQuery.isFetching}
						/>
					</Box>
				</PageTitle>

				<CustomPagination
					totalItems={tradeQuery.data?.totalTrades || 0}
					handleGetData={handleGetTrades}
					filters={appliedFilters}
					isLoading={tradeQuery.isFetching}
				/>

				<Box w='full'>
					<SimpleGrid columns={{ sm: 2, md: 3 }} spacing={4}>
						{mainContent}
					</SimpleGrid>
				</Box>

				<CustomPagination
					totalItems={tradeQuery.data?.totalTrades || 0}
					handleGetData={handleGetTrades}
					filters={appliedFilters}
					isLoading={tradeQuery.isFetching}
				/>
			</VStack>
		</Body>
	);
}

export default Trades;
