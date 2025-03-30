import { config } from '@/shared/config';
import authenticatedRequest from '../authenticatedRequest';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../constants';
import { ICreateCollectionRequest } from './types';

const getCollections = async (
	page = DEFAULT_PAGE,
	searchQuery = '',
	pageSize = DEFAULT_PAGE_SIZE
) => {
	const url = new URL(`${config.apiUrl}/collections`);
	url.searchParams.set('page', page);
	url.searchParams.set('searchQuery', searchQuery);
	url.searchParams.set('pageSize', pageSize);

	return await authenticatedRequest(url.toString(), {
		method: 'GET',
	});
};

const getCollection = async (id: string) => {
	return await authenticatedRequest(`${config.apiUrl}/collections/${id}`, {
		method: 'GET',
	});
};

const createCollection = async (data: ICreateCollectionRequest) => {
	return await authenticatedRequest(`${config.apiUrl}/collections`, {
		method: 'POST',
		body: JSON.stringify(data),
	});
};

const deleteCollection = async (id: string) => {
	return await authenticatedRequest(`${config.apiUrl}/collections/${id}`, {
		method: 'DELETE',
	});
};

export default {
	getCollections,
	getCollection,
	createCollection,
	deleteCollection,
};
