import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LocationsService {
	constructor(private readonly prisma: PrismaService) {}

	async getAllLocations(
		userId: string,
		page: string,
		pageSize: string,
		searchQuery?: string
	) {
		const locations = await this.prisma.location.findMany({
			where: {
				importLocation: {
					some: {
						userId,
						location: {
							coordinates: {
								not: {
									equals: null,
								},
							},
						},
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
			skip: parseInt(page) * parseInt(pageSize),
			take: parseInt(pageSize),
			orderBy: {
				createdAt: 'desc',
			},
		});

		const totalLocations = await this.prisma.location.count({
			where: {
				importLocation: {
					some: {
						userId,
						location: {
							coordinates: {
								not: {
									equals: null,
								},
							},
						},
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

		return { locations: uniqueLocations, totalLocations };
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

	async getLocationByImportIdAndCoordinates(
		importId: string,
		latitude: string,
		longitude: string
	) {
		const location = await this.prisma.importLocation.findFirst({
			where: {
				place: { importId },
				location: { coordinates: { contains: `${latitude},${longitude}` } },
			},
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

		if (!location) return null;

		const allHighlights = location.highlights.map(
			(highlight) => highlight.highlight
		);
		const allTips = location.tips.map((tip) => tip.tip);
		const allCategories = location.categories.map(
			(category) => category.category
		);
		const allMustTryDishes = location.mustTryDishes.map((dish) => dish.dish);

		const formattedLocation = {
			id: location.location.id,
			createdAt: location.location.createdAt,
			updatedAt: location.location.updatedAt,
			name: location.location.name,
			placeId: location.location.placeId,
			googleId: location.location.googleId,
			city: location.location.city,
			country: location.location.country,
			flag: location.location.flag,
			coordinates: location.location.coordinates,
			address: location.location.address,
			bestTimeToVisit: location.location.bestTimeToVisit,
			typicalTimeSpent: location.location.typicalTimeSpent,
			businessStatus: location.location.businessStatus,
			locationLink: location.location.locationLink,
			type: location.location.type,
			description: location.location.description,
			openingHours: location.location.openingHours,
			phone: location.location.phone,
			website: location.location.website,
			reviewsCount: location.location.reviewsCount,
			reviewsAverage: location.location.reviewsAverage,
			priceRange: location.location.priceRange,
			photo: location.location.photo,
			emoji: location.place?.emoji || location.restaurant?.emoji || null,
			highlights: allHighlights,
			tips: allTips,
			categories: allCategories,
			mustTryDishes: allMustTryDishes,
		};

		return formattedLocation;
	}
}
