import { useRouter } from 'next/router';
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
import { SubmitHandler, useForm } from 'react-hook-form';
import { useEffect } from 'react';

import {
	selectAuth,
	useAppSelector,
	useGetMediaTitlesQuery,
	useAddWaifuMutation,
} from '@wia-client/src/store';
import {
	formatImageFileName,
	parseMediaId,
	parseRTKError,
	useImage,
} from '@wia-client/src/utils';
import { CreateWaifuDto } from '@wia-nx/types';
import ProtectedPage from '@wia-client/src/components/auth/ProtectedPage';
import PageTitle from '@wia-client/src/components/common/PageTitle';
import FormErrorMessageWrapper from '@wia-client/src/components/common/FormErrorMessageWrapper';
import WaifuLevelOptions from '@wia-client/src/components/common/WaifuLevelOptions';
import WaifuMediaTitleOptions from '@wia-client/src/components/common/WaifuMediaTitleOptions';
import ImageInput from '@wia-client/src/components/common/ImageInput';

export default function AddWaifu() {
	// next hooks
	const router = useRouter();
	const mediaId = parseMediaId(router.query.mediaId);

	// rtk hooks
	const { isLoggedIn } = useAppSelector(selectAuth);
	const mediaTitlesQuery = useGetMediaTitlesQuery({}, { skip: !isLoggedIn });
	const [addWaifu, addWaifuState] = useAddWaifuMutation();

	// custom hooks
	const {
		currentImage,
		imageFile,
		handleImageChange,
		imageFormat,
		resetImage,
	} = useImage();

	// react-hook-form
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors, isDirty },
	} = useForm<CreateWaifuDto>({
		defaultValues: {
			mediaId,
			name: '',
			level: 'genin',
		},
	});

	// std functions
	const onSubmit: SubmitHandler<CreateWaifuDto> = (data) => {
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
			addWaifu({
				waifuDto: newValues,
				imageFile: sendImage,
			});
		} else {
			const { imageFormat, ...rest } = newValues;
			addWaifu({ waifuDto: rest });
		}
	};

	// effects
	useEffect(() => {
		// Pending: checar con oscar, si regresar al anime
		// en el que estaba, o regresar a home, o waifus, etc
		if (addWaifuState.isSuccess && router.isReady) {
			if (mediaId === '') {
				router.push('/waifus');
			} else
				router.push({
					pathname: '/media/waifus',
					query: {
						mediaId,
					},
				});
		}
	}, [addWaifuState, router, mediaId]);

	useEffect(() => {
		if (typeof imageFormat !== 'undefined') {
			setValue('imageFormat', imageFormat, { shouldDirty: true });
		}
	}, [imageFormat, setValue]);

	if (!isLoggedIn || !mediaTitlesQuery.isSuccess) return <></>;

	return (
		<ProtectedPage originalUrl='/waifus/add'>
			<VStack w='full' spacing={4}>
				<PageTitle title='add waifu' />
				<form onSubmit={handleSubmit(onSubmit)}>
					<VStack spacing={4}>
						<FormErrorMessageWrapper
							error={
								addWaifuState.isError
									? parseRTKError(addWaifuState.error)
									: undefined
							}
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

						<ImageInput
							currentImage={currentImage}
							imageName={watch('name')}
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
								disabled={!isDirty}
								isLoading={addWaifuState.isLoading}
								colorScheme={isDirty ? 'green' : 'gray'}
							>
								add my waifu
							</Button>
						</HStack>
					</VStack>
				</form>
			</VStack>
		</ProtectedPage>
	);
}
