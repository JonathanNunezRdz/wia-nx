import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import {
	Box,
	Button,
	IconButton,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	useDisclosure,
} from '@chakra-ui/react';
import { Waifu } from '@prisma/client';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useEffect } from 'react';

import { useDeleteWaifuMutation } from '@wia-client/src/store';
import LinkButton from '@wia-client/src/components/common/LinkButton';

interface WaifuActionButtonsProps {
	isLoggedIn: boolean;
	waifuIsOwn: boolean;
	waifuId: Waifu['id'];
	setIsDeleting: Dispatch<SetStateAction<boolean>>;
}

function WaifuActionButtons({
	isLoggedIn,
	waifuId,
	waifuIsOwn,
	setIsDeleting,
}: WaifuActionButtonsProps) {
	// next hooks
	const router = useRouter();

	// rtk hooks
	const [deleteWaifu, deleteWaifuState] = useDeleteWaifuMutation();

	// chakra hooks
	const { isOpen, onOpen, onClose } = useDisclosure();

	// functions
	const handleDeleteWaifu = async () => {
		if (
			router.pathname === '/waifus' ||
			router.pathname === '/media/waifus'
		) {
			deleteWaifu(waifuId);
		}
		// PENDING: check if waifu card (this card) disappears after deleting action
	};

	// effects
	useEffect(() => {
		if (deleteWaifuState.isLoading) {
			setIsDeleting(true);
		}
		if (deleteWaifuState.isSuccess || deleteWaifuState.isError) {
			setIsDeleting(false);
		}
	}, [deleteWaifuState, setIsDeleting]);

	// render
	if (isLoggedIn && waifuIsOwn)
		return (
			<Box>
				<LinkButton
					iconButtonProps={{
						'aria-label': 'edit waifu',
						icon: <EditIcon />,
						size: 'xs',
						me: '1',
						colorScheme: 'yellow',
					}}
					pathname='/waifus/edit'
					query={{
						waifuIdString: waifuId,
					}}
				/>
				<IconButton
					aria-label='delete waifu'
					icon={<DeleteIcon />}
					size='xs'
					colorScheme='red'
					onClick={onOpen}
				/>
				<Modal isOpen={isOpen} onClose={onClose}>
					<ModalOverlay />
					<ModalContent>
						<ModalHeader>careful!</ModalHeader>
						<ModalCloseButton />
						<ModalBody py={4}>
							are you sure you want to delete this waifu? this
							can&apos;t be undone.
						</ModalBody>

						<ModalFooter>
							<Button mr={3} onClick={onClose}>
								cancel
							</Button>
							<Button
								colorScheme='red'
								onClick={handleDeleteWaifu}
							>
								delete
							</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>
			</Box>
		);
	return <></>;
}

export default WaifuActionButtons;
