import {
	Input,
	FormControl,
	FormLabel,
	VStack,
	Button,
	Text,
	HStack,
} from '@chakra-ui/react';
import { KnowMediaDto } from '@wia-nx/types';
import { useRouter } from 'next/router';

import { useAppDispatch, useAppSelector } from '@wia-client/src/store/hooks';
import { selectKnowMedia } from '@wia-client/src/store/media';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
	formatDate,
	parseMediaId,
	parseMediaType,
	prepareDate,
} from '@wia-client/src/utils';
import ProtectedPage from '@wia-client/src/components/auth/ProtectedPage';
import PageTitle from '@wia-client/src/components/common/PageTitle';
import { knowMediaAction } from '@wia-client/src/store/media/actions';
import FormErrorMessageWrapper from '@wia-client/src/components/common/FormErrorMessageWrapper';
import { mediaLabel } from '@wia-client/src/utils/constants';

const KnowMedia = () => {
	// redux hooks
	const dispatch = useAppDispatch();
	const { status, error } = useAppSelector(selectKnowMedia);

	// next hooks
	const router = useRouter();
	const { mediaTitle, mediaTypeString, mediaIdString } = router.query;
	const mediaType = parseMediaType(mediaTypeString);
	const mediaId = parseMediaId(mediaIdString);

	// react hooks

	// react-hook-form
	const { register, handleSubmit } = useForm<KnowMediaDto>({
		defaultValues: {
			mediaId,
			knownAt: formatDate(),
		},
	});

	// functions
	const onSubmit: SubmitHandler<KnowMediaDto> = async (data) => {
		console.log('submitting knowMediaDto');

		const newValues = {
			...data,
			knownAt: prepareDate(data.knownAt),
		};

		const res = await dispatch(knowMediaAction(newValues));
		if (res.meta.requestStatus === 'fulfilled') router.push('/media');
	};

	// render
	if (!mediaType) return null;
	return (
		<ProtectedPage originalUrl='/media/know'>
			<VStack w='full' spacing='1rem'>
				<PageTitle title='know media'>
					<Text fontSize='1.5rem'>{mediaTitle}</Text>
				</PageTitle>
				<form onSubmit={handleSubmit(onSubmit)}>
					<VStack spacing='4'>
						<FormErrorMessageWrapper error={error?.message} />

						<FormControl>
							<FormLabel htmlFor='knownAt'>
								when did you {mediaLabel.present[mediaType]} it?
							</FormLabel>
							<Input
								id='knownAt'
								type='date'
								max={formatDate()}
								{...register('knownAt')}
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
								isLoading={status === 'loading'}
								colorScheme='green'
							>
								know media
							</Button>
						</HStack>
					</VStack>
				</form>
			</VStack>
		</ProtectedPage>
	);
};

export default KnowMedia;
