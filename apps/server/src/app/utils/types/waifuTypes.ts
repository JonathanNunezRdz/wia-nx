import { ErrorResponse, WithId, WithImage } from './commonTypes';
import { Media, MediaType } from './mediaTypes';
import { User } from './userTypes';

export type WaifuLevel =
	| 'top_waifu'
	| 'jonin'
	| 'chunin'
	| 'genin'
	| 'free_agent';

export const ValidWaifuLevels = [
	'top_waifu',
	'jonin',
	'chunin',
	'genin',
	'free_agent',
] as const;

export interface RawWaifu extends WithId {
	name: string;
	level: WaifuLevel;
	user_id: number;
	media_id: number;
	since: Date;
	created_at: Date;
}

export type InsertWaifu = Omit<RawWaifu, 'id' | 'created_at'>;

export interface Waifu extends WithId, WithImage {
	name: string;
	level: WaifuLevel;
	user: User;
	media: Omit<Media, 'knownBy' | 'createdAt' | 'updatedAt'>;
	since: Date;
	createdAt: Date;
}

export interface WaifuInput
	extends Omit<
		Waifu,
		'id' | 'since' | 'userId' | 'imagePath' | 'media' | 'user' | 'createdAt'
	> {
	imageFormat?: string;
	mediaId: number;
}

export interface UpdateWaifuInput {
	id: number;
	name?: string;
	level?: WaifuLevel;
	imagePath?: string;
}

export interface WaifuResponse extends ErrorResponse {
	waifu?: Waifu | Waifu[];
}

export interface RawWaifuImage {
	waifu_id: number;
	image_id: number;
}

export interface RawWaifuFilter {
	cursor?: string;
	user?: string;
	name?: string;
	level?: string;
	limit?: string;
}

export interface WaifuFilter {
	cursor: string;
	user?: number;
	name?: string;
	level?: WaifuLevel[];
	limit: number;
}

export interface RawFilteredWaifus {
	waifu_id: number;
	user_id: number;
	alias: string;
	first_name: string;
	last_name: string;
	email: string;
	uid: string;
	name: string;
	level: WaifuLevel;
	media_id: number;
	since: Date;
	created_at: Date;
	title: string;
	type: MediaType;
	waifu_image_path: string | null;
	user_image_path: string | null;
	media_image_path: string | null;
}
