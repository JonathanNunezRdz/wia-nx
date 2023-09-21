import { Lexend } from 'next/font/google';
import Chakra from '@wia-client/src/components/Chakra';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { Provider } from 'react-redux';
import { store } from '@wia-client/src/store';
import Layout from '@wia-client/src/components/layout';

const lexend = Lexend({ subsets: ['latin'] });

function CustomApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<style jsx global>
				{`
					:root {
						--font-lexend: ${lexend.style.fontFamily};
					}
				`}
			</style>
			<Chakra>
				<Head>
					<meta
						name='viewport'
						content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover'
					/>
					<title>welcome to the wia</title>
				</Head>
				<Provider store={store}>
					<Layout>
						<Component {...pageProps} />
					</Layout>
				</Provider>
			</Chakra>
		</>
	);
}

export default CustomApp;
