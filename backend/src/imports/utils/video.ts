import puppeteer from 'puppeteer';

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

export const cleanDescription = (description) => {
	const cleanedDescription = description.replace(/#\w+/g, '');
	return cleanedDescription;
};
