import {
	Button,
	ButtonProps,
	Flex,
	FlexProps,
	Icon,
	IconProps,
	Stack,
	StackProps,
} from '@chakra-ui/react';
import union from 'lodash/union';
import {
	Dispatch,
	ReactNode,
	SetStateAction,
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
	MouseEvent,
	ReactElement,
	Children,
	cloneElement,
} from 'react';
import { IconType } from 'react-icons';

function isDecimalNumber(n: number) {
	return n - Math.floor(n) !== 0;
}

function getFirstItem<T>(array: T[]): T {
	return array[0];
}
function getLastItem<T>(array: T[]): T {
	return array.slice(-1)[0];
}

function generatePages({
	pagesCount,
	innerLimit,
	outerLimit,
	currentPage,
}: {
	pagesCount?: number;
	innerLimit: number;
	outerLimit: number;
	currentPage: number;
}) {
	if (typeof pagesCount === 'undefined' || pagesCount === null) return [];
	const allPages = Array.from({ length: pagesCount }, (v, i) => i + 1);

	if (innerLimit === 0 || outerLimit === 0) return allPages;

	const outerLeftPages = allPages.slice(0, outerLimit);
	const outerRightPages = allPages.slice(1).slice(-outerLimit);

	const lastPageOfOuterLeftPages = getLastItem(outerLeftPages);
	const firstPageOfOuterRightPages = getFirstItem(outerRightPages);

	const generateRightInnerPages = (): number[] => {
		const rightInnerLastIndex = currentPage + innerLimit;
		const isAfterFirstOuterRightPage =
			rightInnerLastIndex > firstPageOfOuterRightPages;

		return isAfterFirstOuterRightPage
			? allPages.slice(currentPage + 1, firstPageOfOuterRightPages)
			: allPages.slice(currentPage, rightInnerLastIndex);
	};

	const generateLeftInnerPages = (): number[] => {
		const leftInnerFirstIndex = currentPage - innerLimit;
		const isBeforeLastOuterLeftPage =
			leftInnerFirstIndex < lastPageOfOuterLeftPages;

		return isBeforeLastOuterLeftPage
			? allPages.slice(lastPageOfOuterLeftPages, currentPage - 1)
			: allPages.slice(leftInnerFirstIndex - 1, currentPage - 1);
	};

	const leftInnerPages = generateLeftInnerPages();
	const leftPages = union([...outerLeftPages], [...leftInnerPages]);
	const shouldHaveLeftSeparator =
		getFirstItem(leftInnerPages) > lastPageOfOuterLeftPages + 1;

	const rightInnerPages = generateRightInnerPages();
	const rightPages = union([...rightInnerPages], [...outerRightPages]);
	const shouldHaveRightSeparator =
		getLastItem(rightInnerPages) < firstPageOfOuterRightPages - 1;

	const unduplicatedPages = union(
		[...leftPages],
		[currentPage],
		[...rightPages]
	);

	const addSeparators = (pages: number[]): number[] =>
		pages.reduce<number[]>((acc: number[], page: number) => {
			const checkPageForSeparator = (): number[] => {
				if (
					page === lastPageOfOuterLeftPages &&
					shouldHaveLeftSeparator
				) {
					return [lastPageOfOuterLeftPages, 0];
				}

				if (
					page === firstPageOfOuterRightPages &&
					shouldHaveRightSeparator
				) {
					return [-1, firstPageOfOuterRightPages];
				}

				return [page];
			};

			return [...acc, ...checkPageForSeparator()];
		}, []);

	const pages = addSeparators(unduplicatedPages);

	return pages;
}

export interface IPaginationProps {
	children?: ReactNode;
	pagesCount: number;
	isDisabled?: boolean;
	currentPage: number;
	onPageChange: (page: number) => void;
}

