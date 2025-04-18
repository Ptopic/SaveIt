import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { removeEmojiFromText } from 'src/utils/emoji';

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

	for (const place of placesArray) {
		const emoji = place?.Name?.match(/[^\p{L}\p{N}\s]/gu)?.[0] || '';
		const name = removeEmojiFromText(place?.Name) || '';
		const city = place?.City || '';
		const country = place?.Country || '';

		const queries = [
			`${name}, ${city}, ${country}`,
			`${name}, ${city}`,
			`${name}, ${country}`,
			`${name}`,
		];

		for (const query of queries) {
			const response = await axios.get(
				`${process.env.NOMINATIM_URL}/search?q=${query}&format=json&limit=1&addressdetails=1&namedetails=1&extratags=1`
			);

			const placeDetails = response.data.map((place) => {
				return {
					cordinates: place.lat + ',' + place.lon,
					address: place.display_name,
					phone: place.extratags?.phone,
					email: place.extratags?.email,
					website: place.extratags?.website,
					openingHours: place?.extratags?.opening_hours,
					indoor_seating: place.extratags?.indoor_seating,
					outdoor_seating: place.extratags?.outdoor_seating,
					wheelchair: place.extratags?.wheelchair,
				};
			});

			if (placeDetails.length > 0) {
				const createdPlace = await prisma.place.create({
					data: {
						name: name,
						description: place.Description,
						emoji: emoji,
						importId: importId,
					},
				});

				const importLocation = await prisma.importLocation.create({
					data: {
						name: name,
						city: city,
						country: place.Country,
						flag: place.Flag,
						coordinates: placeDetails[0]?.cordinates,
						emoji: emoji,
						address: placeDetails[0]?.address,
						bestTimeToVisit: place['Best time to visit'],
						description: place.Description,
						openingHours: placeDetails[0]?.openingHours,
						phone: placeDetails[0]?.phone,
						email: placeDetails[0]?.email,
						website: placeDetails[0]?.website,
						indoor_seating: placeDetails[0]?.indoor_seating,
						outdoor_seating: placeDetails[0]?.outdoor_seating,
						wheelchair: placeDetails[0]?.wheelchair,
						placeId: createdPlace.id,
						userId: userId,
					},
				});

				await prisma.importLocationTip.createMany({
					data: place.Tips.map((tip) => ({
						tip: tip,
						importLocationId: importLocation.id,
					})),
				});

				await prisma.importLocationHighlight.createMany({
					data: place.Highlights.map((highlight) => ({
						highlight: highlight,
						importLocationId: importLocation.id,
					})),
				});

				await prisma.importLocationCategory.createMany({
					data: place.Categories.map((category) => ({
						category: category,
						importLocationId: importLocation.id,
					})),
				});

				break;
			}
		}
	}
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
