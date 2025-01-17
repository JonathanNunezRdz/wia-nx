import { Text } from '@chakra-ui/react';
import { useEffect } from 'react';
import {
	Pagination,
	PaginationContainer,
	PaginationNext,
	PaginationPage,
	PaginationPageGroup,
	PaginationPrevious,
	PaginationSeparator,
	usePagination,
} from '../pagination';

type WithFilters = { page: number; limit: number };

type CustomPaginationProps<T extends WithFilters> = {
	totalItems: number;
	handleGetData: (args: T) => void;
	filters: T;
	isLoading: boolean;
};

function CustomPagination<T extends WithFilters>({
	totalItems,
	handleGetData,
	filters,
	isLoading,
}: CustomPaginationProps<T>) {
	// pagination hook
	const { pages, pagesCount, currentPage, isDisabled, setCurrentPage } =
		usePagination({
			total: totalItems,
			limits: {
				inner: 2,
				outer: 2,
			},
			initialState: {
				pageSize: filters.limit,
				isDisabled: false,
				currentPage: filters.page,
			},
		});

	const handleChangePage = (nextPage: number) => {
		if (nextPage === filters.page) return;
		if (nextPage < 1 || nextPage > pagesCount) return;
		handleGetData({ ...filters, page: nextPage });
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	useEffect(() => {
		setCurrentPage(filters.page);
	}, [filters.page]);

	return (
		<Pagination
			pagesCount={pagesCount}
			currentPage={currentPage}
			isDisabled={isDisabled || isLoading}
			onPageChange={handleChangePage}
		>
			<PaginationContainer align='center' justify='space-between'>
				<PaginationPrevious isLoading={isLoading}>
					<Text>Previous</Text>
				</PaginationPrevious>
				<PaginationPageGroup
					mx='1'
					isInline
					align='center'
					separator={<PaginationSeparator />}
				>
					{pages.map((page) => (
						<PaginationPage
							key={`pagination_page_${page}`}
							page={page}
							_current={{
								bg: 'green.300',
							}}
							isLoading={isLoading}
						/>
					))}
				</PaginationPageGroup>
				<PaginationNext isLoading={isLoading}>
					<Text>Next</Text>
				</PaginationNext>
			</PaginationContainer>
		</Pagination>
	);
}

export default CustomPagination;
