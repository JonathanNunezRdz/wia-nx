import { ChakraProvider } from '@chakra-ui/react';
import { ReactNode } from 'react';
import wiaTheme from '../styles';

interface IChakraProps {
	children: ReactNode;
}

function Chakra({ children }: IChakraProps) {
	return <ChakraProvider theme={wiaTheme}>{children}</ChakraProvider>;
}

export default Chakra;
