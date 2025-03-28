import axios from 'axios';
import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const API_KEY = process.env.OPENROUTER_API_KEY; // Store your OpenRouter API key in .env

export async function analyzeContentChatGPT(prompt) {
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

export async function analyzeContentDeepSeek(prompt: string) {
	try {
		const response = await axios.post(
			'https://openrouter.ai/api/v1/chat/completions',
			{
				model: 'deepseek/deepseek-chat-v3-0324:free', // Test with a potentially valid model ID
				messages: [{ role: 'system', content: prompt }],
			},
			{
				headers: {
					Authorization: `Bearer ${API_KEY}`,
					'Content-Type': 'application/json',
				},
			}
		);

		const responseContent = response.data.choices[0].message.content;
		const inputTokens = response.data.usage?.prompt_tokens || 0;
		const outputTokens = response.data.usage?.completion_tokens || 0;

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
			// If response is not JSON, return as plain text
			return {
				text: cleanedContent,
				inputTokens,
				outputTokens,
			};
		}
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
		// Create the search query based on available information
		let searchQuery;
		if (location) {
			searchQuery = name + ', ' + location; // Use address for the most accurate coordinates
		} else {
			searchQuery = name;
		}

		// Construct the Geocoding API URL
		const geocodingUrl = `https://nominatim.openstreetmap.org/search?q=${searchQuery}&format=json&limit=1`;

		// Make the HTTP request to the Geocoding API
		const response = await axios.get(geocodingUrl);

		// Check if the response contains results
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
