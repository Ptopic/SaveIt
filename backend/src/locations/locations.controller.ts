import { Controller, Get, Param, Query } from '@nestjs/common';
import { LocationsService } from './locations.service';

@Controller('locations')
export class LocationsController {
	constructor(private readonly locationsService: LocationsService) {}

	@Get()
	async getAllLocations(
		@Query('userId') userId: string,
		@Query('searchQuery') searchQuery?: string
	) {
		return this.locationsService.getAllLocations(userId, searchQuery);
	}

	@Get(':id')
	async getLocationById(@Param('id') id: string) {
		return this.locationsService.getLocationById(id);
	}

	@Get('import/:importId')
	async getLocationByImportId(@Param('importId') importId: string) {
		return this.locationsService.getLocationByImportId(importId);
	}
}
