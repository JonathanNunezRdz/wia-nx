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
	useEditWaifuMutation,
	useGetEditWaifuQuery,
	useGetLoggedStatusQuery,
} from '@wia-client/src/store';
import {
	parseRTKError,
	parseWaifuId,
	setupImageFile,
	useImage,
} from '@wia-client/src/utils';
import { EditWaifuDto } from '@wia-nx/types';

const EditWaifu = () => {
	// next hooks
	const router = useRouter();
	const waifuId = parseWaifuId(router.query.waifuIdString);

	// redux hooks
	const loggedStatus = useGetLoggedStatusQuery();
	const waifuQuery = useGetEditWaifuQuery(waifuId, {
		skip: !loggedStatus.isSuccess || !router.isReady || waifuId === '',
	});
	const [editWaifu, editWaifuState] = useEditWaifuMutation();

	// custom hooks
	const {
		currentImage,
		handleImageChange,
		imageFile,
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
		formState: { isDirty, errors },
	} = useForm<EditWaifuDto>();

	// std function
	const onSubmit: SubmitHandler<EditWaifuDto> = async (data) => {
		console.log('submitting edit waifu');
		if (!waifuQuery.isSuccess) return;

		const newValues: EditWaifuDto = {
			...data,
			name: data.name?.trim(),
		};
		const sendImage = setupImageFile({
			imageFile,
			name: newValues.name || waifuQuery.data.name,
		});
		await editWaifu({ editDto: newValues, imageFile: sendImage });
		reset();
	};

	// effects
	useEffect(() => {
		if (waifuQuery.isSuccess) {
			const { data: waifuToEdit } = waifuQuery;
			setValue('mediaId', waifuToEdit.mediaId, { shouldDirty: false });
			setValue('name', waifuToEdit.name, { shouldDirty: false });
			setValue('level', waifuToEdit.level, { shouldDirty: false });
		}
	}, [waifuQuery, setValue]);

	useEffect(() => {
		if (editWaifuState.isSuccess && router.isReady) {
			router.push('/waifus');
		}
	}, [editWaifuState, router]);

	useEffect(() => {
		if (typeof imageFormat !== 'undefined') {
			setValue('imageFormat', imageFormat, { shouldDirty: true });
		}
	}, [imageFormat, setValue]);

	// render
	if (!waifuQuery.isSuccess) return <></>;
	return (
		<ProtectedPage originalUrl='/waifus/edit'>
			<VStack w='full' spacing={4}>
				<PageTitle title='edit waifu' />
				<form onSubmit={handleSubmit(onSubmit)}>
					<VStack spacing={4}>
						<FormErrorMessageWrapper
							error={
								editWaifuState.isError
									? parseRTKError(editWaifuState.error)
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
							imageName={watch('name') || waifuQuery.data.name}
							handleImageChange={handleImageChange}
							handleImageReset={resetImage}
							imageIsLoading={imageIsLoading}
							isLocal={
								currentImage !== waifuQuery.data.image?.src
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
								isLoading={editWaifuState.isLoading}
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

export default EditWaifu;
