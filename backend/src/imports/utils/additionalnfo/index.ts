import { PrismaClient } from '@prisma/client';
import { removeEmojiFromText } from 'src/utils/emoji';
import { getOutscraperData } from '../outscraper';

const prisma = new PrismaClient();

export async function getAdditionalInfoByContentType(
	result: any,
	userId: string,
	importId: string
) {
	switch (result.type) {
		case 'Recipe':
			return getRecipeAdditionalInfo(result);
		case 'Place':
			return getPlaceAdditionalInfo(result, userId, importId);
		case 'Restaurant':
			return getRestaurantAdditionalInfo(result, userId, importId);
		case 'Software':
			return getSoftwareAdditionalInfo(result);
		case 'Film/Show':
			return getFilmShowAdditionalInfo(result);
		case 'Workout Routine':
			return getWorkoutRoutineAdditionalInfo(result);
		case 'Book':
			return getBookAdditionalInfo(result);
		case 'Product':
			return getProductAdditionalInfo(result);
		case 'Event':
			return getEventAdditionalInfo(result);
		case 'Other':
			return getOtherAdditionalInfo(result);
	}
}

function getRecipeAdditionalInfo(result: any) {
	return result;
}

async function getPlaceAdditionalInfo(
	result: any,
	userId: string,
	importId: string
) {
	const places = result.summary;

	const placesArray = Array.isArray(places) ? places : [places];

	let queries = [];

	const placeDetails = [];

	for (const place of placesArray) {
		const name = removeEmojiFromText(place?.Name) || '';
		const city = place?.City || '';
		const country = place?.Country || '';

		const query = `${name}, ${city || country}`;

		const cachedLocation = await prisma.location.findFirst({
			where: {
				name: name,
				city: city,
				country: country,
			},
		});

		if (cachedLocation) {
			placeDetails.push(cachedLocation);
			continue;
		}

		queries.push(query);
	}

	if (queries.length > 0) {
		const scrapedPlaceDetails = await getOutscraperData(queries);
		placeDetails.push(...scrapedPlaceDetails);
	}

	for (const [index, place] of placesArray.entries()) {
		const emoji = place?.Name?.match(/[^\p{L}\p{N}\s]/gu)?.[0] || '';
		const name = emoji ? removeEmojiFromText(place?.Name) : place?.Name;
		const city = place?.City || '';

		if (placeDetails[index] !== null) {
			const placeDetail = placeDetails[index][0];

			const scrapedPlaceData = {
				name: placeDetail?.name,
				placeId: placeDetail?.place_id,
				googleId: placeDetail?.google_id,
				address: placeDetail?.full_address,
				coordinates: placeDetail?.latitude + ',' + placeDetail?.longitude,
				popularTimes: placeDetail?.popular_times,
				website: placeDetail?.site,
				phone: placeDetail?.phone,
				type: placeDetail?.type,
				description: placeDetail?.description,
				typicalTimeSpent: placeDetail?.typical_time_spent,
				reviewsTags: placeDetail?.reviews_tags,
				reviewsAverage: placeDetail?.rating,
				reviewsCount: placeDetail?.reviews,
				photo: placeDetail?.photo,
				openingHours: placeDetail?.working_hours
					? Object.entries(placeDetail.working_hours)
							.map(([day, hours]) => `${day}: ${hours}`)
							.join('; ')
					: null,
				businessStatus: placeDetail?.business_status,
				priceRange: placeDetail?.range,
				locationLink: placeDetail?.location_link,
			};

			const createdPlace = await prisma.place.create({
				data: {
					name: name,
					description: scrapedPlaceData?.description || place.Description,
					emoji: emoji,
					photo: scrapedPlaceData?.photo,
					importId: importId,
				},
			});

			const cachedLocation = await prisma.location.findFirst({
				where: {
					name: name,
					city: city,
					country: place.Country,
				},
			});

			let location;

			if (!cachedLocation) {
				location = await prisma.location.create({
					data: {
						name: name,
						city: city,
						country: place.Country,
						emoji: emoji,
						flag: place.Flag,
						coordinates: scrapedPlaceData?.coordinates,
						placeId: scrapedPlaceData?.placeId,
						googleId: scrapedPlaceData?.googleId,
						typicalTimeSpent: scrapedPlaceData?.typicalTimeSpent,
						businessStatus: scrapedPlaceData?.businessStatus,
						locationLink: scrapedPlaceData?.locationLink,
						type: scrapedPlaceData?.type,
						priceRange: scrapedPlaceData?.priceRange,
						address: scrapedPlaceData?.address,
						bestTimeToVisit: place['Best time to visit'],
						description: scrapedPlaceData?.description || place.Description,
						openingHours: scrapedPlaceData?.openingHours,
						phone: scrapedPlaceData?.phone,
						website: scrapedPlaceData?.website,
						reviewsCount: scrapedPlaceData?.reviewsCount,
						reviewsAverage: scrapedPlaceData?.reviewsAverage,
						photo: scrapedPlaceData?.photo,
					},
				});
			} else {
				location = cachedLocation;
			}

			const importLocation = await prisma.importLocation.create({
				data: {
					locationId: location.id,
					placeId: createdPlace.id,
					userId: userId,
				},
			});

			if (place.Tips) {
				await prisma.importLocationTip.createMany({
					data: place.Tips.map((tip) => ({
						tip: tip,
						importLocationId: importLocation.id,
					})),
				});
			}

			if (place.Highlights) {
				await prisma.importLocationHighlight.createMany({
					data: place.Highlights.map((highlight) => ({
						highlight: highlight,
						importLocationId: importLocation.id,
					})),
				});
			}

			if (place.Categories) {
				await prisma.importLocationCategory.createMany({
					data: place.Categories.map((category) => ({
						category: category,
						importLocationId: importLocation.id,
					})),
				});
			}
		}
	}
}

