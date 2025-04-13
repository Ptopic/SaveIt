import axios from 'axios';
import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';
import { promisify } from 'util';

const modelsDir = path.resolve(process.cwd(), './src/imports/utils/');
const ocrScriptPath = path.join(modelsDir, 'ocr.py');

const execPromise = promisify(exec);

export const downloadImage = async (imageUrl) => {
	const outputPath = 'downloaded_image.png';

	try {
		const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
		const imageBuffer = Buffer.from(response.data);
		fs.writeFileSync(outputPath, imageBuffer);
		console.log('Image downloaded:', outputPath);
		return outputPath;
	} catch (error) {
		console.error('Failed to download image:', error);
		throw new Error('IMAGE_DOWNLOAD_FAILED');
	}
};

// Works fine
// async function preprocessImage(imagePath) {
// 	const processedPath = path.join(__dirname, 'processed_image.png');

// 	await sharp(imagePath)
// 		.normalize() // Enhance the contrast
// 		.threshold(200) // Apply binary threshold to differentiate text and background
// 		.toBuffer() // Get the image buffer for further manipulation
// 		.then((buffer) => {
// 			return sharp(buffer)
// 				.tint({ r: 255, g: 105, b: 180 }) // Apply bright pink tint (RGB: 255, 105, 180)
// 				.toFile(processedPath); // Save the processed image
// 		}); // Save the processed image

// 	return processedPath;
// }

export async function preprocessImage(imagePath, outputPath) {
	const image = sharp(imagePath);

	const grayImage = await image.grayscale().toBuffer();

	const thresholded = await sharp(grayImage).threshold(200).toBuffer();

	const invertedImage = await sharp(thresholded).negate().toBuffer();

	const pink = { r: 255, g: 105, b: 180 };

	await sharp(imagePath)
		.composite([
			{
				input: invertedImage,
				blend: 'dest-in',
			},
		])
		.tint(pink)
		.toFile(outputPath);

	console.log('Image processed and saved at', outputPath);
}

export async function extractTextFromImage(imageUrl) {
	const imagePath = await downloadImage(imageUrl);

	const processedImagePath = 'processed_image.png';

	await preprocessImage(imagePath, processedImagePath);

	try {
		const { stdout, stderr } = await execPromise(
			`python ${ocrScriptPath} ${processedImagePath}`,
			{ maxBuffer: 1024 * 1024 * 10 }
		);
		return stdout.trim();
	} catch (error) {
		console.error('OCR processing failed:', error);
		throw new Error('OCR_PROCESSING_FAILED');
	}
}

// Google Cloud Vision API -> 1000 images/month free, then 1.50 for 1000 images

// OPENAI Solution --> TO EXPENSIVE!!

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// export async function extractTextFromImage(imageUrl) {
// 	const response = await openai.chat.completions.create({
// 		model: 'gpt-4o-mini',
// 		messages: [
// 			{
// 				role: 'system',
// 				content:
// 					'FOCUS ONLY ON TEXT EXTRACTION: Your task is to extract all readable text that appears in the image. Ignore all non-text elements such as people, landscapes, objects, icons, or decorative elements. Only return the actual written/printed text you can see, with proper spacing and line breaks. If no text is present in the image, return "NO_TEXT_FOUND". Do not include any descriptions, explanations, or comments about the image contents.',
// 			},
// 			{
// 				role: 'user',
// 				content: [
// 					{
// 						type: 'image_url',
// 						image_url: { url: imageUrl },
// 					},
// 				],
// 			},
// 		],
// 	});

// 	return response.choices[0].message.content;
// }
