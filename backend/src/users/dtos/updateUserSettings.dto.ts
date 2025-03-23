import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateUserSettingsDto {
	@IsOptional()
	@IsBoolean()
	notificationsEnabled?: boolean;

	@IsOptional()
	@IsBoolean()
	smsEnabled?: boolean;
}