export function Pagination({
	children,
	pagesCount,
	isDisabled = false,
	currentPage = 1,
	onPageChange,
}: IPaginationProps) {
	return (
		<PaginationProvider
			currentPage={currentPage}
			isDisabled={isDisabled}
			onPageChange={onPageChange}
			pagesCount={pagesCount}
		>
			{children}
		</PaginationProvider>
	);
}

interface IPaginationProviderProps {
	children?: ReactNode;
	isDisabled: boolean;
	pagesCount: number;
	currentPage: number;
	onPageChange: (page: number) => void;
}

function PaginationProvider({
	children,
	onPageChange,
	pagesCount: pagesCountProp,
	currentPage: currentPageProp,
	isDisabled: isDisabledProp,
}: IPaginationProviderProps) {
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [isDisabled, setIsDisabled] = useState<boolean>(false);
	const [pagesCount, setPagesCount] = useState<number>(0);

	useEffect(() => {
		setIsDisabled(isDisabledProp);
	}, [isDisabledProp]);

	useEffect(() => {
		setPagesCount(pagesCountProp);
	}, [pagesCountProp]);

	useEffect(() => {
		if (currentPageProp !== null && currentPageProp !== currentPage) {
			setCurrentPage(currentPageProp);
		}
	}, [currentPage, currentPageProp]);

	const changePage = (page: number) => {
		setCurrentPage(page);
		onPageChange(page);
	};

	const state = {
		currentPage,
		pagesCount,
		isDisabled,
	};

	const actions = {
		setCurrentPage,
		setIsDisabled,
		changePage,
	};

	return (
		<PaginationContext.Provider value={{ state, actions }}>
			{children}
		</PaginationContext.Provider>
	);
}

type PaginationContextValues = {
	state: {
		isDisabled: boolean;
		pagesCount: number;
		currentPage: number;
	};
	actions: {
		setCurrentPage: Dispatch<SetStateAction<number>>;
		setIsDisabled: Dispatch<SetStateAction<boolean>>;
		changePage: (page: number) => void;
	};
};

const PaginationContext = createContext<PaginationContextValues>({
	state: {
		currentPage: 1,
		isDisabled: false,
		pagesCount: 0,
	},
	actions: {
		setCurrentPage: () => null,
		setIsDisabled: () => null,
		changePage: () => null,
	},
});

export function PaginationContainer({ children, ...flexProps }: FlexProps) {
	return (
		<Flex
			aria-label='pagination navigation'
			as='nav'
			className='pagination-container'
			{...flexProps}
		>
			{children}
		</Flex>
	);
}

function usePaginationContext() {
	return useContext(PaginationContext);
}

export function PaginationPrevious({
	children,
	isDisabled: isDisabledProp,
	...buttonProps
}: ButtonProps) {
	const { state, actions } = usePaginationContext();
	const { changePage } = actions;
	const { currentPage, isDisabled: isDisabledGlobal } = state;

	const isFirst = useMemo(() => currentPage === 1, [currentPage]);
	const isDisabled = useMemo(
		() => isFirst || (isDisabledProp ?? isDisabledGlobal),
		[isFirst, isDisabledProp, isDisabledGlobal]
	);
	const allProps = useMemo(
		() => ({
			...buttonProps,
			isDisabled,
		}),
		[buttonProps, isDisabled]
	);

	const getPreviousProps = ({
		onClick,
		isDisabled,
		...props
	}: ButtonProps) => ({
		...props,
		'aria-label': 'Previuos page',
		'aria-disabled': isDisabled,
		isDisabled,
		onClick: (event: MouseEvent<HTMLButtonElement>) => {
			if (!isDisabled) {
				onClick?.(event);
			}
			handlePreviuosClick();
		},
	});

	const handlePreviuosClick = () => {
		if (!isFirst) changePage(currentPage - 1);
	};

	return (
		<Button className='pagination-previous' {...getPreviousProps(allProps)}>
			{children}
		</Button>
	);
}

interface IPaginationPageGroupProps {
	separator?: ReactElement;
}

