import axios from 'axios';
import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import puppeteer from 'puppeteer';
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

export async function getSlideshowImages(url) {
	const browser = await puppeteer.launch({ headless: true });
	const page = await browser.newPage();

	try {
		await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

		const images = await page.evaluate(() => {
			const slides = Array.from(document.querySelectorAll('.swiper-slide'));

			const slidesLength = slides.length / 3;

			const slicedSlides = slides.slice(0, slidesLength);

			const imageUrls = slicedSlides
				.map((slide) => {
					const img = slide.querySelector('img');
					return img ? img.src : null;
				})
				.filter((url) => url !== null);

			return imageUrls;
		});

		return images;
	} catch (error) {
		throw error;
	} finally {
		await browser.close();
	}
}
