import {
	Checkbox,
	CheckboxGroup,
	FormControl,
	FormLabel,
	SimpleGrid,
} from '@chakra-ui/react';
import { useAppSelector } from '@wia-client/src/store/hooks';
import { Control, Controller } from 'react-hook-form';

import { Loading } from './Loading';
import { useGetMeQuery, useGetMembersQuery } from '@wia-client/src/store/user';
import { selectAuth } from '@wia-client/src/store/auth/authReducer';

interface FilterUsersInputProps {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	control: Control<any, any>;
}

const FilterUsersInput = ({ control }: FilterUsersInputProps) => {
	// reducers
	const { isLoggedIn } = useAppSelector(selectAuth);
	const {
		data: user,
		isFetching: userFetching,
		isSuccess: userSuccess,
	} = useGetMeQuery(undefined, { skip: !isLoggedIn });
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
