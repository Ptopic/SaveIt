import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCollectionDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsNotEmpty()
	description: string;

	@IsString()
	@IsNotEmpty()
	base64Image: string;
}
