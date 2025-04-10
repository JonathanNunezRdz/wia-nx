import {
	Button,
	FormControl,
	FormErrorMessage,
	FormLabel,
	HStack,
	Input,
	Select,
	VStack,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import ProtectedPage from '@wia-client/src/components/auth/ProtectedPage';
import FormErrorMessageWrapper from '@wia-client/src/components/common/FormErrorMessageWrapper';
import ImageInput from '@wia-client/src/components/common/ImageInput';
import MediaTypeOptions from '@wia-client/src/components/common/MediaTypeOptions';
import PageTitle from '@wia-client/src/components/common/PageTitle';
import {
	useAddMediaMutation,
	useGetLoggedStatusQuery,
} from '@wia-client/src/store';
import {
	formatDate,
	mediaLabel,
	parseRTKError,
	prepareDate,
	setupImageFile,
	useImage,
} from '@wia-client/src/utils';
import { CreateMediaDto } from '@wia-nx/types';

const AddMedia = () => {
	// next hooks
	const router = useRouter();

	// rtk hooks
	const loggedStatus = useGetLoggedStatusQuery();
	const [addMedia, addMediaState] = useAddMediaMutation();

	// custom hooks
	const {
		currentImage,
		imageFile,
		imageFormat,
		handleImageChange,
		resetImage,
		imageIsLoading,
	} = useImage();

	// react-hook-form
	const {
		register,
		handleSubmit,
		watch,
		setValue,
		reset,
		formState: { errors, isDirty },
	} = useForm<CreateMediaDto>({
		defaultValues: {
			title: '',
			type: 'anime',
			knownAt: formatDate(),
			imageFormat: undefined,
		},
	});

	// functions
	const onSubmit: SubmitHandler<CreateMediaDto> = async (data) => {
		console.log('adding media');

		const newValues = {
			...data,
			knownAt: prepareDate(data.knownAt),
			title: data.title.trim(),
		};
		const sendImage = setupImageFile({ imageFile, name: newValues.title });
		await addMedia({ mediaDto: newValues, imageFile: sendImage });
		reset();
	};

	// effects
	useEffect(() => {
		if (addMediaState.isSuccess && router.isReady) {
			router.push('/media');
		}
	}, [router, addMediaState.isSuccess]);

	useEffect(() => {
		if (typeof imageFormat !== 'undefined') {
			setValue('imageFormat', imageFormat, { shouldDirty: false });
		}
	}, [imageFormat, setValue]);

	if (!loggedStatus.isSuccess) return <></>;

	return (
		<ProtectedPage originalUrl='/media/add'>
			<VStack w='full' spacing={4}>
				<PageTitle title='add media' />
				<form onSubmit={handleSubmit(onSubmit)}>
					<VStack spacing={4}>
						<FormErrorMessageWrapper
							error={
								addMediaState.isError
									? parseRTKError(addMediaState.error)
									: undefined
							}
						/>
						<FormControl isInvalid={Boolean(errors.title)}>
							<FormLabel htmlFor='title'>title</FormLabel>
							<Input
								id='title'
								placeholder='title for your media'
								{...register('title', {
									required: 'title must not be empty',
								})}
							/>
							<FormErrorMessage>
								{errors.title?.message}
							</FormErrorMessage>
						</FormControl>

						<FormControl>
							<FormLabel htmlFor='type'>type</FormLabel>
							<Select id='type' {...register('type')}>
								<MediaTypeOptions />
							</Select>
						</FormControl>

						<FormControl>
							<FormLabel htmlFor='knownAt'>
								when did you {mediaLabel.present[watch('type')]}{' '}
								it?
							</FormLabel>
							<Input
								id='knownAt'
								type='date'
								{...register('knownAt')}
							/>
						</FormControl>

						<ImageInput
							currentImage={currentImage}
							imageName={watch('title')}
							handleImageChange={handleImageChange}
							handleImageReset={resetImage}
							imageIsLoading={imageIsLoading}
							isLocal
						/>

						<HStack>
							<Button
								type='button'
								colorScheme='red'
								onClick={() => router.back()}
							>
								cancel
							</Button>
							<Button
								type='submit'
								isDisabled={!isDirty}
								isLoading={addMediaState.isLoading}
								colorScheme={isDirty ? 'green' : 'gray'}
							>
								add media
							</Button>
						</HStack>
					</VStack>
				</form>
			</VStack>
		</ProtectedPage>
	);
};

export default AddMedia;
