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
import { EditMediaDto } from '@wia-nx/types';
import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@wia-client/src/store/hooks';
import { selectEditMedia } from '@wia-client/src/store/media';
import {
	formatDate,
	formatImageFileName,
	loadImage,
	prepareDate,
} from '@wia-client/src/utils';
import { editMediaAction } from '@wia-client/src/store/media/actions';
import ProtectedPage from '@wia-client/src/components/auth/ProtectedPage';
import PageTitle from '@wia-client/src/components/common/PageTitle';
import { SubmitHandler, useForm } from 'react-hook-form';
import FormErrorMessageWrapper from '@wia-client/src/components/common/FormErrorMessageWrapper';
import MediaTypeOptions from '@wia-client/src/components/common/MediaTypeOptions';
import { mediaLabel } from '@wia-client/src/utils/constants';
import ImageCard from '@wia-client/src/components/common/ImageCard';

const EditMedia = () => {
	// redux hooks
	const dispatch = useAppDispatch();
	const {
		data: mediaToEdit,
		status,
		error,
	} = useAppSelector(selectEditMedia);

	// next hooks
	const router = useRouter();

	// react hooks
	const [currentImage, setCurrentImage] = useState<string>('');
	const [imageFile, setImageFile] = useState<File>();

	// react-hook-form
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors, isDirty },
	} = useForm<EditMediaDto>({
		defaultValues: {
			mediaId: mediaToEdit.id,
			title: mediaToEdit.title,
			knownAt: formatDate(new Date(mediaToEdit.knownAt).toISOString()),
			type: mediaToEdit.type,
		},
	});

	// functions
	const onSubmit: SubmitHandler<EditMediaDto> = async (data) => {
		console.log('submitting edit media');

		const newValues = {
			...data,
			knownAt: data.knownAt && prepareDate(data.knownAt),
			title: data.title?.trim(),
		};

		if (imageFile) {
			const format = imageFile.type.split('/').pop();
			const completeFileName = formatImageFileName(
				newValues.title || mediaToEdit.title,
				format
			);
			const sendImage = new File([imageFile], completeFileName, {
				type: imageFile.type,
			});
			const res = await dispatch(
				editMediaAction({ editDto: newValues, imageFile: sendImage })
			);
			if (res.meta.requestStatus === 'fulfilled') router.push('/media');
		} else {
			const { imageFormat, ...rest } = newValues;
			const res = await dispatch(
				editMediaAction({
					editDto: rest,
				})
			);
			if (res.meta.requestStatus === 'fulfilled') router.push('/media');
		}
	};

	const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
		const res = await loadImage(event.currentTarget.files);
		setCurrentImage(res.result);
		setImageFile(res.image);
		setValue('imageFormat', res.format, { shouldDirty: true });
	};

	useEffect(() => {
		if (mediaToEdit.image && typeof imageFile === 'undefined') {
			setCurrentImage(mediaToEdit.image.src);
		}
	}, [mediaToEdit.image, imageFile]);

	// render
	return (
		<ProtectedPage originalUrl='/media/edit'>
			<VStack w='full' spacing={4}>
				<PageTitle title='edit media' />
				<form onSubmit={handleSubmit(onSubmit)}>
					<VStack spacing={4}>
						<FormErrorMessageWrapper error={error?.message} />
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
								{
									mediaLabel.present[
										watch('type') || mediaToEdit.type
									]
								}{' '}
								it?
							</FormLabel>
							<Input
								id='knownAt'
								type='date'
								{...register('knownAt')}
							/>
						</FormControl>

						{currentImage && (
							<ImageCard
								image={{ src: currentImage }}
								imageName={watch('title') || mediaToEdit.title}
								type={watch('type') || mediaToEdit.type}
								local={currentImage !== mediaToEdit.image?.src}
							/>
						)}
						<FormControl>
							<FormLabel htmlFor='image'>image</FormLabel>
							<Input
								id='image'
								name='image'
								type='file'
								variant='filled'
								accept='image/*'
								onChange={handleImageChange}
								py={2}
								height='auto'
							/>
						</FormControl>

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
								isLoading={status === 'loading'}
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
