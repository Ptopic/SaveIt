export interface IUser {
	id: string;
	fullName: string;
	email: string;
	location: string;
	picture: string;
}

export interface ICreateUserRequest {
	fullName: string;
	email: string;
	location: string;
}
