import Layout from '@wia-client/src/components/layout';
// import { Lexend } from 'next/font/google';
import { ReactNode } from 'react';
import Providers from './providers';
import { Metadata } from 'next';

interface IRootLayoutProps {
	children: ReactNode;
}
// const lexend = Lexend({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'welcome to the wia',
	viewport: {
		minimumScale: 1,
		initialScale: 1,
		width: 'device-width',
		viewportFit: 'cover',
	},
	applicationName: 'wia',
	icons: [
		{ url: '/favicon.ico', rel: 'shortcut icon' },
		{ url: '/logo192.png', rel: 'apple-touch-icon' },
	],
	appleWebApp: {
		capable: true,
		statusBarStyle: 'default',
		title: 'wia',
	},
	formatDetection: {
		telephone: false,
	},
	manifest: '/manifest.json',
	themeColor: '#1A202C',
	colorScheme: 'dark',
	other: {
		'mobile-web-app-capable': 'yes',
	},
};

function RootLayout({ children }: IRootLayoutProps) {
	return (
		<html lang='en'>
			<body>
				{/* <style>
					{`
					:root {
						--font-lexend: ${lexend.style.fontFamily};
					}
				`}
				</style> */}
				<Providers>
					<Layout>{children}</Layout>
				</Providers>
			</body>
		</html>
	);
}

export default RootLayout;
