import { useAppDispatch } from '@wia-client/src/store/hooks';

import { useGetMembersQuery } from '@wia-client/src/store/user';

function AddTrade() {
	//rtk hooks
	const dispatch = useAppDispatch();
	// const addTrade = useAppSelector(selectAddTrade);
	const membersQuery = useGetMembersQuery();
	// write getMediaTitlesFromUser
	// write getWaifusFromMediaFromUser
	return null;
}

export default AddTrade;
