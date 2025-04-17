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

	for (const place of places) {
		console.log(place);
		const emoji = place?.Name?.match(/[^\p{L}\p{N}\s]/gu)?.[0] || '';
		const name = removeEmojiFromText(place?.Name) || '';
		const city = place?.City || '';
		const country = place?.Country || '';

		const query =
			city !== '' && country !== ''
				? `${name}, ${city}, ${country}`
				: city !== ''
					? `${name}, ${city}`
					: country !== ''
						? `${name}, ${country}`
						: name;

		const response = await axios.get(
			`${process.env.NOMINATIM_URL}/search?q=${query}&format=json&limit=1&addressdetails=1&namedetails=1`,
			{
				headers: {
					'Accept-Language': 'en',
				},
			}
		);

		const placeDetails = response.data.map((place) => {
			return {
				cordinates: place.lat + ',' + place.lon,
				address: place.display_name,
			};
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
				importId: importId,
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
