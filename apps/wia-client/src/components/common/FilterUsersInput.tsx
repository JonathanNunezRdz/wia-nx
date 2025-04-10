import {
	Checkbox,
	CheckboxGroup,
	FormControl,
	FormLabel,
	SimpleGrid,
} from '@chakra-ui/react';
import { Control, Controller } from 'react-hook-form';

import { useGetLoggedStatusQuery } from '@wia-client/src/store';
import { useGetMeQuery, useGetMembersQuery } from '@wia-client/src/store/user';
import { Loading } from './Loading';

interface FilterUsersInputProps {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	control: Control<any, any>;
}

const FilterUsersInput = ({ control }: FilterUsersInputProps) => {
	// reducers
	const loggedStatus = useGetLoggedStatusQuery();
	const {
		data: user,
		isFetching: userFetching,
		isSuccess: userSuccess,
	} = useGetMeQuery(undefined, { skip: !loggedStatus.isSuccess });
	const {
		data: members,
		isFetching: membersFetching,
		isSuccess: membersSuccess,
	} = useGetMembersQuery();

	// effects

	if (userFetching || membersFetching) return <Loading />;

	return (
		<FormControl>
			<FormLabel htmlFor='users'>users</FormLabel>
			<CheckboxGroup>
				<SimpleGrid columns={{ sm: 2 }} spacing={4}>
					{membersSuccess &&
						members.map((member) => (
							<Controller
								key={member.id}
								control={control}
								name={member.id}
								defaultValue={false}
								render={({
									field: { onChange, value, ref },
								}) => (
									<Checkbox
										onChange={onChange}
										ref={ref}
										isChecked={value}
									>
										{userSuccess && user.id === member.id
											? 'me'
											: member.alias}
									</Checkbox>
								)}
							/>
						))}
				</SimpleGrid>
			</CheckboxGroup>
		</FormControl>
	);
};

export default FilterUsersInput;
