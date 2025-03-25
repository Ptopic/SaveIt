import { BadRequestException, Injectable } from '@nestjs/common';
import toStream from 'buffer-to-stream';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';

@Injectable()
export class CloudinaryService {
	private readonly allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

	async uploadImage(
		file: Express.Multer.File | string
	): Promise<UploadApiResponse | UploadApiErrorResponse> {
		if (typeof file === 'string') {
			return new Promise((resolve, reject) => {
				v2.uploader.upload(file, (error, result) => {
					if (error) return reject(error);
					resolve(result);
				});
			});
		}

		if (!this.allowedMimeTypes.includes(file.mimetype)) {
			throw new BadRequestException('Invalid file type.');
		}

		return new Promise((resolve, reject) => {
			const upload = v2.uploader.upload_stream((error, result) => {
				if (error) return reject(error);
				resolve(result);
			});

			toStream(file.buffer).pipe(upload);
		});
	}
}
