import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LocationsService {
	constructor(private readonly prisma: PrismaService) {}

	async getAllLocations(userId: string, searchQuery?: string) {
		const locations = await this.prisma.location.findMany({
			where: {
				ImportLocation: {
					some: {
						userId,
					},
				},
				OR: [
					{ name: { contains: searchQuery, mode: 'insensitive' } },
					{ address: { contains: searchQuery, mode: 'insensitive' } },
					{ city: { contains: searchQuery, mode: 'insensitive' } },
					{ country: { contains: searchQuery, mode: 'insensitive' } },
					{
						ImportLocation: {
							some: {
								categories: {
									some: {
										category: { contains: searchQuery, mode: 'insensitive' },
									},
								},
							},
						},
					},
				],
			},
			include: {
				ImportLocation: {
					include: {
						highlights: true,
						tips: true,
						categories: true,
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

				const allHighlights = location.ImportLocation.flatMap((importLoc) =>
					importLoc.highlights.map((highlight) => highlight.highlight)
				);

				const allTips = location.ImportLocation.flatMap((importLoc) =>
					importLoc.tips.map((tip) => tip.tip)
				);

				const allCategories = location.ImportLocation.flatMap((importLoc) =>
					importLoc.categories.map((category) => category.category)
				);

				uniqueLocations.push({
					...location,
					highlights: allHighlights,
					tips: allTips,
					categories: allCategories,
				});
			}
		}

		return uniqueLocations;
	}

	async getLocationById(id: string) {
		return this.prisma.importLocation.findUnique({
			where: { id },
			include: {
				location: true,
				highlights: true,
				tips: true,
				categories: true,
			},
		});
	}

	async getLocationByImportId(importId: string) {
		return this.prisma.importLocation.findMany({
			where: { place: { importId } },
			include: {
				location: true,
				highlights: true,
				tips: true,
				categories: true,
			},
		});
	}
}
