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
import { WaifuLevel } from '@prisma/client';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import FilterUsersInput from '@wia-client/src/components/common/FilterUsersInput';
import { useGetMembersQuery } from '@wia-client/src/store/user';
import { isValidWaifuLevel } from '@wia-client/src/utils';
import {
	WaifuFilterInputs,
	WaifuLevelLabels,
} from '@wia-client/src/utils/constants';
import { GetAllWaifusDto } from '@wia-nx/types';

interface WaifuFilterOptionsProps {
	getWaifus: (options: GetAllWaifusDto) => void;
}

const WaifuFilterOptions = ({ getWaifus }: WaifuFilterOptionsProps) => {
	// rtk hooks
	const { data: members, isSuccess } = useGetMembersQuery();

	// chakra hooks
	const { isOpen, onToggle } = useDisclosure();

	// react-hook-form
	const { register, handleSubmit, reset, control } =
		useForm<WaifuFilterInputs>({
			defaultValues: {
				nationalTreasure: false,
				freeAgent: false,
				genin: false,
				chunin: false,
				jonin: false,
				topWaifu: false,
				name: '',
			},
		});
	const onSubmit: SubmitHandler<WaifuFilterInputs> = (data) => {
		const users: string[] = [];
		const level: WaifuLevel[] = [];
		Object.entries(data).forEach(([key, value]) => {
			if (isSuccess) {
				if (isValidWaifuLevel(key) && value === true) level.push(key);

				if (
					members.findIndex((member) => member.id === key) > -1 &&
					value === true
				) {
					users.push(key);
				}
			}
		});

		getWaifus({
			page: 1,
			limit: 9,
			name: data.name,
			level,
			users,
		});
	};
	const resetFilters = () => {
		reset();
		getWaifus({ page: 1, limit: 9 });
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
						alignItems='center'
					>
						<FormControl>
							<FormLabel htmlFor='name'>name</FormLabel>
							<Input
								id='name'
								placeholder='filter by name'
								{...register('name')}
							/>
						</FormControl>

						<FormControl>
							<FormLabel htmlFor='level'>level</FormLabel>
							<CheckboxGroup>
								<SimpleGrid columns={{ sm: 3 }} spacing='4'>
									{Object.entries(WaifuLevelLabels).map(
										([level, label]) => (
											<Controller
												key={level}
												control={control}
												name={level as WaifuLevel}
												defaultValue={false}
												render={({
													field: {
														onChange,
														value,
														ref,
													},
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
										)
									)}
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

export default WaifuFilterOptions;
