import { useAppSelector } from '@wia-client/src/store/hooks';
import { selectMediaTitles } from '@wia-client/src/store/media';

function WaifuMediaTitleOptions() {
	const { data: mediaTitles } = useAppSelector(selectMediaTitles);
	return (
		<>
			{mediaTitles.map((media) => (
				<option key={media.id} value={media.id}>
					{media.title}
				</option>
			))}
		</>
	);
}

export default WaifuMediaTitleOptions;
