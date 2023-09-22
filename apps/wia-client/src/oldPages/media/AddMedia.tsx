import { ChangeEvent, useEffect, useState } from 'react';
import {
	LinkBox,
	LinkOverlay,
	Button,
	HStack,
	VStack,
	FormControl,
	FormLabel,
	Input,
	FormErrorMessage,
	Select,
} from '@chakra-ui/react';
import { CreateMediaDto } from '@wia-nx/types';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '@wia-client/src/store/hooks';
import {
	resetAddMediaStatus,
	selectAddMedia,
} from '@wia-client/src/store/media';
import {
	formatDate,
	formatImageFileName,
	loadImage,
	prepareDate,
} from '@wia-client/src/utils';
import { addMediaAction } from '@wia-client/src/store/media/actions';
import ProtectedPage from '@wia-client/src/components/auth/ProtectedPage';
import PageTitle from '@wia-client/src/components/common/PageTitle';
import FormErrorMessageWrapper from '@wia-client/src/components/common/FormErrorMessageWrapper';
import MediaTypeOptions from '@wia-client/src/components/common/MediaTypeOptions';
import { mediaLabel } from '@wia-client/src/utils/constants';
import ImageCard from '@wia-client/src/components/common/ImageCard';

const AddMedia = () => {
	// redux hooks
	const dispatch = useAppDispatch();
	const { status, error } = useAppSelector(selectAddMedia);

	// next hooks
	const router = useRouter();

	// react hooks
	const [currentImage, setCurrentImage] = useState<string>('');
	const [imageFile, setImageFile] = useState<File>();

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
		console.log('submitting');

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
			const res = await dispatch(
				addMediaAction({
					mediaDto: newValues,
					imageFile: sendImage,
				})
			);
			if (res.meta.requestStatus === 'fulfilled') router.push('/media');
		} else {
			// remove imageFormat if undefined
			const { imageFormat, ...rest } = newValues;
			const res = await dispatch(
				addMediaAction({
					mediaDto: rest,
				})
			);
			if (res.meta.requestStatus === 'fulfilled') router.push('/media');
		}
	};

	const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
		const res = await loadImage(event.currentTarget.files);
		setCurrentImage(res.result);
		setImageFile(res.image);
		setValue('imageFormat', res.format);
	};

	useEffect(() => {
		return () => {
			dispatch(resetAddMediaStatus());
		};
	}, [dispatch]);

	return (
		<ProtectedPage originalUrl='/media/add'>
			<VStack w='full' spacing='1rem'>
				<PageTitle title='add media' />
				<form onSubmit={handleSubmit(onSubmit)}>
					<VStack spacing='4'>
						<FormErrorMessageWrapper error={error?.message} />
						<FormControl isInvalid={!!errors.title}>
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

						{currentImage && (
							<ImageCard
								image={{ src: currentImage }}
								imageName={watch('title')}
								type={watch('type')}
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
								py='2'
								height='auto'
							/>
						</FormControl>
						<HStack>
							<LinkBox display='inline-flex'>
								<NextLink href='/media' passHref>
									<LinkOverlay>
										<Button colorScheme='red'>
											cancel
										</Button>
									</LinkOverlay>
								</NextLink>
							</LinkBox>
							<Button
								type='submit'
								isDisabled={!isDirty}
								isLoading={status === 'loading'}
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
