import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ImageFormat, MediaType } from '@prisma/client';
import { ServiceAccount } from 'firebase-admin';
import { cert, initializeApp } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import 'multer';
import serviceAccount from './serviceAccountKey.json';

@Injectable()
export class StorageService {
	private readonly bucket;

	constructor(config: ConfigService) {
		const serviceAccountCred = serviceAccount;
		const privateKey = config.get<string>('FIREBASE_PRIVATE_KEY');
		if (typeof privateKey === 'undefined' || privateKey === '') {
			throw new Error(
				'firebase private key not found, be sure to define it in env'
			);
		}
		serviceAccountCred.private_key = privateKey;
		initializeApp({
			credential: cert(serviceAccountCred as ServiceAccount),
			storageBucket: 'wia-web-app.appspot.com',
		});
		this.bucket = getStorage().bucket();
	}

	getFirebaseImageString(
		name: string,
		type: MediaType | 'waifu' | 'user',
		format: ImageFormat
	) {
		return `${type}_images/${encodeURIComponent(name)}.${format}`;
	}

	async uploadFile(
		file: Express.Multer.File,
		imageFileName: string,
		type: MediaType | 'waifu' | 'user',
		format: ImageFormat
	): Promise<string> {
		const fileName = this.getFirebaseImageString(
			imageFileName,
			type,
			format
		);
		await this.bucket.file(fileName).save(file.buffer);
		return fileName;
	}

	async deleteFile(imageFileName: string): Promise<void> {
		await this.bucket.file(imageFileName).delete();
	}
}
