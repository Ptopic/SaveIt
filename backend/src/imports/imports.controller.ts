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
import { Request } from 'express';
import { JwtAuth } from 'src/auth/decorators/jwt-auth.decorator';
import { NotificationsService } from 'src/notifications/notifications.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ImportsService } from './imports.service';
import { getAdditionalInfoByContentType } from './utils/additionalnfo';
import { detectPostType, expandTikTokUrl } from './utils/detectType.js';
import { getOutscraperData } from './utils/outscraper';
import { cleanDescription, getMetaDataScript } from './utils/video.js';

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

		const importData = await this.importsService.getImport(id, userId);

		return importData;
	}

	@Post('/test')
	async test(@Query('query1') query1: string, @Query('query2') query2: string) {
		const placeDetails = await getOutscraperData([query1, query2]);

		for (const place of placeDetails) {
			console.log(place[0]);
		}

		return placeDetails;
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

		const expandedUrl = await expandTikTokUrl(url);

		const importWithSameUrl = await this.prisma.import.findFirst({
			where: {
				videoUrl: expandedUrl,
				userId,
			},
		});

		if (importWithSameUrl) {
			await this.notificationsService.sendNotification(
				user.pushNotificationId,
				'Content Already Imported',
				'❌ You have already imported this content'
			);

			throw new Error('Content already imported');
		}

		const socialMediaType = expandedUrl.includes('instagram')
			? 'instagram'
			: expandedUrl.includes('tiktok')
				? 'tiktok'
				: null;

		if (!socialMediaType) {
			throw new Error('Invalid URL');
		}

		const startingImport = await this.importsService.createImport(userId, {
			title: url,
			duration: 0,
			socialMediaType,
			videoUrl: expandedUrl,
		});

		let result;

		try {
			const postType = await detectPostType(expandedUrl);

			const urlMetadata = await getMetaDataScript(expandedUrl, postType.type);

			if (!url) throw new Error('URL is missing');

			console.log(postType);

			if (urlMetadata['description']) {
				urlMetadata['description'] = cleanDescription(
					urlMetadata['description']
				);
			}

			if (postType.type === 'video') {
				result = await this.importsService.transcribeVideo(
					expandedUrl,
					urlMetadata
				);
			} else {
				// const images = await getSlideshowImages(url);

				// if (!Array.isArray(images)) {
				// 	throw new Error('Failed to fetch slideshow images');
				// }

				const images = urlMetadata['images'];

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
			console.log(error);
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
