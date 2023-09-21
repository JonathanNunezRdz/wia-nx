import { FormControl, FormLabel, Select } from '@chakra-ui/react';
import { MediaType } from '@prisma/client';
import { ChangeEventHandler } from 'react';
import MediaTypeOptions from './MediaTypeOptions';

interface TypeInputProps {
	onChange: ChangeEventHandler<HTMLSelectElement>;
	type: MediaType;
	isDisabled?: boolean;
}

const TypeInput = ({ onChange, type, isDisabled = false }: TypeInputProps) => {
	return (
		<FormControl>
			<FormLabel htmlFor='type'>type</FormLabel>
			<Select
				id='type'
				name='type'
				variant='filled'
				onChange={onChange}
				value={type}
				isDisabled={isDisabled}
			>
				<MediaTypeOptions />
			</Select>
		</FormControl>
	);
};

export default TypeInput;
