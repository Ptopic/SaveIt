import axios from 'axios';
import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const API_KEY = process.env.OPENROUTER_API_KEY;

export async function askGPT(prompt) {
	const response = await openai.chat.completions.create({
		model: 'gpt-4o-mini',
		messages: [{ role: 'system', content: prompt }],
	});

	const responseContent = response.choices[0].message.content;

	const inputTokens = response.usage.prompt_tokens;
	const outputTokens = response.usage.completion_tokens;

	const cleanedContent = responseContent
		.replace(/```(?:json)?\n?|\n?```|`/g, '')
		.trim();

	try {
		const parsedResponse = JSON.parse(cleanedContent);

		return {
			json: parsedResponse,
			inputTokens,
			outputTokens,
		};
	} catch (error) {
		throw error;
	}
}

export async function askOpenRouter(prompt: string, images?: string[]) {
	const imagesArray =
		images !== undefined && images !== null
			? images.map((image) => ({
					type: 'image_url',
					image_url: { url: image },
				}))
			: [];

	try {
		const response = await axios.post(
			'https://openrouter.ai/api/v1/chat/completions',
			{
				// model: 'deepseek/deepseek-chat-v3-0324:free',
				// model: 'meta-llama/llama-3.2-3b-instruct:free',
				// model: 'meta-llama/llama-3.1-8b-instruct',
				// model: 'meta-llama/llama-3.3-70b-instruct',
				// model: 'google/gemini-2.0-flash-001',
				// model: 'openai/gpt-4o-mini',
				model: 'google/gemini-2.0-flash-lite-001',
				messages: [
					{
						role: 'system',
						content: [{ type: 'text', text: prompt }, ...imagesArray],
					},
				],
				temperature: 0.1,
			},
			{
				headers: {
					Authorization: `Bearer ${API_KEY}`,
					'Content-Type': 'application/json',
				},
			}
		);

		let responseContent = response.data.choices[0].message.content || '';

		let cleanedContent = responseContent
			.replace(/```json\s*|\s*```/g, '')
			.replace(/`/g, '')
			.replace(/[\u0000-\u001F]+/g, '')
			.replace(/\r?\n/g, '')
			.replace(/\\'/g, "'")
			.replace(/\\"/g, '"')
			.replace(/,\s*([}\]])/g, '$1');

		cleanedContent = cleanedContent.replace(
			/:\s*"([^"]*?)"([^",\]}]*)/g,
			(match, p1, p2) => {
				const fixed = (p1 + p2).trim();
				return `: "${fixed}"`;
			}
		);

		console.log('[CLEANED JSON]:', cleanedContent);

		const parsedResponse = JSON.parse(cleanedContent);

		const inputTokens = response.data.usage?.prompt_tokens || 0;
		const outputTokens = response.data.usage?.completion_tokens || 0;

		return {
			json: parsedResponse,
			inputTokens,
			outputTokens,
		};
	} catch (error) {
		console.error('Error fetching AI response:', error);
		throw error;
	}
}

export async function searchForCoordinatesAndAddress(
	name: string,
	location?: string
) {
	try {
		let searchQuery;
		if (location) {
			searchQuery = name + ', ' + location;
		} else {
			searchQuery = name;
		}

		const geocodingUrl = `https://nominatim.openstreetmap.org/search?q=${searchQuery}&format=json&limit=1`;

		const response = await axios.get(geocodingUrl);

		if (response.data.length > 0) {
			const result = response.data[0];

			return {
				latitude: result.lat,
				longitude: result.lon,
				address: result.display_name,
			};
		} else {
			return null;
		}
	} catch (error) {
		throw error;
	}
}
