import { Box, IconButton, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { AddIcon, RepeatIcon } from '@chakra-ui/icons';
import { useCallback, useEffect } from 'react';
import { usePagination } from '../../components/pagination';
import { GetMediaDto } from '@wia-nx/types';

import MediaCard from './MediaCard';
import MediaFilterOptions from './MediaFilterOptions';
import { useAppDispatch, useAppSelector } from '@wia-client/src/store/hooks';
import { selectAuth, selectUser } from '@wia-client/src/store/user';
import { selectMedia } from '@wia-client/src/store/media';
import { getMediasAction } from '@wia-client/src/store/media/actions';
import Body from '@wia-client/src/components/layout/Body';
import LinkButton from '@wia-client/src/components/common/LinkButton';
import CustomPagination from '@wia-client/src/components/common/CustomPagination';
import PageTitle from '@wia-client/src/components/common/PageTitle';

function Media() {
	// rtk hooks
	const dispatch = useAppDispatch();
	const { data: user } = useAppSelector(selectUser);
	const {
		totalMedias,
		appliedFilters,
		status,
		data: media,
	} = useAppSelector(selectMedia);
	const { isLoggedIn } = useAppSelector(selectAuth);

	// use-pagination
	const { pages, pagesCount, currentPage, isDisabled, setCurrentPage } =
		usePagination({
			total: totalMedias,
			limits: {
				outer: 2,
				inner: 2,
			},
			initialState: {
				pageSize: 9,
				isDisabled: false,
				currentPage: appliedFilters.page,
			},
		});

	// custom functions
	const handleGetMedia = useCallback(
		(options: GetMediaDto) => {
			setCurrentPage(options.page);
			dispatch(getMediasAction(options));
		},
		[dispatch, setCurrentPage]
	);
	const handleChangePage = (nextPage: number) => {
		if (nextPage === appliedFilters.page) return;
		if (nextPage < 1) return;
		if (nextPage > totalMedias) return;
		setCurrentPage(nextPage);
		handleGetMedia({ ...appliedFilters, page: nextPage });
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	// effects
	useEffect(() => {
		handleGetMedia(appliedFilters);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [handleGetMedia]);

	// render
	return (
		<Body h>
			<VStack w='full' spacing='4'>
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
							isLoading={status === 'loading'}
						/>
					</Box>
				</PageTitle>
				<Box w='full'>
					<MediaFilterOptions getMedia={handleGetMedia} />
				</Box>

				<CustomPagination
					pages={pages}
					pagesCount={pagesCount}
					currentPage={currentPage}
					isDisabled={isDisabled}
					onPageChange={handleChangePage}
				/>

				<Box w='full'>
					<SimpleGrid columns={{ sm: 2, md: 3 }} spacing='4'>
						{media.length > 0 ? (
							media.map((element) => (
								<MediaCard
									key={element.id}
									media={element}
									ownId={user.id}
									isLoggedIn={isLoggedIn}
								/>
							))
						) : (
							<Box>
								<Text>no media has been added to the wia</Text>
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

export default Media;
