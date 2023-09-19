import { PrismaClient } from '@prisma/client';
import { hash } from 'argon2';

const prisma = new PrismaClient();

async function main() {
	const defaultPassword = await hash('password');
	await prisma.user.createMany({
		data: [
			{
				firstName: 'Andres',
				lastName: 'Rodriguez',
				alias: 'Unrehabed Weeb-kun',
				email: 'pollo@pollo.com',
				uid: 'BEbl1URphTMyZMTJoa320lcG5BM2',
				hash: defaultPassword,
			},
			{
				firstName: 'Jonathan',
				lastName: 'Nunez',
				alias: 'Genshin-chan',
				email: 'jonas@jonas.com',
				uid: 'aYw8GfjrmfW09sZG12NX6cVJNfE2',
				hash: defaultPassword,
			},
			{
				firstName: 'Mauricio',
				lastName: 'Castillo',
				alias: 'Vtuber-sensei',
				email: 'casti@casti.com',
				uid: '7upYs7GTQ1hBvSZD8psp54AiDl03',
				hash: defaultPassword,
			},
			{
				firstName: 'Oscar',
				lastName: 'Alvarado',
				alias: 'El Guero-shounen',
				email: 'oscar@oscar.com',
				uid: 'elTDsDLNwtZiVzwfTXa0YZO3BUx1',
				hash: defaultPassword,
			},
		],
	});
	// const usersId = await prisma.user.findMany({
	// 	select: {
	// 		id: true,
	// 		firstName: true,
	// 	},
	// 	orderBy: {
	// 		firstName: 'asc',
	// 	},
	// });

	// const insertMedia: Prisma.MediaCreateInput[] = [
	// 	{
	// 		title: 'Bleach',
	// 		type: 'anime',
	// 		knownBy: {
	// 			create: [
	// 				{
	// 					userId: usersId[0].id,
	// 					knownAt: new Date(),
	// 				},
	// 				{
	// 					userId: usersId[1].id,
	// 					knownAt: new Date(),
	// 				},
	// 				{
	// 					userId: usersId[2].id,
	// 					knownAt: new Date(),
	// 				},
	// 			],
	// 		},
	// 		waifus: {
	// 			create: [
	// 				{
	// 					level: 'chunin',
	// 					name: 'Rukia Kuchiki',
	// 					since: new Date(),
	// 					userId: usersId[0].id,
	// 				},
	// 				{
	// 					level: 'chunin',
	// 					name: 'Orihime Inoue',
	// 					since: new Date(),
	// 					userId: usersId[2].id,
	// 				},
	// 				{
	// 					level: 'chunin',
	// 					name: 'Nanao Ise',
	// 					since: new Date(),
	// 					userId: usersId[1].id,
	// 				},
	// 			],
	// 		},
	// 	},
	// ];

	// const inserMediaPromises = insertMedia.map((media) => {
	// 	return prisma.media.create({
	// 		data: media,
	// 	});
	// });

	// await Promise.all(inserMediaPromises);
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
