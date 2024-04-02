import { useEffect } from 'react';
import {
	Button,
	HStack,
	VStack,
	FormControl,
	FormLabel,
	Input,
	FormErrorMessage,
	Select,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';

import {
	useAddMediaMutation,
	useAppSelector,
	selectAuth,
} from '@wia-client/src/store';
import { CreateMediaDto } from '@wia-nx/types';
import {
	formatDate,
	formatImageFileName,
	parseRTKError,
	prepareDate,
	useImage,
	mediaLabel,
} from '@wia-client/src/utils';
import ProtectedPage from '@wia-client/src/components/auth/ProtectedPage';
import PageTitle from '@wia-client/src/components/common/PageTitle';
import FormErrorMessageWrapper from '@wia-client/src/components/common/FormErrorMessageWrapper';
import MediaTypeOptions from '@wia-client/src/components/common/MediaTypeOptions';
import ImageInput from '@wia-client/src/components/common/ImageInput';

const AddMedia = () => {
	// next hooks
	const router = useRouter();

	// rtk hooks
	const { isLoggedIn } = useAppSelector(selectAuth);
	const [addMedia, addMediaState] = useAddMediaMutation();

	// custom hooks
	const {
		currentImage,
		imageFile,
		imageFormat,
		handleImageChange,
		resetImage,
	} = useImage();

	// react-hook-form
	const {
		register,
		handleSubmit,
		formState: { errors, isDirty },
		watch,
		setValue,
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

		if (imageFile) {
			const format = imageFile.type.split('/').pop();
			const completeFileName = formatImageFileName(
				newValues.title,
				format
			);
			const sendImage = new File([imageFile], completeFileName, {
				type: imageFile.type,
			});
			addMedia({ mediaDto: newValues, imageFile: sendImage });
		} else {
			// remove imageFormat if undefined
			const { imageFormat, ...rest } = newValues;
			addMedia({ mediaDto: rest });
		}
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

	if (!isLoggedIn) return <></>;

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
