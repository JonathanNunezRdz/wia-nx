import { WithId } from './commonTypes';

export interface RawImage extends WithId {
	image_path: string;
}

export type InsertImage = Omit<RawImage, 'id'>;
