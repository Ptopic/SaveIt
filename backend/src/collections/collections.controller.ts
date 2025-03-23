import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Req,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuth } from 'src/auth/decorators/jwt-auth.decorator';
import { PrismaService } from 'src/prisma/prisma.service';
import { CollectionsService } from './collections.service';

@Controller('collections')
export class CollectionsController {
	constructor(
		private readonly collectionsService: CollectionsService,
		private readonly prisma: PrismaService
	) {}

	@Get('/all')
	@JwtAuth()
	async getCollections(@Req() req: Request) {
		const userId = req.user.sub;

		return await this.collectionsService.getAllCollections(userId);
	}

	@Get('/:id')
	@JwtAuth()
	async getCollection(@Param('id') id: string, @Req() req: Request) {
		const userId = req.user.sub;

		return await this.collectionsService.getCollection(id, userId);
	}

	@Post('/create')
	@JwtAuth()
	async createCollection(
		@Req() req: Request,
		@Body() body: { name: string; description: string }
	) {
		const { name, description } = body;
		const userId = req.user.sub;

		return await this.collectionsService.createCollection(userId, {
			name,
			description,
		});
	}

	@Delete('/:id')
	@JwtAuth()
	async deleteCollection(@Param('id') id: string, @Req() req: Request) {
		const userId = req.user.sub;

		return await this.collectionsService.deleteCollection(id, userId);
	}
}
