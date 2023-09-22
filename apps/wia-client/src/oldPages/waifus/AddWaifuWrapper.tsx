import { useAppDispatch, useAppSelector } from '@wia-client/src/store/hooks';
import {
	resetMediaTitles,
	selectMediaTitles,
} from '@wia-client/src/store/media';
import { getMediaTitlesAction } from '@wia-client/src/store/media/actions';
import { selectAuth } from '@wia-client/src/store/user';
import { resetAddWaifuStatus } from '@wia-client/src/store/waifu';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import AddWaifu from './AddWaifu';

export default function AddWaifuWrapper() {
	// redux hooks
	const dispatch = useAppDispatch();
	const { isLoggedIn } = useAppSelector(selectAuth);
	const mediaTitlesStatus = useAppSelector(selectMediaTitles);

	// next hooks
	const router = useRouter();

	// react hooks
	useEffect(() => {
		return () => {
			dispatch(resetAddWaifuStatus());
			dispatch(resetMediaTitles());
		};
	}, [dispatch]);

	useEffect(() => {
		if (mediaTitlesStatus.status === 'idle' && isLoggedIn) {
			dispatch(getMediaTitlesAction());
		}
	}, [dispatch, mediaTitlesStatus.status, isLoggedIn]);

	if (mediaTitlesStatus.status === 'succeeded' && router.isReady)
		return <AddWaifu />;
	return null;
}
