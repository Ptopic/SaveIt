import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LocationsService {
	constructor(private readonly prisma: PrismaService) {}

	async getAllLocations(userId: string, searchQuery?: string) {
		const locations = await this.prisma.location.findMany({
			where: {
				importLocation: {
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
						importLocation: {
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
				importLocation: {
					include: {
						highlights: true,
						tips: true,
						categories: true,
						mustTryDishes: true,
						place: true,
						restaurant: true,
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

				const allHighlights = location.importLocation.flatMap((importLoc) =>
					importLoc.highlights.map((highlight) => highlight.highlight)
				);

				const allTips = location.importLocation.flatMap((importLoc) =>
					importLoc.tips.map((tip) => tip.tip)
				);

				const allCategories = location.importLocation.flatMap((importLoc) =>
					importLoc.categories.map((category) => category.category)
				);

				const allMustTryDishes = location.importLocation.flatMap((importLoc) =>
					importLoc.mustTryDishes.map((dish) => dish.dish)
				);

				const place =
					location.importLocation.find((importLoc) => importLoc.place)?.place ||
					null;
				const restaurant =
					location.importLocation.find((importLoc) => importLoc.restaurant)
						?.restaurant || null;

				const emoji = place?.emoji || restaurant?.emoji || null;

				const { importLocation, ...locationBase } = location;

				uniqueLocations.push({
					...locationBase,
					emoji,
					highlights: allHighlights,
					tips: allTips,
					categories: allCategories,
					mustTryDishes: allMustTryDishes,
					place,
					restaurant,
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
				mustTryDishes: true,
				place: true,
				restaurant: true,
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
				mustTryDishes: true,
				place: true,
				restaurant: true,
			},
		});
	}
}
