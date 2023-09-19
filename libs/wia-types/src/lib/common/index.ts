export type Status = 'idle' | 'loading' | 'succeeded' | 'failed';

export type CommonError = string | string[] | undefined;

export interface RequestStatus {
	status: Status;
	error: HttpError | undefined;
}

export interface HttpError {
	error: string;
	message: string | string[];
	statusCode: number;
}

export interface JWTPayload {
	email: string;
	exp: number;
	iat: number;
	sub: number;
}

export interface ValidJWT {
	jwt: string;
	valid: true;
}

export interface InvalidJWT {
	valid: false;
}

export type JWTStatus = ValidJWT | InvalidJWT;

export type MyImage = {
	src: string;
};
