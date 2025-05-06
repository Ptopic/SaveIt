import { ImportType } from '@/feature/home/FilterBadge/types';

export interface IImport {
	id: string;
	title: string;
	thumbnail: string;
	duration: number;
	type: ImportType;
	summary: string;
	location: string;
	address: string;
	status: string;
	socialMediaType: string;
	videoUrl: string;

	places: IPlace[];
	restaurants: IRestaurant[];
	recipes: IRecipe[];

	createdAt: string;
	updatedAt: string;
}

export interface ILocation {
	id: string;
	createdAt: string;
	updatedAt: string;
	name: string;
	placeId: string;
	googleId: string;
	city: string;
	country: string;
	flag: string;
	emoji: string;
	coordinates: string;
	address: string;
	bestTimeToVisit: string;
	typicalTimeSpent: string;
	businessStatus: string;
	locationLink: string;
	type: string;
	description: string;
	openingHours: string;
	phone: string;
	website: string;
	reviewsCount: number;
	reviewsAverage: number;
	priceRange: string;
	photo: string;
}

export interface IPlaceLocation {
	id: string;
	createdAt: string;
	updatedAt: string;
	location: ILocation;
	tips: {
		tip: string;
	}[];
	highlights: {
		highlight: string;
	}[];
	categories: {
		category: string;
	}[];
}

export interface IRestaurantLocation {
	id: string;
	createdAt: string;
	updatedAt: string;
	location: ILocation;
	tips: {
		tip: string;
	}[];
	highlights: {
		highlight: string;
	}[];
	categories: {
		category: string;
	}[];
	mustTryDishes: {
		dish: string;
	}[];
}

export interface IPlace {
	id: string;
	name: string;
	description: string;
	emoji: string;
	importId: string;
	photo: string;
	importLocation: IPlaceLocation[];
}

export interface IRestaurant {
	id: string;
	name: string;
	description: string;
	emoji: string;
	importId: string;
	photo: string;
	importLocation: IRestaurantLocation[];
}

export interface IRecipe {
	id: string;
	name: string;
	description: string;
	emoji: string;
	type: string;
	origin: string;
	time: string;
	difficulty: string;
	spiceLevel: string;
	diet: string;
	highlights: {
		highlight: string;
	}[];
	protein: number;
	carbohydrates: number;
	fat: number;
	calories: number;
	ingredients: IRecipeIngredient[];
	steps: IRecipeStep[];
	serves: number;
	tips: {
		tip: string;
	}[];
	creatorInsights: {
		insight: string;
	}[];
	servingSuggestions: {
		servingSuggestion: string;
	}[];
	substitutions: {
		substitution: string;
	}[];
	equipment: {
		equipment: string;
	}[];
	storage: {
		storage: string;
	}[];
	didYouKnow: {
		didYouKnow: string;
	}[];
}

export interface IRecipeStep {
	emoji: string;
	step: string;
}

export interface IRecipeIngredient {
	emoji: string;
	quantity: string;
	ingredient: string;
}

export interface ICreateImportRequest {
	url: string;
}
