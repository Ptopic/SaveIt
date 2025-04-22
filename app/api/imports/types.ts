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

export interface IPlace {
	id: string;
	name: string;
	description: string;
	emoji: string;
	importId: string;
	importLocation: IPlaceLocation;
}
export interface ICreateImportRequest {
	url: string;
}
