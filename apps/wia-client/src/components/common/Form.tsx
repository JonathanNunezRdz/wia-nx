import { Box, VStack } from '@chakra-ui/react';
import type { FormEventHandler, ReactNode } from 'react';
import React from 'react';

interface FormProps {
	children: ReactNode;
	onSubmit: FormEventHandler<HTMLFormElement>;
}

const Form = ({ children, onSubmit }: FormProps) => {
	const childrenWithDisabled = React.Children.map(children, (child) => {
		if (React.isValidElement(child)) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			return React.cloneElement<any>(child, { isDisabled: false });
		}
	});

	return (
		<Box>
			<form onSubmit={onSubmit}>
				<VStack px='1.5rem' py='1rem' spacing='1rem'>
					{childrenWithDisabled}
				</VStack>
			</form>
		</Box>
	);
};

export default Form;
