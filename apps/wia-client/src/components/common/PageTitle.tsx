import { Box, HStack, Heading } from '@chakra-ui/react';
import { NextSeo } from 'next-seo';
import { ReactNode } from 'react';

interface PageTitleProps {
	title: string;
	children?: ReactNode;
}

const PageTitle = ({ title, children }: PageTitleProps) => {
	return (
		<Box w='full'>
			<NextSeo title={title} />
			<HStack alignItems='end'>
				<Heading>{title}</Heading>
				{children}
			</HStack>
		</Box>
	);
};

export default PageTitle;
