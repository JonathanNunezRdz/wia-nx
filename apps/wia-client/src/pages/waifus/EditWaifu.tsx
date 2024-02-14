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
import { EditWaifuDto } from '@wia-nx/types';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@wia-client/src/store/hooks';
import { selectEditWaifu } from '@wia-client/src/store/waifu';
import { ChangeEvent, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { formatImageFileName, loadImage } from '@wia-client/src/utils';
import { editWaifuAction } from '@wia-client/src/store/waifu/actions';
import ProtectedPage from '@wia-client/src/components/auth/ProtectedPage';
import PageTitle from '@wia-client/src/components/common/PageTitle';
import FormErrorMessageWrapper from '@wia-client/src/components/common/FormErrorMessageWrapper';
import WaifuLevelOptions from '@wia-client/src/components/common/WaifuLevelOptions';
import WaifuMediaTitleOptions from '@wia-client/src/components/common/WaifuMediaTitleOptions';
import ImageCard from '@wia-client/src/components/common/ImageCard';

function EditWaifu() {
	// redux hooks
	const dispatch = useAppDispatch();
	const {
		data: waifuToEdit,
		status,
		error,
	} = useAppSelector(selectEditWaifu);

	// next hooks
	const router = useRouter();

	// react hooks
	const [currentImage, setCurrentImage] = useState<string>('');
	const [imageFile, setImageFile] = useState<File>();

	// react hook form
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { isDirty, errors },
	} = useForm<EditWaifuDto>({
		defaultValues: {
			mediaId: waifuToEdit.mediaId,
			waifuId: waifuToEdit.id,
			name: waifuToEdit.name,
			level: waifuToEdit.level,
		},
	});

	// functions
	const onSubmit: SubmitHandler<EditWaifuDto> = async (data) => {
		console.log('submitting edit waifu');

		const newValues: EditWaifuDto = {
			...data,
			name: data.name?.trim(),
		};

		if (imageFile) {
			const format = imageFile.type.split('/').pop();
			const completeFileName = formatImageFileName(
				newValues.name || waifuToEdit.name,
				format
			);
			const sendImage = new File([imageFile], completeFileName, {
				type: imageFile.type,
			});
			const res = await dispatch(
				editWaifuAction({ editDto: newValues, imageFile: sendImage })
			);
			if (res.meta.requestStatus === 'fulfilled') router.push('/waifus');
		} else {
			const { imageFormat, ...rest } = newValues;
			const res = await dispatch(
				editWaifuAction({
					editDto: rest,
				})
			);
			if (res.meta.requestStatus === 'fulfilled') router.push('/waifus');
		}
	};

	const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
		const res = await loadImage(event.currentTarget.files);
		setCurrentImage(res.result);
		setImageFile(res.image);
		setValue('imageFormat', res.format, { shouldDirty: true });
	};

	useEffect(() => {
		if (waifuToEdit.image && typeof imageFile === 'undefined') {
			setCurrentImage(waifuToEdit.image.src);
		}
	}, [waifuToEdit.image, imageFile]);

	// render
	return (
		<ProtectedPage originalUrl='/waifus/edit'>
			<VStack w='full' spacing={4}>
				<PageTitle title='edit waifu' />
				<form onSubmit={handleSubmit(onSubmit)}>
					<VStack spacing={4}>
						<FormErrorMessageWrapper error={error?.message} />
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
								imageName={watch('name') || waifuToEdit.name}
								type='waifu'
								local={currentImage !== waifuToEdit.image?.src}
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
}

export default EditWaifu;
