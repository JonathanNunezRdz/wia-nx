import { Box, Text } from '@chakra-ui/react';
import { CommonError } from '@wia-nx/types';

interface FormErrorMessageProps {
	error?: CommonError;
}

const FormErrorMessageWrapper = ({ error }: FormErrorMessageProps) => {
	if (typeof error === 'undefined') return null;
	const content =
		typeof error === 'object' ? (
			error.map((message) => <Text key={message}>{message}</Text>)
		) : (
			<Text>{error}</Text>
		);
	return <Box color='red.300'>{content}</Box>;
};

export default FormErrorMessageWrapper;
