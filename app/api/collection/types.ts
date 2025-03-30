export interface ICollection {
	id: string;
	name: string;
	description: string;
	image: string;
	createdAt: string;
	updatedAt: string;
}

export interface ICreateCollectionRequest {
	name: string;
	description: string;
	image: string;
}
