import {
	Button,
	FormControl,
	FormErrorMessage,
	FormLabel,
	HStack,
	Input,
	LinkBox,
	LinkOverlay,
	Select,
	VStack,
} from '@chakra-ui/react';
import { CreateWaifuDto } from '@wia-nx/types';
import { useRouter } from 'next/router';
import { ChangeEvent, useState } from 'react';
import NextLink from 'next/link';
import { useAppDispatch, useAppSelector } from '@wia-client/src/store/hooks';
import { selectAddWaifu } from '@wia-client/src/store/waifu';
import { addWaifuAction } from '@wia-client/src/store/waifu/actions';
import ProtectedPage from '@wia-client/src/components/auth/ProtectedPage';
import PageTitle from '@wia-client/src/components/common/PageTitle';
import FormErrorMessageWrapper from '@wia-client/src/components/common/FormErrorMessageWrapper';
import WaifuLevelOptions from '@wia-client/src/components/common/WaifuLevelOptions';
import WaifuMediaTitleOptions from '@wia-client/src/components/common/WaifuMediaTitleOptions';
import { SubmitHandler, useForm } from 'react-hook-form';
import { formatImageFileName, loadImage } from '@wia-client/src/utils';
import ImageCard from '@wia-client/src/components/common/ImageCard';

function AddWaifu() {
	// redux hooks
	const dispatch = useAppDispatch();
	const addWaifuStatus = useAppSelector(selectAddWaifu);

	// next hooks
	const router = useRouter();
	const mediaId = router.query.mediaId;

	// react hooks
	const [currentImage, setCurrentImage] = useState<string>('');
	const [imageFile, setImageFile] = useState<File>();

	// react hook form
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors, isDirty },
	} = useForm<CreateWaifuDto>({
		defaultValues: {
			mediaId: typeof mediaId === 'string' ? mediaId : '',
			name: '',
			level: 'genin',
		},
	});

	// functions
	const onSubmit: SubmitHandler<CreateWaifuDto> = async (data) => {
		console.log('submitting create waifu');
		const newValues: CreateWaifuDto = {
			...data,
			name: data.name.trim(),
		};

		if (imageFile) {
			const format = imageFile.type.split('/').pop();
			const completeFileName = formatImageFileName(
				newValues.name,
				format
			);
			const sendImage = new File([imageFile], completeFileName, {
				type: imageFile.type,
			});
			const res = await dispatch(
				addWaifuAction({
					waifuDto: newValues,
					imageFile: sendImage,
				})
			);
			if (res.meta.requestStatus === 'fulfilled') {
				if (typeof mediaId === 'string') {
					router.push({
						pathname: '/media/waifus',
						query: {
							mediaId,
						},
					});
				} else router.push('/waifus');
			}
		} else {
			const { imageFormat, ...rest } = newValues;
			const res = await dispatch(
				addWaifuAction({
					waifuDto: rest,
				})
			);
			if (res.meta.requestStatus === 'fulfilled') {
				if (typeof mediaId === 'string') {
					router.push({
						pathname: '/media/waifus',
						query: {
							mediaId,
						},
					});
				} else router.push('/waifus');
			}
		}
	};

	const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
		const res = await loadImage(event.currentTarget.files);
		setCurrentImage(res.result);
		setImageFile(res.image);
		setValue('imageFormat', res.format, { shouldDirty: true });
	};

	// render
	return (
		<ProtectedPage originalUrl='/waifus/add'>
			<VStack w='full' spacing='4'>
				<PageTitle title='add waifu' />
				<form onSubmit={handleSubmit(onSubmit)}>
					<VStack spacing='4'>
						<FormErrorMessageWrapper
							error={addWaifuStatus.error?.message}
						/>
						<FormControl isInvalid={Boolean(errors.name)}>
							<FormLabel htmlFor='name'>name</FormLabel>
							<Input
								id='name'
								placeholder='name for your waifu'
								{...register('name', {
									required: 'name must not be empty',
								})}
							/>
							<FormErrorMessage>
								{errors.name?.message}
							</FormErrorMessage>
						</FormControl>

						<FormControl>
							<FormLabel htmlFor='level'>level</FormLabel>
							<Select id='level' {...register('level')}>
								<WaifuLevelOptions />
							</Select>
						</FormControl>

						<FormControl isInvalid={Boolean(errors.mediaId)}>
							<FormLabel htmlFor='mediaId'>media</FormLabel>
							<Select
								id='mediaId'
								{...register('mediaId', {
									validate: (value) => {
										if (value === '')
											return 'choose a valid media';
										return true;
									},
								})}
							>
								<WaifuMediaTitleOptions />
							</Select>
							<FormErrorMessage>
								{errors.mediaId?.message}
							</FormErrorMessage>
						</FormControl>

						{currentImage && (
							<ImageCard
								image={{ src: currentImage }}
								imageName={watch('name')}
								type='waifu'
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
								<NextLink href='/waifus' passHref>
									<LinkOverlay>
										<Button colorScheme='red'>
											cancel
										</Button>
									</LinkOverlay>
								</NextLink>
							</LinkBox>
							<Button
								type='submit'
								disabled={!isDirty}
								isLoading={addWaifuStatus.status === 'loading'}
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
}

export default AddWaifu;
