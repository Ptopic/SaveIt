import { Injectable, NotFoundException } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCollectionDto } from './dtos/createCollection.dto';
import { UpdateCollectionDto } from './dtos/updateCollection.dto';

@Injectable()
export class CollectionsService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly cloudinaryService: CloudinaryService
	) {}

	async getCollections(
		userId: string,
		page: string,
		pageSize: string,
		searchQuery: string
	) {
		const collections = await this.prisma.collection.findMany({
			where: {
				userId,
				name: { contains: searchQuery, mode: 'insensitive' },
			},
			skip: parseInt(page) * parseInt(pageSize),
			take: parseInt(pageSize),
			orderBy: {
				createdAt: 'desc',
			},
		});

		const totalCollections = await this.prisma.collection.count({
			where: {
				userId,
				name: { contains: searchQuery, mode: 'insensitive' },
			},
		});

		return { collections, totalCollections };
	}

	async getCollection(id: string, userId: string) {
		return await this.prisma.collection.findUnique({ where: { id, userId } });
	}

	async createCollection(userId: string, data: CreateCollectionDto) {
		const { name, description, image, isPublic } = data;

		let uploadedImage;
		if (image) {
			uploadedImage = await this.cloudinaryService.uploadImage(image);
		}

		return await this.prisma.collection.create({
			data: {
				userId,
				name,
				description,
				image: uploadedImage ? uploadedImage.url : null,
				imageId: uploadedImage ? uploadedImage.public_id : null,
				isPublic,
			},
		});
	}

	async updateCollection(
		id: string,
		userId: string,
		data: UpdateCollectionDto
	) {
		const { name, description, oldImage, newImage, isPublic } = data;

		const collection = await this.prisma.collection.findUnique({
			where: { id, userId },
		});

		if (!collection) {
			throw new NotFoundException('Collection not found');
		}

		let image = collection.image;
		let imageId = collection.imageId;

		if (newImage !== null) {
			if (collection.image) {
				await this.cloudinaryService.deleteImage(collection.imageId);
			}
			const uploadedImage = await this.cloudinaryService.uploadImage(newImage);
			image = uploadedImage.url;
			imageId = uploadedImage.public_id;
		} else {
			if (collection.image && oldImage === null) {
				await this.cloudinaryService.deleteImage(collection.imageId);
				image = null;
				imageId = null;
			}
		}

		return await this.prisma.collection.update({
			where: { id, userId },
			data: {
				name,
				description,
				image,
				imageId,
				isPublic,
			},
		});
	}

	async deleteCollection(id: string, userId: string) {
		const collection = await this.prisma.collection.findUnique({
			where: { id, userId },
		});

		if (!collection) {
			throw new NotFoundException('Collection not found');
		}

		if (collection.image) {
			await this.cloudinaryService.deleteImage(collection.imageId);
		}

		return await this.prisma.collection.delete({ where: { id, userId } });
	}
}
