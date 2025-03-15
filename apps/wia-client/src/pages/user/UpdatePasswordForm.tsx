import {
	Box,
	Button,
	FormControl,
	FormErrorMessage,
	FormLabel,
	HStack,
	Input,
	VStack,
} from '@chakra-ui/react';
import FormErrorMessageWrapper from '@wia-client/src/components/common/FormErrorMessageWrapper';
import { useUpdatePasswordMutation } from '@wia-client/src/store';
import { parseRTKError } from '@wia-client/src/utils';
import { UpdatePasswordDto } from '@wia-nx/types';
import { useForm } from 'react-hook-form';

export function UpdatePasswordForm() {
	const [updatePassword, updatePasswordStatus] = useUpdatePasswordMutation();
	const form = useForm<UpdatePasswordDto>({
		defaultValues: {
			currentPassword: '',
			newPassword: '',
			confirmPassword: '',
		},
	});

	async function onSubmit(values: UpdatePasswordDto) {
		await updatePassword(values);
		form.reset();
	}

	return (
		<Box w='full'>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<VStack spacing='4'>
					<FormErrorMessageWrapper
						error={
							updatePasswordStatus.isError
								? parseRTKError(updatePasswordStatus.error)
								: undefined
						}
					/>
					<FormControl
						isInvalid={Boolean(
							form.formState.errors.currentPassword
						)}
					>
						<FormLabel htmlFor='current-password'>
							current password
						</FormLabel>
						<Input
							id='current-password'
							placeholder='your password'
							type='password'
							{...form.register('currentPassword', {
								required: 'current password must not be empty',
							})}
						/>
						<FormErrorMessage>
							{form.formState.errors.currentPassword?.message}
						</FormErrorMessage>
					</FormControl>
					<FormControl
						isInvalid={Boolean(form.formState.errors.newPassword)}
					>
						<FormLabel htmlFor='new-password'>
							new password
						</FormLabel>
						<Input
							id='new-password'
							placeholder='your password'
							type='password'
							{...form.register('newPassword', {
								required: 'new password must not be empty',
							})}
						/>
						<FormErrorMessage>
							{form.formState.errors.newPassword?.message}
						</FormErrorMessage>
					</FormControl>
					<FormControl
						isInvalid={Boolean(
							form.formState.errors.confirmPassword
						)}
					>
						<FormLabel htmlFor='confirm-password'>
							confirm password
						</FormLabel>
						<Input
							id='confirm-password'
							placeholder='your password'
							type='password'
							{...form.register('confirmPassword', {
								required: 'confirm password must not be empty',
								validate: (value, dto) => {
									if (value !== dto.newPassword)
										return 'not valid';
								},
							})}
						/>
						<FormErrorMessage>
							{form.formState.errors.confirmPassword?.message}
						</FormErrorMessage>
					</FormControl>
					<HStack gap={4}>
						<Button
							type='submit'
							colorScheme='green'
							isDisabled={!form.formState.isDirty}
							isLoading={updatePasswordStatus.isLoading}
							loadingText='loading'
						>
							update
						</Button>
						<Button type='button' onClick={() => form.reset()}>
							reset
						</Button>
					</HStack>
				</VStack>
			</form>
		</Box>
	);
}
