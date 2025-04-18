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

export interface IPlaceLocation {
	id: string;
	createdAt: string;
	updatedAt: string;
	name: string;
	city: string;
	country: string;
	flag: string;
	coordinates: string;
	emoji: string;
	address: string;
	bestTimeToVisit: string;
	openingHours: string;
	description: string;
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
