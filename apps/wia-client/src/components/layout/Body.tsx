'use client';
import { Box } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface IBodyProps {
	children: ReactNode;
	v?: boolean;
	h?: boolean;
}

function Body({ children, h, v }: IBodyProps) {
	return (
		<Box
			display='flex'
			alignItems={v ? 'center' : undefined}
			justifyContent={h ? 'center' : undefined}
			minHeight='60vh'
			gap={8}
			mb={8}
			w='full'
		>
			{children}
		</Box>
	);
}

export default Body;
