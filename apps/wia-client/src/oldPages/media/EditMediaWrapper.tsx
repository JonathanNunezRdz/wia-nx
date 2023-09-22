import { useAppDispatch, useAppSelector } from '@wia-client/src/store/hooks';
import {
	getMediaToEditFromLocal,
	resetGetMediaToEdit,
	selectEditMedia,
} from '@wia-client/src/store/media';
import { getMediaToEditFromServerAction } from '@wia-client/src/store/media/actions';
import { selectUser } from '@wia-client/src/store/user';
import { parseMediaId } from '@wia-client/src/utils';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import EditMedia from './EditMedia';

const EditMediaWrapper = () => {
	// redux hooks
	const dispatch = useAppDispatch();
	const { data: user, status: userStatus } = useAppSelector(selectUser);
	const { local, server } = useAppSelector(selectEditMedia);

	// next hooks
	const router = useRouter();
	const mediaId = parseMediaId(router.query.mediaIdString);

	// react hooks
	useEffect(() => {
		if (userStatus === 'succeeded' && router.isReady) {
			if (local.status === 'idle') {
				dispatch(getMediaToEditFromLocal({ mediaId, userId: user.id }));
			} else if (local.status === 'failed' && server.status === 'idle') {
				dispatch(getMediaToEditFromServerAction(mediaId));
			}
		}
	}, [
		dispatch,
		mediaId,
		router.isReady,
		local.status,
		server.status,
		userStatus,
		user.id,
	]);

	useEffect(() => {
		return () => {
			dispatch(resetGetMediaToEdit());
		};
	}, [dispatch]);

	if (local.status === 'succeeded' || server.status === 'succeeded')
		return <EditMedia />;

	return null;
};

export default EditMediaWrapper;
