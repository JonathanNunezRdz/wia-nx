export interface WithId {
	id: number;
}

export interface WithImage {
	hasImage: boolean;
	imagePath?: string;
}

export interface Error {
	field: string;
	message: string;
}

export interface ErrorResponse {
	errors?: Error[];
}
