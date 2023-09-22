'use client';
import { Link } from '@chakra-ui/next-js';
import { Box, Flex, Heading } from '@chakra-ui/react';
import HeaderLinks from './HeaderLinks';
import ThemeToggle from './ThemeToggle';

const links = ['media', 'waifus'];

function Header() {
	return (
		<Flex as='header' width='full' align='center'>
			<Heading as='h1' size='md'>
				<Link href='/'>wia</Link>
			</Heading>
			<Box ms='auto' alignItems='center' display='flex'>
				<HeaderLinks links={links} />
				<ThemeToggle />
			</Box>
		</Flex>
	);
}

export default Header;
