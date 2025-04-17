import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LocationsService {
	constructor(private readonly prisma: PrismaService) {}

	async getAllLocations(userId: string, searchQuery?: string) {
		const locations = await this.prisma.importLocation.findMany({
			where: {
				userId,
				OR: [
					{ name: { contains: searchQuery, mode: 'insensitive' } },
					{ address: { contains: searchQuery, mode: 'insensitive' } },
					{ city: { contains: searchQuery, mode: 'insensitive' } },
					{ country: { contains: searchQuery, mode: 'insensitive' } },
					{
						categories: {
							some: {
								category: { contains: searchQuery, mode: 'insensitive' },
							},
						},
					},
				],
			},
			include: {
				highlights: {
					select: {
						highlight: true,
					},
				},
				tips: {
					select: {
						tip: true,
					},
				},
				categories: {
					select: {
						category: true,
					},
				},
			},
		});

		const uniqueLocations = [];
		const seenIdentifiers = new Set();

		for (const location of locations) {
			const [latitude, longitude] = location.coordinates.split(',');
			const identifier = `${location.name}-${latitude}-${longitude}`;
			if (!seenIdentifiers.has(identifier)) {
				seenIdentifiers.add(identifier);
				uniqueLocations.push({
					...location,
					highlights: location.highlights.map(
						(highlight) => highlight.highlight
					),
					tips: location.tips.map((tip) => tip.tip),
					categories: location.categories.map((category) => category.category),
				});
			}
		}

		return uniqueLocations;
	}

	async getLocationById(id: string) {
		return this.prisma.importLocation.findUnique({
			where: { id },
			include: {
				highlights: true,
				tips: true,
				categories: true,
			},
		});
	}

	async getLocationByImportId(importId: string) {
		return this.prisma.importLocation.findMany({
			where: { importId },
			include: {
				highlights: true,
				tips: true,
				categories: true,
			},
		});
	}
}
