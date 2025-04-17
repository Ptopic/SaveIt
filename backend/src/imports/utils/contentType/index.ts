import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createContentType(
	result: any,
	userId: string,
	importId: string
) {
	switch (result.type) {
		case 'Recipe':
			return createRecipe(result);
		case 'Place':
			return createPlace(result, userId, importId);
		case 'Restaurant':
			return createRestaurant(result);
		case 'Software':
			return createSoftware(result);
		case 'Film/Show':
			return createFilmShow(result);
		case 'Workout Routine':
			return createWorkoutRoutine(result);
		case 'Book':
			return createBook(result);
		case 'Product':
			return createProduct(result);
		case 'Event':
			return createEvent(result);
		case 'Other':
			return createOther(result);
	}
}

async function createRecipe(result: any) {}

async function createPlace(result: any, userId: string, importId: string) {
	const place = await prisma.place.create({
		data: result,
	});
	return place;
}

async function createRestaurant(result: any) {}

async function createSoftware(result: any) {}

async function createFilmShow(result: any) {}

async function createWorkoutRoutine(result: any) {}

async function createBook(result: any) {}

async function createProduct(result: any) {}

async function createEvent(result: any) {}

async function createOther(result: any) {}
