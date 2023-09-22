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
import LinkButton from '@wia-client/src/components/common/LinkButton';
import { useAppDispatch } from '@wia-client/src/store/hooks';
import { deleteWaifuAction } from '@wia-client/src/store/waifu/actions';
import { Waifu } from '@prisma/client';
import { useRouter } from 'next/router';

interface WaifuActionButtonsProps {
	isLoggedIn: boolean;
	waifuIsOwn: boolean;
	waifuId: Waifu['id'];
}

function WaifuActionButtons({
	isLoggedIn,
	waifuId,
	waifuIsOwn,
}: WaifuActionButtonsProps) {
	// rtk hooks
	const dispatch = useAppDispatch();

	// next hooks
	const router = useRouter();

	// chakra hooks
	const { isOpen, onOpen, onClose } = useDisclosure();

	// functions
	const handleDeleteWaifu = async () => {
		const from = (): Parameters<typeof deleteWaifuAction>[0]['from'] => {
			if (router.pathname === '/waifus') return '/waifus';
			if (router.pathname === '/media/waifus') return '/media/waifus';
			throw new Error('delete waifu from illegal place');
		};
		dispatch(deleteWaifuAction({ waifuId, from: from() }));
	};

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
						<ModalBody>
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
	return null;
}

export default WaifuActionButtons;