export function PaginationPageGroup({
	children,
	separator,
	...stackProps
}: IPaginationPageGroupProps & StackProps) {
	return (
		<Stack
			direction='row'
			as='ol'
			className='pagination-page-group'
			spacing={1}
			{...stackProps}
		>
			{Children.map(children, (child) => {
				if (child === null || typeof child === 'undefined') return;

				return cloneElement(child as ReactElement, { separator });
			})}
		</Stack>
	);
}

type SeparatorPosition = 'left' | 'right';

interface ISeparatorProps {
	hoverIcon?: IconType;
	jumpSize?: number;
	isDisabled?: boolean;
	separatorPosition?: SeparatorPosition;
}

const separatorStyles: ButtonProps = {
	cursor: 'pointer',
	minW: 'auto',
	justifyContent: 'center',
	pos: 'relative',
	alignItems: 'center',
	bg: 'transparent',
	px: 1,
	sx: {
		_hover: {
			'.call-to-action': {
				opacity: 1,
			},
		},
	},
};

const separatorIconStyles: IconProps = {
	h: 4,
	w: 4,
	bg: 'inherit',
	color: 'inherit',
};

const separatorTransitionStyles: IconProps = {
	m: 'auto',
	pos: 'absolute',
	top: 0,
	left: 0,
	right: 0,
	bottom: 0,
	opacity: 0,
	transition: 'all  cubic-bezier(0.4, 1, 0.9, 0.6) 0.3s',
};

export function PaginationSeparator({
	hoverIcon,
	separatorPosition,
	isDisabled: isDisabledProp,
	jumpSize = 4,
	...buttonProps
}: ISeparatorProps & ButtonProps) {
	// provider
	const { actions, state } = usePaginationContext();
	const { currentPage, pagesCount, isDisabled: isDisabledGlobal } = state;
	const { changePage } = actions;

	// methods
	const getPageToJump = (separatorPosition?: SeparatorPosition): number => {
		if (separatorPosition === 'left') return currentPage - jumpSize;
		if (separatorPosition === 'right') return currentPage + jumpSize;

		return 0;
	};

	const determineJumpAllowance = (
		separatorPosition?: SeparatorPosition
	): boolean => {
		if (separatorPosition === 'left') {
			return currentPage - jumpSize > 0;
		}

		if (separatorPosition === 'right') {
			return currentPage + jumpSize < pagesCount + 1;
		}

		return false;
	};

	const getSeparatorProps = ({
		onClick,
		...props
	}: ButtonProps): ButtonProps => ({
		...props,
		'aria-label': `Jump pages ${jumpingDirectionLabel}`,
		'aria-disabled': isDisabled,
		onClick: (event: MouseEvent<HTMLButtonElement>) => {
			if (!isDisabled) {
				onClick?.(event);
			}

			handleJumpClick();
		},
	});

	// constants
	const canJump = determineJumpAllowance(separatorPosition);

	// memos
	const isDisabled = useMemo(
		() => !canJump || (isDisabledProp ?? isDisabledGlobal),
		[canJump, isDisabledProp, isDisabledGlobal]
	);

	const jumpingDirectionLabel = useMemo(
		() => (separatorPosition === 'left' ? 'backwards' : 'forward'),
		[separatorPosition]
	);

	const allProps = useMemo(
		() => ({
			...separatorStyles,
			...buttonProps,
		}),
		[buttonProps]
	);

	// handlers
	const handleJumpClick = (): void => {
		if (isDisabled) return;

		const pageToJump = getPageToJump(separatorPosition);

		changePage(pageToJump);
	};

	return (
		<Flex as='li'>
			<Button
				className='pagination-separator'
				{...getSeparatorProps(allProps)}
			>
				<Icon as={FiMoreHorizontal} {...separatorIconStyles} />
				<Icon
					as={hoverIcon}
					className='call-to-action'
					{...separatorIconStyles}
					{...separatorTransitionStyles}
				/>
			</Button>
		</Flex>
	);
}

