const { chromium } = require('playwright');
const XLSX = require('xlsx');
const fs = require('fs-extra');
const path = require('path');
const minimist = require('minimist');

const OUTPUT_DIR = 'output';

// Helper: extract coordinates from Google Maps URL
function extractCoordinatesFromUrl(url) {
	const parts = url.split('/@')[1]?.split(',');
	if (!parts || parts.length < 2) return [null, null];
	return [parseFloat(parts[0]), parseFloat(parts[1])];
}

function extractCoordinatesFromPlaceUrl(url) {
	const coordMatch = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
	if (coordMatch) {
		return [parseFloat(coordMatch[1]), parseFloat(coordMatch[2])];
	}
	return [null, null];
}

const getText = async (xpath, page) => {
	const el = page.locator(xpath);
	if ((await el.count()) > 0) return await el.first().innerText();
	return '';
};

const extractCleanOpeningHours = (openingHoursText) => {
	const regex =
		/(\b(?:Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday)\b)(?:\s*\(.*?\))?,\s*(\d{1,2}\s*AM\s*to\s*\d{1,2}\s*AM)/g;
	let match;
	const cleanedHours = [];

	while ((match = regex.exec(openingHoursText)) !== null) {
		cleanedHours.push(`${match[1]}, ${match[2]}`);
	}

	return cleanedHours.join('; ');
};

const extractBasicInfo = async (listing, page) => {
	// const name = (await listing.getAttribute('aria-label')) || '';

	const address = await getText(
		'//button[@data-item-id="address"]//div[contains(@class, "fontBodyMedium")]',
		page
	);
	const website = await getText(
		'//a[@data-item-id="authority"]//div[contains(@class, "fontBodyMedium")]',
		page
	);
	const phone = await getText(
		'//button[contains(@data-item-id, "phone:tel:")]//div[contains(@class, "fontBodyMedium")]',
		page
	);

	return { address, website, phone };
};

const extractOpeningHours = async (listing, page) => {
	let cleanOpeningHours = null;

	try {
		const openingHours = await listing.locator('div[aria-label*="Monday"]');

		if ((await openingHours.count()) > 0) {
			const openingHoursText = await openingHours.getAttribute('aria-label');
			cleanOpeningHours = extractCleanOpeningHours(openingHoursText);
		}
	} catch (err) {
		cleanOpeningHours = null;
	}

	return cleanOpeningHours;
};

export const getGoogleMapsDetails = async (queries) => {
	const browser = await chromium.launch({ headless: false });
	const page = await browser.newPage();

	await page.goto('https://www.google.com/maps', { timeout: 60000 });

	await page.click('button[aria-label="Accept all"]');

	await page.waitForSelector('input#searchboxinput');

	let results = [];

	for (let [index, searchFor] of queries.entries()) {
		console.log(`-----\n${index} - ${searchFor}`);

		try {
			await page.fill('input#searchboxinput', searchFor);
			await page.waitForTimeout(2000);
			await page.keyboard.press('Enter');
			await page.waitForTimeout(2000);

			await page.waitForSelector('button[aria-label="Close"]', {
				timeout: 10000,
				state: 'visible',
			});

			const listings = await page
				.locator('a[href*="https://www.google.com/maps/place"]')
				.elementHandles();

			const isSingleResult = listings.length === 0;

			if (isSingleResult) {
				const listing = await page.locator('div[role="main"]');

				const basicInfo = await extractBasicInfo(listing, page);

				let reviewsCount = 0;
				let reviewsAverage = 0;

				const reviewCountEl = page.locator(
					'//div[@jsaction="pane.reviewChart.moreReviews"]//span[contains(text(), "reviews")]'
				);

				if ((await reviewCountEl.count()) > 0) {
					reviewsCount = parseInt(
						(await reviewCountEl.innerText())
							.split(' ')[0]
							.replace(',', '')
							.trim()
					);
				}

				const reviewsAvgEl = page.locator(
					'//div[@jsaction="pane.reviewChart.moreReviews"]//div[@class="fontDisplayLarge"]'
				);

				if ((await reviewsAvgEl.count()) > 0) {
					reviewsAverage = parseFloat(
						(await reviewsAvgEl.innerText()).split(' ')[0].replace(',', '.')
					);
				}

				await page.waitForTimeout(1000);

				const [latitude, longitude] = extractCoordinatesFromPlaceUrl(
					page.url()
				);

				const coordinates = `${latitude},${longitude}`;

				const photoEl = await listing
					.locator('button[jsaction*="heroHeaderImage"] img')
					.first();

				const photo = await photoEl.getAttribute('src');

				const updatedPhoto = photo
					.replace(/w\d+(?=-)/, 'w1280')
					.replace(/h\d+(?=-)/, 'h720');

				const openingHours = await extractOpeningHours(listing, page);

				results.push({
					...basicInfo,
					reviews_count: reviewsCount,
					reviews_average: reviewsAverage,
					coordinates,
					photo: updatedPhoto,
					openingHours,
				});
			} else {
				await page.waitForSelector(
					'a[href*="https://www.google.com/maps/place"]'
				);

				await page.hover('a[href*="https://www.google.com/maps/place"]');

				let listings = [];

				while (true) {
					listings = await page
						.locator('a[href*="https://www.google.com/maps/place"]')
						.elementHandles();

					listings = listings.slice(0, 1);
					break;
				}

				for (let listing of listings) {
					await listing.click();
					await page.waitForTimeout(1000);

					const basicInfo = await extractBasicInfo(listing, page);

					let reviewsCount = 0;
					let reviewsAverage = 0;

					const reviewCountEl = page.locator(
						'//div[@jsaction="pane.reviewChart.moreReviews"]//span[contains(text(), "reviews")]'
					);

					if ((await reviewCountEl.count()) > 0) {
						reviewsCount = parseInt(
							(await reviewCountEl.innerText())
								.split(' ')[0]
								.replace(',', '')
								.trim()
						);
					}

					const reviewsAvgEl = page.locator(
						'//div[@jsaction="pane.reviewChart.moreReviews"]//div[@class="fontDisplayLarge"]'
					);

					if ((await reviewsAvgEl.count()) > 0) {
						reviewsAverage = parseFloat(
							(await reviewsAvgEl.innerText()).split(' ')[0].replace(',', '.')
						);
					}

					const href = await listing.getAttribute('href');

					const [latitude, longitude] = extractCoordinatesFromPlaceUrl(href);

					const coordinates = `${latitude},${longitude}`;

					const photoEl = await page
						.locator('button[jsaction*="heroHeaderImage"] img')
						.first();

					const photo = await photoEl.getAttribute('src');

					const updatedPhoto = photo
						.replace(/w\d+(?=-)/, 'w1280')
						.replace(/h\d+(?=-)/, 'h720');

					const openingHours = await extractOpeningHours(listing, page);

					results.push({
						...basicInfo,
						reviews_count: reviewsCount,
						reviews_average: reviewsAverage,
						coordinates,
						photo: updatedPhoto,
						openingHours,
					});
				}
			}
		} catch (err) {
			results.push(null);
		}
	}

	console.log(results);

	await browser.close();

	return results;
};
