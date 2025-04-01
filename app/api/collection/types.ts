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

export interface IUpdateCollectionRequest {
	name: string;
	description: string;
	oldImage: string | null;
	newImage: string | null;
}
