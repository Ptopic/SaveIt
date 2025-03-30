import { IsString } from 'class-validator';

export class UpdateUserProfilePictureDto {
	@IsString()
	picture: string;
}
