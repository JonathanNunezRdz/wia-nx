import { Text } from '@chakra-ui/react';
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
};

function CustomPagination<T extends WithFilters>({
	totalItems,
	handleGetData,
	filters,
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
		setCurrentPage(nextPage);
		handleGetData({ ...filters, page: nextPage });
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	return (
		<Pagination
			pagesCount={pagesCount}
			currentPage={currentPage}
			isDisabled={isDisabled}
			onPageChange={handleChangePage}
		>
			<PaginationContainer align='center' justify='space-between'>
				<PaginationPrevious>
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
						/>
					))}
				</PaginationPageGroup>
				<PaginationNext>
					<Text>Next</Text>
				</PaginationNext>
			</PaginationContainer>
		</Pagination>
	);
}

export default CustomPagination;
