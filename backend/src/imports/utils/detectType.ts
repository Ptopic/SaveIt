import puppeteer from 'puppeteer';
import { URL } from 'url';

export async function expandTikTokUrl(shortUrl) {
	try {
		const response = await fetch(shortUrl, {
			method: 'HEAD',
			redirect: 'follow',
		});
		return response.url || shortUrl;
	} catch (error) {
		return shortUrl;
	}
}

export async function detectPostType(url) {
	try {
		const fullUrl = await expandTikTokUrl(url);
		const parsedUrl = new URL(fullUrl);
		const path = parsedUrl.pathname;

		if (path.includes('/video/') || path.includes('/reel/')) {
			return { type: 'video' };
		} else if (path.includes('/photo/')) {
			return { type: 'slideshow' };
		} else {
			return { type: 'video' };
		}
	} catch (error) {
		throw error;
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
