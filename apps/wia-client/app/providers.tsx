'use client';

import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider } from '@chakra-ui/react';
import { store } from '@wia-client/src/store';
import wiaTheme from '@wia-client/src/styles';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';

interface IProvidersProps {
	children: ReactNode;
}

function Providers({ children }: IProvidersProps) {
	return (
		<CacheProvider>
			<ChakraProvider theme={wiaTheme}>
				<Provider store={store}>{children}</Provider>
			</ChakraProvider>
		</CacheProvider>
	);
}

export default Providers;
