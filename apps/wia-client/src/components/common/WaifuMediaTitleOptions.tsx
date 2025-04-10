import { useGetLoggedStatusQuery } from '@wia-client/src/store/auth';
import { useGetMediaTitlesQuery } from '@wia-client/src/store/media';

function WaifuMediaTitleOptions() {
	// rtk hooks
	const loggedStatus = useGetLoggedStatusQuery();
	const mediaTitlesQuery = useGetMediaTitlesQuery(
		{},
		{ skip: !loggedStatus.isSuccess }
	);

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
