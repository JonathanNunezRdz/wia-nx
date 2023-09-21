import {
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
} from '@chakra-ui/react';
import { ChangeEventHandler, FocusEventHandler } from 'react';

interface NameInputProps {
	name: string;
	onChange: ChangeEventHandler<HTMLInputElement>;
	onBlur: FocusEventHandler<HTMLInputElement>;
	isInvalid: boolean;
	error: string;
	isDisabled?: boolean;
}

const NameInput = ({
	name,
	onChange,
	isInvalid,
	error,
	onBlur,
	isDisabled = false,
}: NameInputProps) => {
	return (
		<FormControl isInvalid={isInvalid} isRequired>
			<FormLabel htmlFor='name'>name</FormLabel>
			<Input
				id='name'
				name='name'
				type='text'
				variant='filled'
				onChange={onChange}
				value={name}
				onBlur={onBlur}
				autoFocus
				isDisabled={isDisabled}
			/>
			<FormErrorMessage>{error}</FormErrorMessage>
		</FormControl>
	);
};

export default NameInput;
