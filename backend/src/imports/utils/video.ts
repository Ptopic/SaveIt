import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import puppeteer from 'puppeteer';
import { askOpenRouter } from './analyze';
import { detectContentTypePrompt } from './prompts';

export async function getMetaData(url) {
	const browser = await puppeteer.launch({ headless: true });
	const page = await browser.newPage();

	try {
		await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

		await page.waitForSelector('meta[property="og:description"]', {
			timeout: 10000,
		});

		const meta = await page.evaluate(() => {
			const getMetaContent = (prop) => {
				const element = document.querySelector(`meta[property="${prop}"]`);
				return element instanceof HTMLMetaElement ? element.content : '';
			};

			let thumbnail = '';
			const imgElement = document.querySelector('img');
			if (imgElement instanceof HTMLImageElement) {
				thumbnail = imgElement.src;
			}

			return {
				description: getMetaContent('og:description'),
				thumbnail,
			};
		});

		return meta;
	} catch (error) {
		throw error;
	} finally {
		await browser.close();
	}
}

export const detectContentType = async (postText, images?: string[]) => {
	try {
		const prompt = detectContentTypePrompt(postText);

		const contentTypePromptResponse = await askOpenRouter(prompt, images);

		const contentType = contentTypePromptResponse.json.type;

		return contentType;
	} catch (error) {
		return 'Other';
	}
};

export const cleanDescription = (description) => {
	const cleanedDescription = description.replace(/#\w+/g, '');
	return cleanedDescription;
};

export async function downloadVideo(videoUrl) {
	return new Promise((resolve, reject) => {
		const timestamp = Date.now();
		const outputFilename = `video_${timestamp}.mp4`;
		const videosDir = 'videos';

		if (!fs.existsSync(videosDir)) {
			fs.mkdirSync(videosDir);
		}

		const command = `yt-dlp -f mp4 -o ${videosDir}/${outputFilename} "${videoUrl}" --quiet --no-warnings`;
		exec(command, async (error, stdout, stderr) => {
			if (error) {
				return reject(error);
			}

			const videoPath = path.join(videosDir, outputFilename);
			if (fs.existsSync(videoPath)) {
				resolve(videoPath);
			} else {
				reject(new Error('MP4 file not found'));
			}
		});
	});
}

export async function extractFramesFromVideo(videoPath) {
	return new Promise((resolve, reject) => {
		const framesDir = 'frames';
		const timestamp = Date.now();
		const base64Images = [];

		if (!fs.existsSync(framesDir)) {
			fs.mkdirSync(framesDir);
		}

		// Extract frame every 3 seconds using fps=1/3
		const command = `ffmpeg -i ${videoPath} -vf "fps=1/3" ${framesDir}/frame${timestamp}_%d.jpg`;
		exec(command, async (error, stdout, stderr) => {
			if (error) {
				return reject(error);
			}

			setTimeout(() => {
				const files = fs
					.readdirSync(framesDir)
					.filter((file) => file.startsWith(`frame${timestamp}_`))
					.sort((a, b) => {
						const numA = parseInt(a.split('_')[1]);
						const numB = parseInt(b.split('_')[1]);
						return numA - numB;
					});

				for (const file of files) {
					const framePath = path.join(framesDir, file);

					const base64Image = fs.readFileSync(framePath, {
						encoding: 'base64',
					});

					base64Images.push('data:image/jpeg;base64,' + base64Image);

					fs.unlinkSync(framePath);
				}

				fs.unlinkSync(videoPath);

				resolve(base64Images);
			}, 100);
		});
	});
}
