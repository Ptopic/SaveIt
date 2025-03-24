import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CollectionsService {
	constructor(private readonly prisma: PrismaService) {}

	async getCollections(
		userId: string,
		page: string,
		searchQuery: string,
		pageSize: string
	) {
		const collections = await this.prisma.collection.findMany({
			where: { userId, name: { contains: searchQuery, mode: 'insensitive' } },
			skip: parseInt(page) * parseInt(pageSize),
			take: parseInt(pageSize),
		});

		const totalCollections = await this.prisma.collection.count({
			where: { userId, name: { contains: searchQuery, mode: 'insensitive' } },
		});

		return { collections, totalCollections };
	}

	async getCollection(id: string, userId: string) {
		return await this.prisma.collection.findUnique({ where: { id, userId } });
	}

	async createCollection(userId: string, data: any) {
		return await this.prisma.collection.create({
			data: { userId, ...data },
		});
	}

	async deleteCollection(id: string, userId: string) {
		return await this.prisma.collection.delete({ where: { id, userId } });
	}
}
