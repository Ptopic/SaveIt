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
			return getRestaurantAdditionalInfo(result);
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

	for (const place of placesArray) {
		const name = removeEmojiFromText(place?.Name) || '';
		const city = place?.City || '';
		const country = place?.Country || '';

		const query = `${name}, ${city || country}`;
		queries.push(query);
	}

	const placeDetails = await getOutscraperData(queries);

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

			// TODO: Cache scraped place data

			const createdPlace = await prisma.place.create({
				data: {
					name: name,
					description: scrapedPlaceData?.description || place.Description,
					emoji: emoji,
					photo: scrapedPlaceData?.photo,
					importId: importId,
				},
			});

			const location = await prisma.location.create({
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

	// const queries = [
	// 	`${name}, ${city}, ${country}`,
	// 	`${name}, ${city}`,
	// 	`${name}, ${country}`,
	// 	`${name}`,
	// ];

	// for (const query of queries) {
	// 	const response = await axios.get(
	// 		`${process.env.NOMINATIM_URL}/search?q=${query}&format=json&limit=1&addressdetails=1&namedetails=1&extratags=1`
	// 	);

	// 	const placeDetails = response.data.map((place) => {
	// 		return {
	// 			cordinates: place.lat + ',' + place.lon,
	// 			address: place.display_name,
	// 			phone: place.extratags?.phone,
	// 			email: place.extratags?.email,
	// 			website: place.extratags?.website,
	// 			openingHours: place?.extratags?.opening_hours,
	// 			indoor_seating: place.extratags?.indoor_seating,
	// 			outdoor_seating: place.extratags?.outdoor_seating,
	// 			wheelchair: place.extratags?.wheelchair,
	// 		};
	// 	});

	// 	if (placeDetails.length > 0) {
	// 		const createdPlace = await prisma.place.create({
	// 			data: {
	// 				name: name,
	// 				description: place.Description,
	// 				emoji: emoji,
	// 				importId: importId,
	// 			},
	// 		});

	// 		const importLocation = await prisma.importLocation.create({
	// 			data: {
	// 				name: name,
	// 				city: city,
	// 				country: place.Country,
	// 				flag: place.Flag,
	// 				coordinates: placeDetails[0]?.cordinates,
	// 				emoji: emoji,
	// 				address: placeDetails[0]?.address,
	// 				bestTimeToVisit: place['Best time to visit'],
	// 				description: place.Description,
	// 				openingHours: placeDetails[0]?.openingHours,
	// 				phone: placeDetails[0]?.phone,
	// 				email: placeDetails[0]?.email,
	// 				website: placeDetails[0]?.website,
	// 				indoor_seating: placeDetails[0]?.indoor_seating,
	// 				outdoor_seating: placeDetails[0]?.outdoor_seating,
	// 				wheelchair: placeDetails[0]?.wheelchair,
	// 				placeId: createdPlace.id,
	// 				userId: userId,
	// 			},
	// 		});

	// 		await prisma.importLocationTip.createMany({
	// 			data: place.Tips.map((tip) => ({
	// 				tip: tip,
	// 				importLocationId: importLocation.id,
	// 			})),
	// 		});

	// 		await prisma.importLocationHighlight.createMany({
	// 			data: place.Highlights.map((highlight) => ({
	// 				highlight: highlight,
	// 				importLocationId: importLocation.id,
	// 			})),
	// 		});

	// 		await prisma.importLocationCategory.createMany({
	// 			data: place.Categories.map((category) => ({
	// 				category: category,
	// 				importLocationId: importLocation.id,
	// 			})),
	// 		});

	// 		break;
	// 	}
	// }
	// }
}

function getRestaurantAdditionalInfo(result: any) {
	return result;
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
