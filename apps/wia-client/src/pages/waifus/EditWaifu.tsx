import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
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

import {
	useAppSelector,
	selectAuth,
	useEditWaifuMutation,
	useGetEditWaifuQuery,
} from '@wia-client/src/store';
import {
	formatImageFileName,
	parseRTKError,
	parseWaifuId,
	useImage,
} from '@wia-client/src/utils';
import { EditWaifuDto } from '@wia-nx/types';
import ProtectedPage from '@wia-client/src/components/auth/ProtectedPage';
import PageTitle from '@wia-client/src/components/common/PageTitle';
import FormErrorMessageWrapper from '@wia-client/src/components/common/FormErrorMessageWrapper';
import WaifuLevelOptions from '@wia-client/src/components/common/WaifuLevelOptions';
import WaifuMediaTitleOptions from '@wia-client/src/components/common/WaifuMediaTitleOptions';
import ImageInput from '@wia-client/src/components/common/ImageInput';

const EditWaifu = () => {
	// next hooks
	const router = useRouter();
	const waifuId = parseWaifuId(router.query.waifuIdString);

	// redux hooks
	const { isLoggedIn } = useAppSelector(selectAuth);
	const waifuQuery = useGetEditWaifuQuery(waifuId, {
		skip: !isLoggedIn || !router.isReady || waifuId === '',
	});
	const [editWaifu, editWaifuState] = useEditWaifuMutation();

	// custom hooks
	const {
		currentImage,
		handleImageChange,
		imageFile,
		imageFormat,
		resetImage,
	} = useImage();

	// react-hook-form
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { isDirty, errors },
	} = useForm<EditWaifuDto>();

	// std function
	const onSubmit: SubmitHandler<EditWaifuDto> = (data) => {
		console.log('submitting edit waifu');
		if (!waifuQuery.isSuccess) return;

		const newValues: EditWaifuDto = {
			...data,
			name: data.name?.trim(),
		};

		if (imageFile) {
			const format = imageFile.type.split('/').pop();
			const completeFileName = formatImageFileName(
				newValues.name || waifuQuery.data.name,
				format
			);
			const sendImage = new File([imageFile], completeFileName, {
				type: imageFile.type,
			});
			editWaifu({ editDto: newValues, imageFile: sendImage });
		} else {
			const { imageFormat, ...rest } = newValues;
			editWaifu({
				editDto: rest,
			});
		}
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
