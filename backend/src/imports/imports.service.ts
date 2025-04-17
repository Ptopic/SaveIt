import { Injectable } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import * as fs from 'fs';
import { Server } from 'http';
import { PrismaService } from 'src/prisma/prisma.service';
import { askOpenRouter } from './utils/analyze';
import { downloadAudio, transcribeAudioWithDeepgram } from './utils/audio';
import { getAnalyzePromptByContentType } from './utils/prompts';
import {
	detectContentType,
	downloadVideo,
	extractFramesFromVideo,
} from './utils/video';

@WebSocketGateway({ cors: true })
@Injectable()
export class ImportsService {
	@WebSocketServer()
	private server: Server;

	constructor(private readonly prisma: PrismaService) {}

	async transcribeVideo(url: string, urlMetadata: any) {
		const audioPath = (await downloadAudio(url)) as string;

		const videoPath = await downloadVideo(url);

		const frames = (await extractFramesFromVideo(videoPath)) as string[];

		console.log(frames.length);

		const transcript = await transcribeAudioWithDeepgram(audioPath);

		fs.unlinkSync(audioPath as fs.PathLike);

		const postText = transcript.text + '\n' + urlMetadata.description;

		// TODO: Use hashtags to detect content type - If that produces bugs use transcribed text and hashtags
		const contentType = await detectContentType(urlMetadata.description, null);
		console.log(contentType);

		const prompt = getAnalyzePromptByContentType(
			postText,
			contentType,
			'video'
		);

		const analysis = await askOpenRouter(prompt, frames);

		console.log(analysis.inputTokens, analysis.outputTokens);

		console.log(analysis.json);

		const address = analysis.json?.locationData?.address || null;

		return {
			title: analysis.json?.title,
			description: urlMetadata.description,
			thumbnail: urlMetadata.thumbnail,
			text: transcript.text,
			duration: transcript.duration,
			type: contentType,
			summary: analysis.json.summary,
			name: analysis.json?.locationData?.name || null,
			location: analysis.json?.locationData?.location || null,
			address: address,
			inputTokens: analysis.inputTokens,
			outputTokens: analysis.outputTokens,
		};
	}

	async transcribeSlideshow(images: any[], urlMetadata: any) {
		// const imagesText = [];

		// for (const image of images) {
		// 	const text = await extractTextFromImage(image);
		// 	imagesText.push(text);
		// }

		// const postText = imagesText.join('\n') + '\n' + urlMetadata.description;
		const postText = urlMetadata.description;

		// TODO: Use hashtags to detect content type - If that produces bugs use transcribed text and hashtags
		const contentType = await detectContentType(postText, null);

		console.log(contentType);

		const prompt = getAnalyzePromptByContentType(
			postText,
			contentType,
			'slideshow'
		);

		const analysis = await askOpenRouter(prompt, images);

		console.log(analysis.inputTokens, analysis.outputTokens);

		console.log(analysis.json);

		return {
			title: analysis.json.title,
			description: urlMetadata.description,
			thumbnail: urlMetadata.thumbnail,
			// text: imagesText.join('\n'),
			type: contentType,
			summary: analysis.json.summary,
			inputTokens: analysis.inputTokens,
			outputTokens: analysis.outputTokens,
		};
	}

	async createImport(userId: string, data: any) {
		const createdImport = await this.prisma.import.create({
			data: {
				userId,
				title: data.title,
				thumbnail: data?.thumbnail,
				duration: data?.duration,
				type: data?.type,
				summary: data?.summary,
				location: data?.location,
				address: data?.address,
				socialMediaType: data?.socialMediaType,
				videoUrl: data?.videoUrl,
			},
		});

		this.server.emit(`refetchImports-${userId}`, true);

		return createdImport;
	}

	async updateImport(userId: string, data: any) {
		const updatedImport = await this.prisma.import.update({
			where: { id: data.id },
			data: {
				userId,
				title: data.title,
				thumbnail: data?.thumbnail,
				duration: data?.duration,
				type: data?.type,
				summary: data?.summary,
				location: data?.location,
				address: data?.address,
				status: 'Finished',
			},
		});

		this.server.emit(`refetchImports-${userId}`, true);

		return updatedImport;
	}

	async getAllImports(
		userId: string,
		page: string,
		pageSize: string,
		searchQuery?: string,
		type?: string
	) {
		const imports = await this.prisma.import.findMany({
			where: {
				userId,
				title: { contains: searchQuery, mode: 'insensitive' },
				type: type ? { contains: type, mode: 'insensitive' } : undefined,
			},
			skip: parseInt(page) * parseInt(pageSize),
			take: parseInt(pageSize),
			orderBy: {
				createdAt: 'desc',
			},
		});

		const totalImports = await this.prisma.import.count({
			where: {
				userId,
				title: { contains: searchQuery, mode: 'insensitive' },
				type: { contains: type, mode: 'insensitive' },
			},
		});

		return { imports, totalImports };
	}

	async getImport(id: string, userId: string) {
		return await this.prisma.import.findUnique({ where: { id, userId } });
	}

	async deleteImport(id: string, userId: string) {
		return await this.prisma.import.delete({ where: { id, userId } });
	}
}
