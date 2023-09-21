import { extendTheme } from '@chakra-ui/theme-utils';
import colors from './colors';
import { Button } from './components';
import config from './config';
import fonts from './fonts';

const wiaTheme = extendTheme({
	colors,
	fonts,
	config,
	components: {
		Button,
	},
});

export default wiaTheme;
