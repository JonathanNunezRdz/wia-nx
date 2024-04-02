import {
	Input,
	FormControl,
	FormLabel,
	VStack,
	Button,
	Text,
	HStack,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useEffect } from 'react';

import { KnowMediaDto } from '@wia-nx/types';
import { useKnowMediaMutation } from '@wia-client/src/store';
import {
	formatDate,
	parseMediaId,
	parseMediaType,
	parseRTKError,
	prepareDate,
	mediaLabel,
} from '@wia-client/src/utils';
import ProtectedPage from '@wia-client/src/components/auth/ProtectedPage';
import PageTitle from '@wia-client/src/components/common/PageTitle';
import FormErrorMessageWrapper from '@wia-client/src/components/common/FormErrorMessageWrapper';

const KnowMedia = () => {
	// redux hooks
	const [knowMedia, knowMediaState] = useKnowMediaMutation();

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
		console.log('knowning media');
		const newValues = {
			...data,
			knownAt: prepareDate(data.knownAt),
		};
		knowMedia(newValues);
	};

	// effects
	useEffect(() => {
		if (knowMediaState.isSuccess && router.isReady) {
			router.push('/media');
		}
	}, [knowMediaState, router]);

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
						<FormErrorMessageWrapper
							error={
								knowMediaState.isError
									? parseRTKError(knowMediaState.error)
									: undefined
							}
						/>

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
								isLoading={knowMediaState.isLoading}
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
