import {
	Box,
	Button,
	Checkbox,
	CheckboxGroup,
	Collapse,
	FormControl,
	FormLabel,
	Input,
	SimpleGrid,
	useDisclosure,
} from '@chakra-ui/react';
import { MediaType } from '@prisma/client';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';

import { GetMediaDto } from '@wia-nx/types';
import { useGetMembersQuery } from '@wia-client/src/store';
import {
	isValidMediaType,
	MediaFilterInputs,
	MediaTypes,
} from '@wia-client/src/utils';
import FilterUsersInput from '@wia-client/src/components/common/FilterUsersInput';

interface MediaFilterOptionsProps {
	getMedia: (options: GetMediaDto) => void;
}

const MediaFilterOptions = ({ getMedia }: MediaFilterOptionsProps) => {
	// rtk
	const { data: members, isSuccess } = useGetMembersQuery();

	// chakra hooks
	const { isOpen, onToggle } = useDisclosure();

	// react-hook-form
	const { register, handleSubmit, reset, control } =
		useForm<MediaFilterInputs>({
			defaultValues: {
				anime: false,
				manga: false,
				videogame: false,
				title: '',
			},
		});
	const onSubmit: SubmitHandler<MediaFilterInputs> = (data) => {
		const users: string[] = [];
		const type: MediaType[] = [];
		Object.entries(data).forEach(([key, value]) => {
			if (isSuccess) {
				if (isValidMediaType(key) && value === true) type.push(key);

				if (
					members.findIndex((member) => member.id === key) > -1 &&
					value === true
				) {
					users.push(key);
				}
			}
		});

		getMedia({
			page: 1,
			limit: 9,
			title: data.title,
			type,
			users,
		});
	};

	const resetFilters = () => {
		reset();
		getMedia({ page: 1, limit: 9 });
	};

	return (
		<Box>
			<Button onClick={onToggle} size='sm' my='2' isActive={isOpen}>
				{isOpen ? 'hide' : 'show'} filters
			</Button>
			<Collapse in={isOpen} animateOpacity>
				<form onSubmit={handleSubmit(onSubmit)}>
					<SimpleGrid
						columns={{ sm: 1, md: 3 }}
						spacing='4'
						alignItems='start'
					>
						<FormControl>
							<FormLabel htmlFor='title'>title</FormLabel>
							<Input
								id='title'
								placeholder='filter by title'
								{...register('title')}
							/>
						</FormControl>
						<FormControl>
							<FormLabel htmlFor='type'>type</FormLabel>
							<CheckboxGroup>
								<SimpleGrid columns={{ sm: 2 }} spacing='4'>
									{MediaTypes.map((label) => (
										<Controller
											key={label}
											control={control}
											name={label as MediaType}
											defaultValue={false}
											render={({
												field: { onChange, value, ref },
											}) => (
												<Checkbox
													onChange={onChange}
													ref={ref}
													isChecked={value}
												>
													{label}
												</Checkbox>
											)}
										/>
									))}
								</SimpleGrid>
							</CheckboxGroup>
						</FormControl>

						<FilterUsersInput control={control} />

						<Button onClick={resetFilters} width='full'>
							reset
						</Button>
						<Button type='submit' width='full'>
							search
						</Button>
					</SimpleGrid>
				</form>
			</Collapse>
		</Box>
	);
};

export default MediaFilterOptions;
