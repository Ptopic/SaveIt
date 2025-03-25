import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCollectionDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsNotEmpty()
	description: string;

	@IsString()
	@IsOptional()
	image: string;
}
