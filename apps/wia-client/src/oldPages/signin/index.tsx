import {
	Box,
	Button,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	VStack,
} from '@chakra-ui/react';
import FormErrorMessageWrapper from '@wia-client/src/components/common/FormErrorMessageWrapper';
import Body from '@wia-client/src/components/layout/Body';
import { useAppDispatch, useAppSelector } from '@wia-client/src/store/hooks';
import { resetSignInStatus, selectSignIn } from '@wia-client/src/store/user';
import { signInAction } from '@wia-client/src/store/user/actions';
import { SignInDto } from '@wia-nx/types';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { FC, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

const SignIn: FC = () => {
	// redux hooks
	const dispatch = useAppDispatch();
	const signInStatus = useAppSelector(selectSignIn);

	// next hooks
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors, isDirty },
	} = useForm<SignInDto>({
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const onSubmit: SubmitHandler<SignInDto> = async (data) => {
		const res = await dispatch(signInAction(data));
		if (res.meta.requestStatus === 'fulfilled') {
			if (router.query.redirect) {
				router.push(router.query.redirect as string);
			} else {
				router.push('/');
			}
		}
	};

	useEffect(() => {
		return () => {
			dispatch(resetSignInStatus());
		};
	}, [dispatch]);

	return (
		<Body v h>
			<NextSeo title='sign in' />
			<form onSubmit={handleSubmit(onSubmit)} noValidate>
				<VStack px='1.5rem' py='1rem' spacing={4}>
					<FormErrorMessageWrapper
						error={signInStatus.error?.message}
					/>
					<FormControl isInvalid={Boolean(errors.email)}>
						<FormLabel>email address</FormLabel>
						<Input
							id='email'
							type='email'
							variant='filled'
							{...register('email', {
								required: 'email must not be empty',
								pattern: {
									message: 'invalid email address',
									value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
								},
							})}
						/>
						<FormErrorMessage>
							{errors.email?.message}
						</FormErrorMessage>
					</FormControl>

					<FormControl isInvalid={Boolean(errors.password)}>
						<FormLabel>password</FormLabel>
						<Input
							id='password'
							type='password'
							variant='filled'
							{...register('password', {
								required: 'password must not be empty',
							})}
						/>
						<FormErrorMessage>
							{errors.password?.message}
						</FormErrorMessage>
					</FormControl>

					<Box>
						<Button
							type='submit'
							isDisabled={!isDirty}
							isLoading={signInStatus.status === 'loading'}
						>
							sign in
						</Button>
					</Box>
				</VStack>
			</form>
		</Body>
	);
};

export default SignIn;
