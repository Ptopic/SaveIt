export interface IImport {
	id: string;
	title: string;
	thumbnail: string;
	duration: number;
	type: string;
	summary: string;
	location: string;
	address: string;
	status: string;
	socialMediaType: string;
	createdAt: string;
	updatedAt: string;
}

export interface ICreateImportRequest {
	url: string;
}
