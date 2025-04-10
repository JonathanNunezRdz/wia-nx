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
import PageTitle from '@wia-client/src/components/common/PageTitle';
import WaifuLevelOptions from '@wia-client/src/components/common/WaifuLevelOptions';
import WaifuMediaTitleOptions from '@wia-client/src/components/common/WaifuMediaTitleOptions';
import {
	useAddWaifuMutation,
	useGetLoggedStatusQuery,
	useGetMediaTitlesQuery,
} from '@wia-client/src/store';
import {
	parseMediaId,
	parseRTKError,
	setupImageFile,
	useImage,
} from '@wia-client/src/utils';
import { CreateWaifuDto } from '@wia-nx/types';

export default function AddWaifu() {
	// next hooks
	const router = useRouter();
	const mediaId = parseMediaId(router.query.mediaId);

	// rtk hooks
	const loggedStatus = useGetLoggedStatusQuery();
	const mediaTitlesQuery = useGetMediaTitlesQuery(
		{},
		{ skip: !loggedStatus.isSuccess }
	);
	const [addWaifu, addWaifuState] = useAddWaifuMutation();

	// custom hooks
	const {
		currentImage,
		imageFile,
		handleImageChange,
		imageFormat,
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
	} = useForm<CreateWaifuDto>({
		defaultValues: {
			mediaId,
			name: '',
			level: 'genin',
		},
	});

	// std functions
	const onSubmit: SubmitHandler<CreateWaifuDto> = async (data) => {
		console.log('submitting create waifu');
		const newValues: CreateWaifuDto = {
			...data,
			name: data.name.trim(),
		};
		const sendImage = setupImageFile({ imageFile, name: newValues.name });
		await addWaifu({ waifuDto: newValues, imageFile: sendImage });
		reset();
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

	if (!loggedStatus.isSuccess || !mediaTitlesQuery.isSuccess) return <></>;

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
