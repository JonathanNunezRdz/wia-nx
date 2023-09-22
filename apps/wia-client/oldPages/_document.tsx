import { ColorModeScript } from '@chakra-ui/color-mode';
import wiaTheme from '@wia-client/src/styles';
import Document, {
	DocumentContext,
	DocumentInitialProps,
	Html,
	Main,
	NextScript,
	Head,
} from 'next/document';

const APP_NAME = 'wia';

class MyDocument extends Document {
	static getInitialProps(
		ctx: DocumentContext
	): Promise<DocumentInitialProps> {
		return Document.getInitialProps(ctx);
	}
	render() {
		return (
			<Html>
				<Head>
					<link rel='shortcut icon' href='/favicon.ico' />
					<link rel='apple-touch-icon' href='/logo192.png' />
					<link rel='manifest' href='/manifest.json' />

					<meta name='application-name' content={APP_NAME} />
					<meta name='apple-mobile-web-app-capable' content='yes' />
					<meta
						name='apple-mobile-web-app-status-bar-style'
						content='default'
					/>
					<meta
						name='apple-mobile-web-app-title'
						content={APP_NAME}
					/>
					<meta name='format-detection' content='telephone=no' />
					<meta name='mobile-web-app-capable' content='yes' />
					<meta name='theme-color' content='#1A202C' />
				</Head>
				<body>
					<ColorModeScript
						initialColorMode={wiaTheme.config?.initialColorMode}
					/>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
