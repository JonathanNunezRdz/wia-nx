'use client';
import { Box, Heading } from '@chakra-ui/react';
import Body from '../../components/layout/Body';

function Home() {
	return (
		<Body v h>
			<Box textAlign='center'>
				<Heading as='h1'>welcome to the wia</Heading>
				<Heading as='h2' fontSize='xl' fontWeight='normal'>
					long live the waifus
				</Heading>
			</Box>
		</Body>
	);
}

export default Home;
