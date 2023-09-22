import { useAppDispatch, useAppSelector } from '@wia-client/src/store/hooks';
import {
	resetMediaTitles,
	selectMediaTitles,
} from '@wia-client/src/store/media';
import { getMediaTitlesAction } from '@wia-client/src/store/media/actions';
import { selectAuth, selectUser } from '@wia-client/src/store/user';
import {
	getWaifuToEditFromLocal,
	selectEditWaifu,
	resetGetWaifuToEdit,
} from '@wia-client/src/store/waifu';
import { getWaifuToEditFromServerAction } from '@wia-client/src/store/waifu/actions';
import { parseWaifuId } from '@wia-client/src/utils';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import EditWaifu from './EditWaifu';

const EditWaifuWrapper = () => {
	// redux hooks
	const dispatch = useAppDispatch();
	const { isLoggedIn } = useAppSelector(selectAuth);
	const { data: user, status: userStatus } = useAppSelector(selectUser);
	const { local, server } = useAppSelector(selectEditWaifu);
	const mediaTitlesStatus = useAppSelector(selectMediaTitles);

	// next hooks
	const router = useRouter();
	const waifuId = parseWaifuId(router.query.waifuIdString);

	// react hooks
	useEffect(() => {
		if (userStatus === 'succeeded' && router.isReady) {
			if (local.status === 'idle') {
				dispatch(getWaifuToEditFromLocal({ waifuId, userId: user.id }));
			} else if (local.status === 'failed' && server.status === 'idle') {
				dispatch(getWaifuToEditFromServerAction(waifuId));
			}
		}
	}, [
		dispatch,
		waifuId,
		router.isReady,
		local.status,
		server.status,
		userStatus,
		user.id,
	]);

	useEffect(() => {
		return () => {
			dispatch(resetGetWaifuToEdit());
			dispatch(resetMediaTitles());
		};
	}, [dispatch]);

	useEffect(() => {
		if (mediaTitlesStatus.status === 'idle' && isLoggedIn) {
			dispatch(getMediaTitlesAction());
		}
	}, [dispatch, mediaTitlesStatus.status, isLoggedIn]);

	if (
		(local.status === 'succeeded' || server.status === 'succeeded') &&
		mediaTitlesStatus.status === 'succeeded'
	)
		return <EditWaifu />;
	return null;
};

export default EditWaifuWrapper;
