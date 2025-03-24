import { config } from '@/shared/config';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../constants';
import fetchWithMiddleware from '../fetchWithMiddleware';

const getCollections = async (
	page = DEFAULT_PAGE,
	searchQuery = '',
	pageSize = DEFAULT_PAGE_SIZE
) => {
	const url = new URL(`${config.apiUrl}/collections`);
	url.searchParams.set('page', page);
	url.searchParams.set('searchQuery', searchQuery);
	url.searchParams.set('pageSize', pageSize);

	return await fetchWithMiddleware(url.toString(), {
		method: 'GET',
	});
};

const getCollection = async (id: string) => {
	return await fetchWithMiddleware(`${config.apiUrl}/collections/${id}`, {
		method: 'GET',
	});
};

const createCollection = async (name: string, description: string) => {
	return await fetchWithMiddleware(`${config.apiUrl}/collections`, {
		method: 'POST',
		body: JSON.stringify({ name, description }),
	});
};

const deleteCollection = async (id: string) => {
	return await fetchWithMiddleware(`${config.apiUrl}/collections/${id}`, {
		method: 'DELETE',
	});
};

export default {
	getCollections,
	getCollection,
	createCollection,
	deleteCollection,
};
