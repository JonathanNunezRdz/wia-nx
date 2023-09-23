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
import MediaCard from '@wia-client/src/oldPages/media/MediaCard';
import MediaFilterOptions from '@wia-client/src/oldPages/media/MediaFilterOptions';
import { selectAuth } from '@wia-client/src/store/auth/authReducer';
import { useAppDispatch, useAppSelector } from '@wia-client/src/store/hooks';
import { useGetMediaQuery } from '@wia-client/src/store/media';
import {
	changePage,
	selectMediaPage,
} from '@wia-client/src/store/media/mediaReducer';
import { useGetMeQuery } from '@wia-client/src/store/user';

function Media() {
	const dispatch = useAppDispatch();
	const { isLoggedIn } = useAppSelector(selectAuth);
	const user = useGetMeQuery(undefined, {
		skip: !isLoggedIn,
	});
	const { page, limit, type, users, title } = useAppSelector(selectMediaPage);

	const media = useGetMediaQuery({
		limit,
		page,
		type,
		users,
		title,
	});

	const { pages, pagesCount, currentPage, isDisabled, setCurrentPage } =
		usePagination({
			total: media.data?.totalMedias || 0,
			limits: {
				outer: 2,
				inner: 2,
			},
			initialState: {
				pageSize: limit,
				isDisabled: false,
				currentPage: page,
			},
		});

	const handleChangeFilters = (
		options: ReturnType<typeof selectMediaPage>
	) => {
		dispatch(changePage(options));
	};
	const handleChangePage = (nextPage: number) => {
		if (nextPage === page) return;
		if (nextPage < 1) return;
		if (nextPage > pagesCount) return;
		setCurrentPage(nextPage);
		handleChangeFilters({ page: nextPage, limit, type, users, title });
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	return (
		<Body h>
			<VStack w='full' spacing={4}>
				<Box w='full'>
					<HStack spacing={4}>
						<Heading as='h2'>media</Heading>
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
								onClick={() => media.refetch()}
								isLoading={media.isLoading || media.isFetching}
							/>
						</Box>
					</HStack>
					<MediaFilterOptions getMedia={handleChangeFilters} />
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
						{media.isSuccess && media.data.medias.length > 0 ? (
							media.data.medias.map((elem) => (
								<MediaCard
									key={elem.id}
									media={elem}
									ownId={user.data?.id || ''}
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
