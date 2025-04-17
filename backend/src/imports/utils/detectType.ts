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