const FiMoreHorizontal: IconType = ({ ...svgProps }) => (
	<svg
		fill='none'
		height='24'
		stroke='currentColor'
		strokeLinecap='round'
		strokeLinejoin='round'
		strokeWidth='2'
		viewBox='0 0 24 24'
		width='24'
		{...svgProps}
	>
		<circle cx='12' cy='12' r='1' />
		<circle cx='19' cy='12' r='1' />
		<circle cx='5' cy='12' r='1' />
	</svg>
);

const FiChevronLeft: IconType = (svgProps) => (
	<svg
		fill='none'
		height='24'
		stroke='currentColor'
		strokeLinecap='round'
		strokeLinejoin='round'
		strokeWidth='2'
		viewBox='0 0 24 24'
		width='24'
		{...svgProps}
	>
		<polyline points='15 18 9 12 15 6' />
	</svg>
);

const FiChevronRight: IconType = (svgProps) => (
	<svg
		fill='none'
		height='24'
		stroke='currentColor'
		strokeLinecap='round'
		strokeLinejoin='round'
		strokeWidth='2'
		viewBox='0 0 24 24'
		width='24'
		{...svgProps}
	>
		<polyline points='9 18 15 12 9 6' />
	</svg>
);

interface IPageProps {
	page: number;
	separator?: ReactElement<ButtonProps>;
	_current?: ButtonProps;
}

const ButtonStyles: ButtonProps = {
	minW: 'auto',
	px: 1,
	cursor: 'pointer',
};

export function PaginationPage({
	page,
	isDisabled: isDisabledProp,
	separator,
	_current = {},
	...buttonProps
}: IPageProps & ButtonProps) {
	// provider
	const { actions, state } = usePaginationContext();
	const { changePage } = actions;
	const { currentPage, isDisabled: isDisabledGlobal } = state;

	// methods
	const getPageProps = ({
		onClick,
		isDisabled,
		...props
	}: ButtonProps): ButtonProps => ({
		...props,
		'aria-disabled': isDisabled,
		'aria-current': isCurrent,
		'aria-label': pageLabel,
		isDisabled,
		onClick: (event: MouseEvent<HTMLButtonElement>) => {
			if (!isDisabled) {
				onClick?.(event);
			}

			changePage(page);
		},
	});

	// memos
	const isCurrent = useMemo(() => currentPage === page, [currentPage, page]);
	const isDisabled = useMemo(
		() => isDisabledProp ?? isDisabledGlobal,
		[isDisabledGlobal, isDisabledProp]
	);
	const isSeparatorDisabled = useMemo(
		() => separator?.props?.isDisabled ?? isDisabledGlobal,
		[isDisabledGlobal, separator?.props?.isDisabled]
	);
	const currentStyles = useMemo(
		() => (isCurrent ? _current : {}),
		[isCurrent, _current]
	);
	const isLeftSeparator = useMemo(() => page === 0, [page]);
	const isRightSeparator = useMemo(() => page === -1, [page]);
	const pageLabel = useMemo(
		() => (isCurrent ? `Current page, page ${page}` : `Go to page ${page}`),
		[isCurrent, page]
	);
	const allProps = useMemo(
		() => ({
			...ButtonStyles,
			...buttonProps,
			...currentStyles,
			isDisabled,
		}),
		[buttonProps, currentStyles, isDisabled]
	);

	if (isLeftSeparator) {
		return (
			<PaginationSeparator
				hoverIcon={FiChevronLeft}
				isDisabled={isSeparatorDisabled}
				separatorPosition='left'
				{...(separator?.props ?? {})}
			/>
		);
	}

	if (isRightSeparator) {
		return (
			<PaginationSeparator
				hoverIcon={FiChevronRight}
				isDisabled={isSeparatorDisabled}
				separatorPosition='right'
				{...(separator?.props ?? {})}
			/>
		);
	}

	return (
		<Flex as='li'>
			<Button className='pagination-page' {...getPageProps(allProps)}>
				{page}
			</Button>
		</Flex>
	);
}

