import { AddIcon, CheckIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Box, IconButton } from '@chakra-ui/react';
import LinkButton from '@wia-client/src/components/common/LinkButton';

import { MediaType } from '@prisma/client';
import { useDeleteMediaMutation } from '@wia-client/src/store/media';

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
	handleDeleting: (id: string) => void;
}

function MediaActionButtons({
	isLoggedIn,
	query,
	handleDeleting,
}: MediaActionButtonsProps) {
	// rtk hooks
	const [deleteMedia] = useDeleteMediaMutation();

	// react hooks

	// functions
	const handleDeleteMedia = async () => {
		handleDeleting(query.mediaIdString);
		await deleteMedia({ mediaId: query.mediaIdString });
		handleDeleting('');
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
					}}
				/>
				<IconButton
					aria-label='delete media'
					icon={<DeleteIcon />}
					size='xs'
					colorScheme='red'
					onClick={handleDeleteMedia}
				/>
			</Box>
		);
	if (query.knownByMe === false)
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
	return <></>;
}

export default MediaActionButtons;
