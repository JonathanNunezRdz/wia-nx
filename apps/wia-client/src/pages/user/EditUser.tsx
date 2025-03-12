import {
	Box,
	Button,
	FormControl,
	FormLabel,
	HStack,
	Input,
	VStack,
} from '@chakra-ui/react';
import FormErrorMessageWrapper from '@wia-client/src/components/common/FormErrorMessageWrapper';
import ImageInput from '@wia-client/src/components/common/ImageInput';
import {
	selectAuth,
	useAppSelector,
	useEditUserMutation,
	useGetMeQuery,
} from '@wia-client/src/store';
import { formatImageFileName, useImage } from '@wia-client/src/utils';
import { EditUserDto } from '@wia-nx/types';
import { useCallback, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';

export function EditUser() {
	const { isLoggedIn } = useAppSelector(selectAuth);
	const meQuery = useGetMeQuery(undefined, { skip: !isLoggedIn });
	const [editUser, editUserStatus] = useEditUserMutation();

	const {
		currentImage,
		handleImageChange,
		imageFile,
		imageFormat,
		resetImage,
	} = useImage({ originalImage: meQuery.data?.image });
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { isDirty, errors },
	} = useForm<EditUserDto>();

	const onSubmit = useCallback<SubmitHandler<EditUserDto>>(
		(values) => {
			if (!meQuery.isSuccess) return;
			if (imageFile) {
				const format = imageFile.type.split('/').pop();
				const fileName = formatImageFileName(meQuery.data.uid, format);
				const sendImage = new File([imageFile], fileName, {
					type: imageFile.type,
				});
				editUser({ dto: values, imageFile: sendImage });
			} else {
				editUser({ dto: values });
			}
		},
		[meQuery, imageFile, editUser]
	);

	useEffect(() => {
		if (meQuery.isSuccess) {
			const { data } = meQuery;
			setValue('alias', data.alias, { shouldDirty: false });
			setValue('firstName', data.firstName, { shouldDirty: false });
			setValue('lastName', data.lastName, { shouldDirty: false });
		}
	}, [meQuery, setValue]);

	useEffect(() => {
		if (typeof imageFormat !== 'undefined') {
			setValue('imageFormat', imageFormat, { shouldDirty: true });
		}
	}, [imageFormat, setValue]);

	if (!meQuery.isSuccess) return null;
	return (
		<Box w='full'>
			<form onSubmit={handleSubmit(onSubmit)}>
				<VStack w='full' spacing='4' alignItems='center'>
					<FormErrorMessageWrapper />

					<FormControl isInvalid={Boolean(errors.alias)}>
						<FormLabel htmlFor='alias'>alias</FormLabel>
						<Input
							id='alias'
							placeholder='your alias'
							{...register('alias', {
								required: 'alias must not be empty',
								minLength: {
									value: 1,
									message:
										'alias must be at least 1 character',
								},
							})}
						/>
					</FormControl>

					<FormControl isInvalid={Boolean(errors.firstName)}>
						<FormLabel htmlFor='firstName'>first name</FormLabel>
						<Input
							id='firstName'
							placeholder='your firstName'
							{...register('firstName', {
								required: 'firstName must not be empty',
								minLength: {
									value: 1,
									message:
										'firstName must be at least 1 character',
								},
							})}
						/>
					</FormControl>

					<FormControl isInvalid={Boolean(errors.lastName)}>
						<FormLabel htmlFor='lastName'>last name</FormLabel>
						<Input
							id='lastName'
							placeholder='your lastName'
							{...register('lastName', {
								required: 'lastName must not be empty',
								minLength: {
									value: 1,
									message:
										'lastName must be at least 1 character',
								},
							})}
						/>
					</FormControl>

					<ImageInput
						currentImage={currentImage}
						imageName={meQuery.data.uid}
						handleImageChange={handleImageChange}
						handleImageReset={resetImage}
						isLocal={currentImage !== meQuery.data.image?.src}
					/>

					<HStack>
						<Button
							type='submit'
							disabled={!isDirty}
							isLoading={editUserStatus.isLoading}
							colorScheme={isDirty ? 'green' : 'gray'}
						>
							update
						</Button>
					</HStack>
				</VStack>
			</form>
		</Box>
	);
}
