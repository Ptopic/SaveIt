import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateCollectionDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsNotEmpty()
	description: string;

	@IsString()
	@IsOptional()
	oldImage: string | null;

	@IsString()
	@IsOptional()
	newImage: string | null;
}
