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
import { NotificationsService } from 'src/notifications/notifications.service';
import { ImportsService } from './imports.service';
import { detectPostType, getSlideshowImages } from './utils/detectType.js';
import { cleanDescription, getMetaData } from './utils/video.js';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('imports')
export class ImportsController {
	constructor(
		private readonly importsService: ImportsService,
		private readonly prisma: PrismaService,
		private readonly notificationsService: NotificationsService
	) {}

	@Get('/')
	@JwtAuth()
	async getImports(@Req() req: Request) {
		const userId = req.user.userId;

		return await this.importsService.getAllImports(userId);
	}

	@Get('/:id')
	@JwtAuth()
	async getImport(@Param('id') id: string, @Req() req: Request) {
		const userId = req.user.userId;

		return await this.importsService.getImport(id, userId);
	}

	@Post('/transcribe')
	@JwtAuth()
	async transcribe(@Body() body: { url: string }, @Req() req: Request) {
		const { url } = body;

		const userId = req.user.userId;

		let result;

		try {
			const urlMetadata = await getMetaData(url);

			urlMetadata.description = cleanDescription(urlMetadata.description);

			if (!url) throw new Error('URL is missing');

			const postType = await detectPostType(url);

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

			const user = await this.prisma.user.findUnique({
				where: {
					id: userId,
				},
			});

			await this.notificationsService.sendNotification(
				user.pushNotificationId,
				'Collection Import',
				'✅ Your collection has been imported successfully'
			);

			return await this.importsService.createImport(userId, {
				postType: postType.type,
				...result,
			});
		} catch (error) {
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
