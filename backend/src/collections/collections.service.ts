import { Injectable } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCollectionDto } from './dtos/createCollection.dto';

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
		const { name, description, image } = data;

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
			},
		});
	}

	async deleteCollection(id: string, userId: string) {
		return await this.prisma.collection.delete({ where: { id, userId } });
	}
}
