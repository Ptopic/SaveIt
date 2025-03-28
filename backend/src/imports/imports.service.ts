import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { PrismaService } from 'src/prisma/prisma.service';
import {
	analyzeContentDeepSeek,
	searchForCoordinatesAndAddress,
} from './utils/analyze';
import { downloadAudio, transcribeAudioWithDeepgram } from './utils/audio';
import { getAnalyzePrompt, getSlideshowAnalyzePrompt } from './utils/prompts';
import { extractTextFromImage } from './utils/vision';

@Injectable()
export class ImportsService {
	constructor(private readonly prisma: PrismaService) {}

	async transcribeVideo(url: string, urlMetadata: any) {
		const audioPath = await downloadAudio(url);

		const transcript = await transcribeAudioWithDeepgram(audioPath);

		const prompt = getAnalyzePrompt(
			transcript.text + '\n' + urlMetadata.description
		);
		const analysis = await analyzeContentDeepSeek(prompt);

		const address = analysis.json.locationData?.address || null;

		if (analysis.json.type === 'Place' && analysis.json) {
			const place = analysis.json.summary;

			const name = place.name;
			const location = place.location || '';

			const coordinates = await searchForCoordinatesAndAddress(name, location);
			place.coordinates = coordinates || null;
		}

		// let ingredientIcons = null;

		// // If the content is a recipe, get icons for ingredients
		// if (analysis.json.type === 'Recipe' && analysis.json.summary) {
		// 	try {
		// 		// Parse the summary as JSON
		// 		const summaryObj = analysis.json.summary;

		// 		// Get ingredients from the Recipe.Ingredients array
		// 		if (summaryObj.Ingredients && Array.isArray(summaryObj.Ingredients)) {
		// 			const ingredients = summaryObj.Ingredients;
		// 			console.log(ingredients);

		// 			if (ingredients.length > 0) {
		// 				console.log('Found ingredients:', ingredients);
		// 				ingredientIcons = await getIngredientIcons(ingredients);
		// 				summaryObj.Ingredients = ingredientIcons;
		// 			}
		// 		}
		// 	} catch (error) {
		// 		console.error('Error parsing recipe summary:', error);
		// 	}
		// }

		fs.unlinkSync(audioPath as fs.PathLike);

		return {
			title: analysis.json?.title,
			description: urlMetadata.description,
			thumbnail: urlMetadata.thumbnail,
			text: transcript.text,
			duration: transcript.duration,
			type: analysis.json?.type,
			summary: analysis.json.summary,
			name: analysis.json?.locationData?.name || null,
			location: analysis.json?.locationData?.location || null,
			address: address,
			inputTokens: analysis.inputTokens,
			outputTokens: analysis.outputTokens,
		};
	}

	async transcribeSlideshow(images: any[], urlMetadata: any) {
		const imagesText = [];

		for (const image of images) {
			const text = await extractTextFromImage(image);
			imagesText.push(text);
		}

		const prompt = getSlideshowAnalyzePrompt(
			imagesText.join('\n') + '\n' + urlMetadata.description
		);

		const analysis = await analyzeContentDeepSeek(prompt);

		if (
			(analysis.json.type === 'Place' || analysis.json.type === 'Restaurant') &&
			analysis.json
		) {
			const places = analysis.json.summary.Place;

			if (places) {
				if (places.length > 1) {
					for (const place of places) {
						const name = place.Name;
						const location = place.Location;

						const coordinates = await searchForCoordinatesAndAddress(
							name,
							location
						);

						if (coordinates) {
							place.coordinates =
								coordinates.latitude + ',' + coordinates.longitude;
							place.address = coordinates.address;
						}
					}
				} else {
					const name = places.Name;

					const coordinates = await searchForCoordinatesAndAddress(name);

					if (coordinates) {
						places.coordinates =
							coordinates.latitude + ',' + coordinates.longitude;
						places.address = coordinates.address;
					}
				}
			}
		}

		return {
			title: analysis.json.title,
			description: urlMetadata.description,
			thumbnail: urlMetadata.thumbnail,
			text: imagesText.join('\n'),
			type: analysis.json.type,
			summary: analysis.json.summary,
			inputTokens: analysis.inputTokens,
			outputTokens: analysis.outputTokens,
		};
	}

	async createImport(userId: string, data: any) {
		const type = data.type.toString();

		return await this.prisma.import.create({
			data: {
				userId,
				title: data.title,
				thumbnail: data?.thumbnail,
				duration: data?.duration,
				type: data?.type,
				summary: data?.summary,
				location: data?.location,
				address: data?.address,
			},
		});
	}

	async getAllImports(userId: string) {
		return await this.prisma.import.findMany({ where: { userId } });
	}

	async getImport(id: string, userId: string) {
		return await this.prisma.import.findUnique({ where: { id, userId } });
	}

	async deleteImport(id: string, userId: string) {
		return await this.prisma.import.delete({ where: { id, userId } });
	}
}
