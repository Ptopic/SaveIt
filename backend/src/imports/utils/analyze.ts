import axios from 'axios';
import * as JSON5 from 'json5';
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
				// model: 'google/gemini-2.0-flash-001',
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

		// Clean the response content
		let cleanedContent = responseContent
			.replace(/```json\s*|\s*```/g, '') // Remove code block markers
			.replace(/`/g, '') // Remove backticks
			.trim();

		// Remove any control characters but preserve emojis and valid Unicode
		cleanedContent = cleanedContent.replace(
			/[\u0000-\u001F\u007F-\u009F]/g,
			''
		);

		console.log('[CLEANED JSON]:', cleanedContent);

		// Use JSON5 for more lenient parsing
		const parsedResponse = JSON5.parse(cleanedContent);

		const inputTokens = response.data.usage?.prompt_tokens || 0;
		const outputTokens = response.data.usage?.completion_tokens || 0;

		return {
			json: parsedResponse,
			inputTokens,
			outputTokens,
		};
	} catch (error) {
		console.error('Error fetching AI response:', error);
		if (error.response) {
			console.log(
				'Full response:',
				JSON.stringify(error.response.data, null, 2)
			);
		}
		throw error;
	}
}
