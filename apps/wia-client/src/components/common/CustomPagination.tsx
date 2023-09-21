import { Text } from '@chakra-ui/react';
import {
	IPaginationProps,
	Pagination,
	PaginationContainer,
	PaginationNext,
	PaginationPage,
	PaginationPageGroup,
	PaginationPrevious,
	PaginationSeparator,
} from '../pagination';

interface CustomPaginationProps extends IPaginationProps {
	pages: number[];
}

const CustomPagination = ({
	pagesCount,
	currentPage,
	isDisabled,
	onPageChange,
	pages,
}: CustomPaginationProps) => {
	return (
		<Pagination
			pagesCount={pagesCount}
			currentPage={currentPage}
			isDisabled={isDisabled}
			onPageChange={onPageChange}
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
};

export default CustomPagination;
