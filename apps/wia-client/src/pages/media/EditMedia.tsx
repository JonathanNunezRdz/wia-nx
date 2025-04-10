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
	useEditMediaMutation,
	useGetEditMediaQuery,
	useGetLoggedStatusQuery,
} from '@wia-client/src/store';
import {
	formatDate,
	mediaLabel,
	parseMediaId,
	parseRTKError,
	prepareDate,
	setupImageFile,
	useImage,
} from '@wia-client/src/utils';
import { EditMediaDto } from '@wia-nx/types';

const EditMedia = () => {
	// next hooks
	const router = useRouter();
	const mediaId = parseMediaId(router.query.mediaIdString);

	// rtk hooks
	const loggedStatus = useGetLoggedStatusQuery();
	const mediaQuery = useGetEditMediaQuery(mediaId, {
		skip: !loggedStatus.isSuccess && !router.isReady,
	});
	const [editMedia, editMediaState] = useEditMediaMutation();

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
		setValue,
		watch,
		reset,
		formState: { errors, isDirty },
	} = useForm<EditMediaDto>({
		defaultValues: {
			mediaId,
			title: '',
			knownAt: '',
			type: 'anime',
		},
	});

	// functions
	const onSubmit: SubmitHandler<EditMediaDto> = async (data) => {
		console.log('submitting edit media');
		if (!mediaQuery.isSuccess) return;
		const { data: mediaToEdit } = mediaQuery;

		const newValues = {
			...data,
			knownAt: data.knownAt && prepareDate(data.knownAt),
			title: data.title?.trim(),
		};
		const sendImage = setupImageFile({
			imageFile,
			name: newValues.title || mediaToEdit.title,
		});
		await editMedia({ editDto: newValues, imageFile: sendImage });
		reset();
	};

	// effects
	useEffect(() => {
		if (mediaQuery.isSuccess) {
			const { data: mediaToEdit } = mediaQuery;
			setValue('title', mediaToEdit.title, { shouldDirty: false });
			setValue(
				'knownAt',
				formatDate(new Date(mediaToEdit.knownAt).toISOString()),
				{ shouldDirty: false }
			);
			setValue('type', mediaToEdit.type, { shouldDirty: false });
		}
	}, [mediaQuery, setValue]);

	useEffect(() => {
		if (editMediaState.isSuccess && router.isReady) {
			router.push('/media');
		}
	}, [editMediaState, router]);

	useEffect(() => {
		if (typeof imageFormat !== 'undefined') {
			setValue('imageFormat', imageFormat, { shouldDirty: true });
		}
	}, [imageFormat, setValue]);

	// render
	if (!mediaQuery.isSuccess) return <></>;
	return (
		<ProtectedPage originalUrl='/media/edit'>
			<VStack w='full' spacing={4}>
				<PageTitle title='edit media' />
				<form onSubmit={handleSubmit(onSubmit)}>
					<VStack spacing={4}>
						<FormErrorMessageWrapper
							error={
								editMediaState.isError
									? parseRTKError(editMediaState.error)
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
								when did you{' '}
								{mediaLabel.present[watch('type') || 'anime']}{' '}
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
							imageName={watch('title') || ''}
							handleImageChange={handleImageChange}
							handleImageReset={resetImage}
							imageIsLoading={imageIsLoading}
							isLocal={
								currentImage !== mediaQuery.data.image?.src
							}
						/>

						<HStack>
							<Button
								colorScheme='red'
								onClick={() => router.back()}
							>
								cancel
							</Button>
							<Button
								type='submit'
								disabled={!isDirty}
								isLoading={editMediaState.isLoading}
								colorScheme={isDirty ? 'green' : 'gray'}
							>
								confirm
							</Button>
						</HStack>
					</VStack>
				</form>
			</VStack>
		</ProtectedPage>
	);
};

export default EditMedia;
