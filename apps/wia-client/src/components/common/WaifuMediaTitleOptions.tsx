import { selectAuth } from '@wia-client/src/store/auth';
import { useAppSelector } from '@wia-client/src/store/hooks';
import { useGetMediaTitlesQuery } from '@wia-client/src/store/media';

function WaifuMediaTitleOptions() {
	// rtk hooks
	const { isLoggedIn } = useAppSelector(selectAuth);
	const mediaTitlesQuery = useGetMediaTitlesQuery({}, { skip: !isLoggedIn });

	//render
	return mediaTitlesQuery.isSuccess ? (
		mediaTitlesQuery.data.map((media) => (
			<option key={media.id} value={media.id}>
				{media.title}
			</option>
		))
	) : (
		<></>
	);
}

export default WaifuMediaTitleOptions;
