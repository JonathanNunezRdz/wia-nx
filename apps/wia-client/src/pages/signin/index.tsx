import {
	Box,
	Button,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	VStack,
} from '@chakra-ui/react';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { FC, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import FormErrorMessageWrapper from '@wia-client/src/components/common/FormErrorMessageWrapper';
import Body from '@wia-client/src/components/layout/Body';
import {
	useGetLoggedStatusQuery,
	useSetJwtMutation,
	useSignInMutation,
} from '@wia-client/src/store';
import { parseRTKError } from '@wia-client/src/utils';
import { SignInDto } from '@wia-nx/types';

const SignIn: FC = () => {
	// next hooks
	const router = useRouter();

	// rtk hooks
	const loggedStatus = useGetLoggedStatusQuery();
	const [signIn, signInState] = useSignInMutation();
	const [setJwt] = useSetJwtMutation();

	// react-hook-form
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

	// std functions
	const onSubmit: SubmitHandler<SignInDto> = async (data) => {
		const res = await signIn(data).unwrap();
		setJwt({ token: res.accessToken });
	};

	// effects
	useEffect(() => {
		if (loggedStatus.isSuccess && router.isReady) {
			if (typeof router.query.redirect === 'string') {
				router.push(router.query.redirect);
			} else {
				console.log('redirect to home');
				router.push('/');
			}
		}
	}, [signInState, router, loggedStatus.isSuccess]);

	return (
		<Body v h>
			<NextSeo title='sign in' />
			<form onSubmit={handleSubmit(onSubmit)} noValidate>
				<VStack px='1.5rem' py='1rem' spacing={4}>
					<FormErrorMessageWrapper
						error={
							signInState.isError
								? parseRTKError(signInState.error)
								: undefined
						}
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
							autoFocus
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
							isLoading={signInState.isLoading}
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
