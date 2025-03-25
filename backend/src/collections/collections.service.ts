import { Injectable } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';

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

	async createCollection(userId: string, data: any) {
		const { name, description, base64Image } = data;

		const image = await this.cloudinaryService.uploadImage(base64Image);

		return await this.prisma.collection.create({
			data: { userId, name, description, image: image.url },
		});
	}

	async deleteCollection(id: string, userId: string) {
		return await this.prisma.collection.delete({ where: { id, userId } });
	}
}
