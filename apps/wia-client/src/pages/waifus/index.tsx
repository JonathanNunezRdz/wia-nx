import { AddIcon, RepeatIcon } from '@chakra-ui/icons';
import { Box, IconButton, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { useCallback, useMemo } from 'react';

import CustomPagination from '@wia-client/src/components/common/CustomPagination';
import LinkButton from '@wia-client/src/components/common/LinkButton';
import { Loading } from '@wia-client/src/components/common/Loading';
import PageTitle from '@wia-client/src/components/common/PageTitle';
import Body from '@wia-client/src/components/layout/Body';
import {
	changeWaifuPage,
	selectAuth,
	selectWaifuFilter,
	useAppDispatch,
	useAppSelector,
	useGetAllWaifusQuery,
	useGetMeQuery,
} from '@wia-client/src/store';
import { GetAllWaifusDto, HttpError } from '@wia-nx/types';
import WaifuCard from './WaifuCard';
import WaifuFilterOptions from './WaifuFilterOptions';

function Waifus() {
	// rtk hooks
	const dispatch = useAppDispatch();
	const { isLoggedIn } = useAppSelector(selectAuth);
	const appliedFilters = useAppSelector(selectWaifuFilter);
	const userQuery = useGetMeQuery(undefined, { skip: !isLoggedIn });
	const waifuQuery = useGetAllWaifusQuery(appliedFilters);

	// functions
	const handleGetWaifus = useCallback(
		(options: GetAllWaifusDto) => {
			dispatch(changeWaifuPage(options));
		},
		[dispatch]
	);

	// effects

	// sub components
	const mainContent = useMemo(() => {
		if (waifuQuery.isFetching) return <Loading />;
		if (waifuQuery.isSuccess) {
			if (waifuQuery.data.waifus.length > 0)
				return waifuQuery.data.waifus.map((waifu) => (
					<WaifuCard
						key={waifu.id}
						waifu={waifu}
						ownId={userQuery.isSuccess ? userQuery.data.id : ''}
						isLoggedIn={isLoggedIn}
					/>
				));
			return (
				<Box>
					<Text>no waifus have been added to the wia</Text>
				</Box>
			);
		}
		if (waifuQuery.isError) {
			if ('status' in waifuQuery.error) {
				const { status } = waifuQuery.error;
				if (status === 'FETCH_ERROR')
					return (
						<Box>
							<Text>an error has ocurred, try again later</Text>
						</Box>
					);
				const parsedError = waifuQuery.error.data as HttpError;
				return (
					<Box>
						<Text>
							{typeof parsedError.message === 'string'
								? parsedError.message
								: parsedError.message.reduce(
										(prev, curr) => `${prev}${curr}\n`,
										''
								  )}
						</Text>
					</Box>
				);
			}
		}
		return <></>;
	}, [waifuQuery, userQuery, isLoggedIn]);

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
							isLoading={waifuQuery.isFetching}
						/>
					</Box>
				</PageTitle>
				<Box w='full'>
					<WaifuFilterOptions getWaifus={handleGetWaifus} />
				</Box>

				<CustomPagination
					totalItems={waifuQuery.data?.totalWaifus ?? 0}
					handleGetData={handleGetWaifus}
					filters={appliedFilters}
					isLoading={waifuQuery.isFetching}
				/>

				<Box w='full'>
					<SimpleGrid columns={{ sm: 2, md: 3 }} spacing={4}>
						{mainContent}
					</SimpleGrid>
				</Box>

				<CustomPagination
					totalItems={waifuQuery.data?.totalWaifus ?? 0}
					handleGetData={handleGetWaifus}
					filters={appliedFilters}
					isLoading={waifuQuery.isFetching}
				/>
			</VStack>
		</Body>
	);
}

export default Waifus;
