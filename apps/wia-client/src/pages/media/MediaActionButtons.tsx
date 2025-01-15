import { AddIcon, CheckIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Box, IconButton } from '@chakra-ui/react';
import { MediaType } from '@prisma/client';
import { useRouter } from 'next/router';

import { useDeleteMediaMutation } from '@wia-client/src/store/media';
import LinkButton from '@wia-client/src/components/common/LinkButton';

interface KnowQuery {
	knownByMe: false;
	mediaIdString: string;
	mediaTitle: string;
	mediaTypeString: MediaType;
}

interface EditQuery {
	knownByMe: true;
	mediaIdString: string;
}

interface MediaActionButtonsProps {
	isLoggedIn: boolean;
	query: KnowQuery | EditQuery;
}

function MediaActionButtons({ isLoggedIn, query }: MediaActionButtonsProps) {
	// rtk hooks
	const [deleteMedia] = useDeleteMediaMutation();

	// next hooks
	const router = useRouter();

	// react hooks

	// functions
	const handleDeleteMedia = async () => {
		if (
			router.pathname === '/media' ||
			router.pathname === '/media/waifus'
		) {
			deleteMedia(query.mediaIdString);
		} else {
			throw new Error('delete media from illegal place');
		}
	};

	// render
	if (!isLoggedIn) return <></>;
	if (query.knownByMe)
		return (
			<Box>
				<LinkButton
					pathname='/waifus/add'
					query={{
						mediaId: query.mediaIdString,
					}}
					iconButtonProps={{
						'aria-label': 'add waifu to media',
						icon: <AddIcon />,
						size: 'xs',
						me: '1',
						colorScheme: 'green',
						title: 'add waifus',
					}}
				/>
				<LinkButton
					pathname='/media/edit'
					query={{
						mediaIdString: query.mediaIdString,
					}}
					iconButtonProps={{
						'aria-label': 'edit media',
						icon: <EditIcon />,
						size: 'xs',
						me: '1',
						colorScheme: 'yellow',
						title: 'edit media',
					}}
				/>
				<IconButton
					aria-label='delete media'
					icon={<DeleteIcon />}
					size='xs'
					colorScheme='red'
					onClick={handleDeleteMedia}
					title='delete media'
				/>
			</Box>
		);

	return (
		<LinkButton
			pathname='/media/know'
			query={{
				mediaIdString: query.mediaIdString,
				mediaTitle: query.mediaTitle,
				mediaTypeString: query.mediaTypeString,
			}}
			iconButtonProps={{
				'aria-label': 'finished it',
				icon: <CheckIcon />,
				size: 'xs',
				colorScheme: 'green',
			}}
		/>
	);
}

export default MediaActionButtons;
