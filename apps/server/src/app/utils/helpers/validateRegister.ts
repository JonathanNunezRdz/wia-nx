import { UserInput } from '../types/userTypes';
import validateEmail from './validateEmail';

const validateRegister = (user: UserInput) => {
	if (!validateEmail(user.email))
		return [
			{
				field: 'email',
				message: 'Email not valid',
			},
		];

	if (user.alias.length <= 2)
		return [
			{
				field: 'username',
				message: 'Username length must be greater than 2',
			},
		];

	if (user.password.length <= 2)
		return [
			{
				field: 'password',
				message: 'Password length must be greater than 2',
			},
		];

	return null;
};

export default validateRegister;
