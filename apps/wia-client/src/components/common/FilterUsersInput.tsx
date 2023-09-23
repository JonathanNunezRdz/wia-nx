import {
	Checkbox,
	CheckboxGroup,
	FormControl,
	FormLabel,
	SimpleGrid,
} from '@chakra-ui/react';
import { Control, Controller } from 'react-hook-form';

import Loading from './Loading';
import { useGetMeQuery, useGetMembersQuery } from '@wia-client/src/store/user';
import { useAppSelector } from '@wia-client/src/store/hooks';
import { selectAuth } from '@wia-client/src/store/auth/authReducer';

interface FilterUsersInputProps {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	control: Control<any, any>;
}

const FilterUsersInput = ({ control }: FilterUsersInputProps) => {
	// reducers
	const { isLoggedIn } = useAppSelector(selectAuth);
	const members = useGetMembersQuery();
	const user = useGetMeQuery(undefined, { skip: !isLoggedIn });

	if (members.isLoading) return <Loading />;

	return (
		<FormControl>
			<FormLabel htmlFor='users'>users</FormLabel>
			<CheckboxGroup>
				<SimpleGrid columns={{ sm: 2 }} spacing='4'>
					{members.isSuccess &&
						members.data.map((member) => (
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
										{user.isSuccess &&
										user.data.id === member.id
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
