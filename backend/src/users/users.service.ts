import { Injectable } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserProfilePictureDto } from './dtos/updateUserProfilePicture.dto';

@Injectable()
export class UsersService {
	constructor(
		private prisma: PrismaService,
		private cloudinaryService: CloudinaryService
	) {}

	async updateUserProfilePicture(
		id: string,
		updateUserProfilePictureDto: UpdateUserProfilePictureDto
	) {
		const uploadedImage = await this.cloudinaryService.uploadImage(
			updateUserProfilePictureDto.picture
		);

		return this.prisma.user.update({
			where: { id },
			data: { picture: uploadedImage.url },
		});
	}
}
