import { Theme } from '@chakra-ui/theme';
import { DeepPartial } from '@chakra-ui/theme-utils';

const extendedColors: DeepPartial<
	Record<string, Theme['colors']['blackAlpha']>
> = {
	brand: {
		100: '',
		200: '',
		300: '',
		400: '',
		500: '',
		600: '',
		700: '',
		800: '',
		900: '',
	},
};

const overrideChakraColors: DeepPartial<Theme['colors']> = {};

const colors = {
	...extendedColors,
	...overrideChakraColors,
};

export default colors;
