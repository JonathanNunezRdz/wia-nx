import { AddIcon, RepeatIcon } from '@chakra-ui/icons';
import { Box, IconButton, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { useCallback, useMemo } from 'react';

import CustomPagination from '@wia-client/src/components/common/CustomPagination';
import LinkButton from '@wia-client/src/components/common/LinkButton';
import Loading from '@wia-client/src/components/common/Loading';
import PageTitle from '@wia-client/src/components/common/PageTitle';
import Body from '@wia-client/src/components/layout/Body';
import {
	changeMediaPage,
	selectAuth,
	selectMediaFilter,
	useAppDispatch,
	useAppSelector,
	useGetMeQuery,
	useGetMediaQuery,
} from '@wia-client/src/store';
import { GetMediaDto, HttpError } from '@wia-nx/types';
import MediaCard from './MediaCard';
import MediaFilterOptions from './MediaFilterOptions';

function Media() {
	// rtk hooks
	const dispatch = useAppDispatch();
	const { isLoggedIn } = useAppSelector(selectAuth);
	const appliedFilters = useAppSelector(selectMediaFilter);
	const user = useGetMeQuery(undefined, {
		skip: !isLoggedIn,
	});
	const mediaQuery = useGetMediaQuery(appliedFilters);

	// custom functions
	const handleGetMedia = useCallback(
		(options: GetMediaDto) => {
			dispatch(changeMediaPage(options));
		},
		[dispatch]
	);

	// effects

	// sub components
	const mainContent = useMemo(() => {
		if (mediaQuery.isFetching) return <Loading />;
		if (mediaQuery.isSuccess) {
			if (mediaQuery.data.medias.length > 0)
				return mediaQuery.data.medias.map((elem) => (
					<MediaCard
						key={elem.id}
						media={elem}
						ownId={user.isSuccess ? user.data.id : ''}
						isLoggedIn={isLoggedIn}
					/>
				));
			return (
				<Box>
					<Text>no media has been added to the wia</Text>
				</Box>
			);
		}
		if (mediaQuery.isError) {
			if ('status' in mediaQuery.error) {
				const { status } = mediaQuery.error;
				if (status === 'FETCH_ERROR')
					return (
						<Box>
							<Text>an error has ocurred, try again later</Text>
						</Box>
					);
				const parsedError = mediaQuery.error.data as HttpError;
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
	}, [mediaQuery, user, isLoggedIn]);

	// render
	return (
		<Body h>
			<VStack w='full' spacing={4}>
				<PageTitle title='media'>
					{isLoggedIn && (
						<LinkButton
							pathname='/media/add'
							iconButtonProps={{
								'aria-label': 'add media',
								icon: <AddIcon />,
								size: 'sm',
								mt: 1,
							}}
						/>
					)}
					<Box>
						<IconButton
							aria-label='refresh media'
							icon={<RepeatIcon />}
							size='sm'
							mt={1}
							onClick={() => handleGetMedia(appliedFilters)}
							isLoading={mediaQuery.isFetching}
						/>
					</Box>
				</PageTitle>
				<Box w='full'>
					<MediaFilterOptions getMedia={handleGetMedia} />
				</Box>

				<CustomPagination
					totalItems={mediaQuery.data?.totalMedias || 0}
					handleGetData={handleGetMedia}
					filters={appliedFilters}
					isLoading={mediaQuery.isFetching}
				/>

				<Box w='full'>
					<SimpleGrid columns={{ sm: 2, md: 3 }} spacing={4}>
						{mainContent}
					</SimpleGrid>
				</Box>

				<CustomPagination
					totalItems={mediaQuery.data?.totalMedias || 0}
					handleGetData={handleGetMedia}
					filters={appliedFilters}
					isLoading={mediaQuery.isFetching}
				/>
			</VStack>
		</Body>
	);
}

export default Media;
