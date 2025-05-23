import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Query,
	Req,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuth } from 'src/auth/decorators/jwt-auth.decorator';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dtos/createCollection.dto';
import { UpdateCollectionDto } from './dtos/updateCollection.dto';

@Controller('collections')
export class CollectionsController {
	constructor(private readonly collectionsService: CollectionsService) {}

	@Get('/')
	@JwtAuth()
	async getCollections(
		@Req() req: Request,
		@Query('page') page: string,
		@Query('pageSize') pageSize: string,
		@Query('searchQuery') searchQuery?: string
	) {
		const userId = req.user.userId;

		const { collections, totalCollections } =
			await this.collectionsService.getCollections(
				userId,
				page,
				pageSize,
				searchQuery
			);

		return { data: collections, totalCount: totalCollections };
	}

	@Get('/:id')
	@JwtAuth()
	async getCollection(@Param('id') id: string, @Req() req: Request) {
		const userId = req.user.userId;

		return await this.collectionsService.getCollection(id, userId);
	}

	@Post('/')
	@JwtAuth()
	async createCollection(
		@Req() req: Request,
		@Body() body: CreateCollectionDto
	) {
		const userId = req.user.userId;

		return await this.collectionsService.createCollection(userId, body);
	}

	@Put('/:id')
	@JwtAuth()
	async updateCollection(
		@Param('id') id: string,
		@Req() req: Request,
		@Body() body: UpdateCollectionDto
	) {
		const userId = req.user.userId;

		return await this.collectionsService.updateCollection(id, userId, body);
	}

	@Delete('/:id')
	@JwtAuth()
	async deleteCollection(@Param('id') id: string, @Req() req: Request) {
		const userId = req.user.userId;

		return await this.collectionsService.deleteCollection(id, userId);
	}
}