export function PaginationNext({
	children,
	isDisabled: isDisabledProp,
	...buttonProps
}: ButtonProps) {
	// provider
	const { actions, state } = useContext(PaginationContext);
	const { changePage } = actions;
	const { currentPage, pagesCount, isDisabled: isDisabledGlobal } = state;

	// memos
	const isLast = useMemo(
		() => currentPage > pagesCount - 1,
		[currentPage, pagesCount]
	);
	const isDisabled = useMemo(
		() => isLast || (isDisabledProp ?? isDisabledGlobal),
		[isLast, isDisabledProp, isDisabledGlobal]
	);
	const allProps = useMemo(
		() => ({
			...buttonProps,
			isDisabled,
		}),
		[buttonProps, isDisabled]
	);

	// methods
	const getNextProps = ({
		onClick,
		isDisabled,
		...props
	}: ButtonProps): ButtonProps => ({
		...props,
		'aria-label': 'Next page',
		'aria-disabled': isDisabled,
		isDisabled,
		onClick: (event: MouseEvent<HTMLButtonElement>) => {
			if (!isDisabled) {
				onClick?.(event);
			}

			handleNextClick();
		},
	});

	// handlers
	const handleNextClick = (): void => {
		if (!isLast) changePage(currentPage + 1);
	};

	return (
		<Button className='pagination-next' {...getNextProps(allProps)}>
			{children}
		</Button>
	);
}

type PaginationInitialState = {
	currentPage: number;
	pageSize?: number;
	isDisabled?: boolean;
};

type PaginationLimits = {
	inner: number;
	outer: number;
};

interface IUsePagination {
	initialState: PaginationInitialState;
	total?: number;
	pagesCount?: number;
	limits?: PaginationLimits;
}

export function usePagination({
	total,
	initialState,
	pagesCount: pagesCountProp,
	limits,
}: IUsePagination): {
	offset: number;
	pages: number[];
	pagesCount: number;
	currentPage: number;
	pageSize: number;
	isDisabled: boolean;
	setPageSize: Dispatch<SetStateAction<number>>;
	setIsDisabled: Dispatch<SetStateAction<boolean>>;
	setCurrentPage: Dispatch<SetStateAction<number>>;
} {
	// states
	const [pageSize, setPageSize] = useState<number>(
		initialState.pageSize ?? 0
	);
	const [currentPage, setCurrentPage] = useState<number>(
		initialState.currentPage
	);
	const [isDisabled, setIsDisabled] = useState<boolean>(
		initialState.isDisabled ?? false
	);

	// memos
	const innerLimit = useMemo(() => limits?.inner ?? 0, [limits]);
	const outerLimit = useMemo(() => limits?.outer ?? 0, [limits]);

	const offset = useMemo(() => {
		if (pageSize == null) {
			return 0;
		}

		return currentPage * pageSize - pageSize;
	}, [currentPage, pageSize]);

	const pagesCount = useMemo(() => {
		if (pagesCountProp != null) {
			return pagesCountProp;
		}

		if (total == null || pageSize == null) {
			return 0;
		}

		return Math.ceil(total / pageSize);
	}, [total, pageSize, pagesCountProp]);

	const pages = useMemo(
		() =>
			generatePages({
				currentPage,
				innerLimit,
				outerLimit,
				pagesCount,
			}),
		[currentPage, innerLimit, outerLimit, pagesCount]
	);

	//effects
	useEffect(() => {
		if (innerLimit !== null && isDecimalNumber(innerLimit)) {
			console.error('pagination inner limit must be an integer');
		}
		if (outerLimit !== null && isDecimalNumber(outerLimit)) {
			console.error('pagination outer limit must be an integer');
		}
	}, [innerLimit, outerLimit]);

	return {
		offset,
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
		isDisabled,
		setIsDisabled,
		pages,
		pagesCount,
	};
}
