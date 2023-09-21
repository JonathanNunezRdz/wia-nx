import { IconButton, IconButtonProps } from '@chakra-ui/react';
import { ParsedUrlQueryInput } from 'querystring';
import { Link } from '@chakra-ui/next-js';

interface MyIconButtonProps extends IconButtonProps {
	icon: Required<IconButtonProps>['icon'];
}

interface LinkButtonProps {
	pathname: string;
	query?: string | ParsedUrlQueryInput;
	iconButtonProps: MyIconButtonProps;
}

const LinkButton = ({ pathname, query, iconButtonProps }: LinkButtonProps) => {
	return (
		<Link
			href={{
				pathname,
				query,
			}}
		>
			<IconButton {...iconButtonProps} />
		</Link>
	);
};

export default LinkButton;
