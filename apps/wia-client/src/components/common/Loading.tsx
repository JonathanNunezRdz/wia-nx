import { Box, BoxProps, Spinner } from '@chakra-ui/react';

type LoadingProps = BoxProps;

export function Loading({ ...props }: LoadingProps) {
	return (
		<Box key='image-loading' {...props}>
			<Spinner />
		</Box>
	);
}