async function getRestaurantAdditionalInfo(
	result: any,
	userId: string,
	importId: string
) {
	const restaurants = result.summary;

	const restaurantsArray = Array.isArray(restaurants)
		? restaurants
		: [restaurants];

	let queries = [];

	const restaurantDetails = [];

	for (const restaurant of restaurantsArray) {
		const name = removeEmojiFromText(restaurant?.Name) || '';
		const city = restaurant?.City || '';
		const country = restaurant?.Country || '';

		const query = `${name}, ${city || country}`;

		const cachedLocation = await prisma.location.findFirst({
			where: {
				name: name,
				city: city,
				country: country,
			},
		});

		if (cachedLocation) {
			restaurantDetails.push(cachedLocation);
			continue;
		}

		queries.push(query);
	}

	if (queries.length > 0) {
		const scrapedRestaurantDetails = await getOutscraperData(queries);
		restaurantDetails.push(...scrapedRestaurantDetails);
	}

	for (const [index, restaurant] of restaurantsArray.entries()) {
		const emoji = restaurant?.Name?.match(/[^\p{L}\p{N}\s]/gu)?.[0] || '';
		const name = emoji
			? removeEmojiFromText(restaurant?.Name)
			: restaurant?.Name;
		const city = restaurant?.City || '';

		if (restaurantDetails[index] !== null) {
			// Define type for scrapedRestaurantData
			type RestaurantData = {
				name?: string;
				placeId?: string;
				googleId?: string;
				address?: string;
				coordinates?: string;
				popularTimes?: any;
				website?: string;
				phone?: string;
				type?: string;
				description?: string;
				typicalTimeSpent?: string;
				reviewsTags?: any;
				reviewsAverage?: number;
				reviewsCount?: number;
				photo?: string;
				openingHours?: string;
				businessStatus?: string;
				priceRange?: string;
				locationLink?: string;
			};

			let scrapedRestaurantData: RestaurantData = {};
			let restaurantDetail;

			// Check if the detail is a cached location or scraped data
			if (restaurantDetails[index].id) {
				// This is a cached location
				const cachedLocation = restaurantDetails[index];
				scrapedRestaurantData = {
					description: cachedLocation.description,
					photo: cachedLocation.photo,
					coordinates: cachedLocation.coordinates,
					placeId: cachedLocation.placeId,
					googleId: cachedLocation.googleId,
					typicalTimeSpent: cachedLocation.typicalTimeSpent,
					businessStatus: cachedLocation.businessStatus,
					locationLink: cachedLocation.locationLink,
					type: cachedLocation.type,
					priceRange: cachedLocation.priceRange,
					address: cachedLocation.address,
					openingHours: cachedLocation.openingHours,
					phone: cachedLocation.phone,
					website: cachedLocation.website,
					reviewsCount: cachedLocation.reviewsCount,
					reviewsAverage: cachedLocation.reviewsAverage,
				};
			} else {
				// This is scraped data
				restaurantDetail = restaurantDetails[index][0];
				scrapedRestaurantData = {
					name: restaurantDetail?.name,
					placeId: restaurantDetail?.place_id,
					googleId: restaurantDetail?.google_id,
					address: restaurantDetail?.full_address,
					coordinates:
						restaurantDetail?.latitude + ',' + restaurantDetail?.longitude,
					popularTimes: restaurantDetail?.popular_times,
					website: restaurantDetail?.site,
					phone: restaurantDetail?.phone,
					type: restaurantDetail?.type,
					description: restaurantDetail?.description,
					typicalTimeSpent: restaurantDetail?.typical_time_spent,
					reviewsTags: restaurantDetail?.reviews_tags,
					reviewsAverage: restaurantDetail?.rating,
					reviewsCount: restaurantDetail?.reviews,
					photo: restaurantDetail?.photo,
					openingHours: restaurantDetail?.working_hours
						? Object.entries(restaurantDetail.working_hours)
								.map(([day, hours]) => `${day}: ${hours}`)
								.join('; ')
						: null,
					businessStatus: restaurantDetail?.business_status,
					priceRange: restaurantDetail?.range,
					locationLink: restaurantDetail?.location_link,
				};
			}

			const createdRestaurant = await prisma.restaurant.create({
				data: {
					name: name,
					description:
						scrapedRestaurantData?.description || restaurant.Description,
					emoji: emoji,
					photo: scrapedRestaurantData?.photo,
					importId: importId,
				},
			});

			const cachedLocation = await prisma.location.findFirst({
				where: {
					name: name,
					city: city,
					country: restaurant.Country,
				},
			});

			let location;

			if (!cachedLocation) {
				location = await prisma.location.create({
					data: {
						name: name,
						city: city,
						country: restaurant.Country,
						emoji: emoji,
						flag: restaurant.Flag,
						coordinates: scrapedRestaurantData?.coordinates,
						placeId: scrapedRestaurantData?.placeId,
						googleId: scrapedRestaurantData?.googleId,
						typicalTimeSpent: scrapedRestaurantData?.typicalTimeSpent,
						businessStatus: scrapedRestaurantData?.businessStatus,
						locationLink: scrapedRestaurantData?.locationLink,
						type: scrapedRestaurantData?.type,
						priceRange: scrapedRestaurantData?.priceRange,
						address: scrapedRestaurantData?.address,
						bestTimeToVisit: restaurant['Best time to visit'],
						description:
							scrapedRestaurantData?.description || restaurant.Description,
						openingHours: scrapedRestaurantData?.openingHours,
						phone: scrapedRestaurantData?.phone,
						website: scrapedRestaurantData?.website,
						reviewsCount: scrapedRestaurantData?.reviewsCount,
						reviewsAverage: scrapedRestaurantData?.reviewsAverage,
						photo: scrapedRestaurantData?.photo,
					},
				});
			} else {
				location = cachedLocation;
			}

			const importLocation = await prisma.importLocation.create({
				data: {
					locationId: location.id,
					restaurantId: createdRestaurant.id,
					userId: userId,
				},
			});

			if (restaurant['Must-try dishes']) {
				await prisma.importLocationMustTryDish.createMany({
					data: restaurant['Must-try dishes'].map((dish) => ({
						dish: dish,
						importLocationId: importLocation.id,
					})),
				});
			}
		}
	}
}

function getSoftwareAdditionalInfo(result: any) {
	return result;
}

function getFilmShowAdditionalInfo(result: any) {
	return result;
}

function getWorkoutRoutineAdditionalInfo(result: any) {
	return result;
}

function getBookAdditionalInfo(result: any) {
	return result;
}

function getProductAdditionalInfo(result: any) {
	return result;
}

function getEventAdditionalInfo(result: any) {
	return result;
}

function getOtherAdditionalInfo(result: any) {
	return result;
}
