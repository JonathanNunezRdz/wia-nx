import { Link } from '@chakra-ui/next-js';
import { Box, Flex, Heading } from '@chakra-ui/react';
import HeaderLinks from './HeaderLinks';

const links = ['media', 'waifus', 'trades'];

function Header() {
	return (
		<Flex as='header' width='full' align='center'>
			<Heading as='h1' size='md'>
				<Link href='/'>wia</Link>
			</Heading>
			<Box ms='auto' alignItems='center' display='flex'>
				<HeaderLinks links={links} />
			</Box>
		</Flex>
	);
}

export default Header;
