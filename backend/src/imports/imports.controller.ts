import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Query,
	Req,
} from '@nestjs/common';
import axios from 'axios';
import { Request } from 'express';
import { JwtAuth } from 'src/auth/decorators/jwt-auth.decorator';
import { NotificationsService } from 'src/notifications/notifications.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ImportsService } from './imports.service';
import { getAdditionalInfoByContentType } from './utils/additionalnfo';
import { detectPostType } from './utils/detectType.js';
import { getSlideshowImages } from './utils/image';
import { cleanDescription, getMetaData } from './utils/video.js';

@Controller('imports')
export class ImportsController {
	constructor(
		private readonly importsService: ImportsService,
		private readonly prisma: PrismaService,
		private readonly notificationsService: NotificationsService
	) {}

	@Get('/')
	@JwtAuth()
	async getAllImports(
		@Req() req: Request,
		@Query('page') page: string,
		@Query('pageSize') pageSize: string,
		@Query('searchQuery') searchQuery?: string,
		@Query('type') type?: string
	) {
		const userId = req.user.userId;

		const { imports, totalImports } = await this.importsService.getAllImports(
			userId,
			page,
			pageSize,
			searchQuery,
			type
		);

		return { data: imports, totalCount: totalImports };
	}

	@Get('/:id')
	@JwtAuth()
	async getImport(@Param('id') id: string, @Req() req: Request) {
		const userId = req.user.userId;

		return await this.importsService.getImport(id, userId);
	}

	@Post('/test')
	async test(@Query('query') query: string) {
		const response = await axios.get(
			`${process.env.NOMINATIM_URL}/search?q=${query}&format=json&limit=1&addressdetails=1&namedetails=1&extratags=1`,
			{
				headers: {
					'Accept-Language': 'en',
				},
			}
		);

		const placesCordinates = response.data.map((place) => {
			return {
				cordinates: place.lat + ',' + place.lon,
			};
		});

		console.log(response.data);

		return placesCordinates[0].cordinates;
	}
	@Post('/transcribe')
	@JwtAuth()
	async transcribe(@Body() body: { url: string }, @Req() req: Request) {
		const { url } = body;

		console.log('import creation started');

		const userId = req.user.userId;

		const user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
		});

		const socialMediaType = url.includes('instagram')
			? 'instagram'
			: url.includes('tiktok')
				? 'tiktok'
				: null;

		if (!socialMediaType) {
			throw new Error('Invalid URL');
		}

		const startingImport = await this.importsService.createImport(userId, {
			title: url,
			duration: 0,
			socialMediaType,
			videoUrl: url,
		});

		let result;

		try {
			const urlMetadata = await getMetaData(url);

			if (!url) throw new Error('URL is missing');

			const postType = await detectPostType(url);

			console.log(postType);

			if (urlMetadata.description) {
				urlMetadata.description = cleanDescription(urlMetadata.description);
			}

			if (postType.type === 'video') {
				result = await this.importsService.transcribeVideo(url, urlMetadata);
			} else {
				const images = await getSlideshowImages(url);

				if (!Array.isArray(images)) {
					throw new Error('Failed to fetch slideshow images');
				}

				result = await this.importsService.transcribeSlideshow(
					images,
					urlMetadata
				);
			}

			await getAdditionalInfoByContentType(result, userId, startingImport.id);

			const createdImport = await this.importsService.updateImport(userId, {
				id: startingImport.id,
				postType: postType.type,
				...result,
			});

			await this.notificationsService.sendNotification(
				user.pushNotificationId,
				'Content Import',
				'✅ Your content has been imported successfully'
			);

			return createdImport;
		} catch (error) {
			await this.importsService.deleteImport(startingImport.id, userId);

			await this.notificationsService.sendNotification(
				user.pushNotificationId,
				'Content Import',
				'❌ Failed to import content'
			);

			throw new Error(error);
		}
	}

	@Delete('/:id')
	@JwtAuth()
	async deleteImport(@Param('id') id: string, @Req() req: Request) {
		const userId = req.user.userId;

		return await this.importsService.deleteImport(id, userId);
	}
}
