import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuth } from 'src/auth/decorators/jwt-auth.decorator';
import { LocationsService } from './locations.service';

@Controller('locations')
export class LocationsController {
	constructor(private readonly locationsService: LocationsService) {}

	@Get()
	@JwtAuth()
	async getAllLocations(
		@Req() req: Request,
		@Query('page') page: string,
		@Query('pageSize') pageSize: string,
		@Query('searchQuery') searchQuery?: string
	) {
		const userId = req.user.userId;

		const { locations, totalLocations } =
			await this.locationsService.getAllLocations(
				userId,
				page,
				pageSize,
				searchQuery
			);

		return { data: locations, totalCount: totalLocations };
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
