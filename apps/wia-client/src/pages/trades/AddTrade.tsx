import { useAppDispatch, useAppSelector } from '@wia-client/src/store/hooks';
import { selectMediaTitles } from '@wia-client/src/store/media';
import { selectAddTrade } from '@wia-client/src/store/trade';
import { selectAllUsers } from '@wia-client/src/store/user';
import { selectWaifus } from '@wia-client/src/store/waifu';


function AddTrade() {
    //rtk hooks
    const dispatch = useAppDispatch()
    const addTrade = useAppSelector(selectAddTrade);
    const members = useAppSelector(selectAllUsers);
    // write getMediaTitlesFromUser
    // write getWaifusFromMediaFromUser
    return ();
}

export default AddTrade;