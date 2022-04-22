import { ErrorResponse, WithId, WithImage } from './commonTypes';
import { User } from './userTypes';

export type MediaType = 'anime' | 'manga' | 'videogame';
export const ValidMediaTypes = ['anime', 'manga', 'videogame'] as const;

export interface RawMedia extends WithId {
	title: string;
	type: MediaType;
	created_at: Date;
	updated_at: Date;
}

export type InsertMedia = Omit<RawMedia, 'id' | 'created_at' | 'updated_at'>;

export interface Media extends WithId, WithImage {
	title: string;
	type: MediaType;
	createdAt: Date;
	updatedAt: Date;
	knownBy: KnownBy[];
}

export interface MediaInput
	extends Omit<
		Media,
		'id' | 'createdAt' | 'updatedAt' | 'knownBy' | 'imagePath'
	> {
	imageFormat?: string;
}

export interface UpdateMediaInput {
	id: number;
	title?: string;
	imagePath?: string;
}

export interface RawMediaFilter {
	cursor?: string;
	users?: string;
	title?: string;
	type?: string;
	limit?: string;
}

export interface MediaFilter {
	cursor: string;
	users?: number[];
	title?: string;
	type?: MediaType[];
	limit: number;
}

export interface KnownBy {
	knownAt: Date;
	user: User;
}

export interface MediaResponse extends ErrorResponse {
	media?: Media | Media[];
}

export interface RawMediaImage {
	media_id: number;
	image_id: number;
}

export interface RawKnownMedia {
	media_id: number;
	user_id: number;
	known_at: Date;
}

export interface KnownMediaInput {
	mediaId: number;
	knownAt: string;
}

export interface RawFilteredMedia {
	title: string;
	type: MediaType;
	created_at: Date;
	updated_at: Date;
	media_id: number;
	user_id: number;
	known_at: Date;
	alias: string;
	first_name: string;
	last_name: string;
	email: string;
	uid: string;
	media_image_path: string | null;
	user_image_path: string | null;
}

export interface RawMediaWithImage
	extends Omit<RawMedia, 'created_at' | 'updated_at'> {
	image_path: string | null;
}
