import { User } from '@prisma/client';

export interface DeleteMediaService {
	userId: User['id'];
	mediaId: User['id'];
}
