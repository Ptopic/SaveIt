import { config } from '@/shared/config';
import authenticatedRequest from '../authenticatedRequest';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../constants';
import { ICreateImportRequest } from './types';

const getAllImports = async (
	page = DEFAULT_PAGE,
	searchQuery = '',
	pageSize = DEFAULT_PAGE_SIZE,
	type = ''
) => {
	const url = new URL(`${config.apiUrl}/imports`);
	url.searchParams.set('page', page);
	url.searchParams.set('searchQuery', searchQuery);
	url.searchParams.set('pageSize', pageSize);
	url.searchParams.set('type', type);

	return await authenticatedRequest(url.toString(), {
		method: 'GET',
	});
};

const getImport = async (id: string) => {
	return await authenticatedRequest(`${config.apiUrl}/imports/${id}`, {
		method: 'GET',
	});
};

const createImport = async (data: ICreateImportRequest) => {
	return await authenticatedRequest(`${config.apiUrl}/imports/transcribe`, {
		method: 'POST',
		body: JSON.stringify(data),
	});
};

const deleteImport = async (id: string) => {
	return await authenticatedRequest(`${config.apiUrl}/imports/${id}`, {
		method: 'DELETE',
	});
};

export default {
	getAllImports,
	getImport,
	createImport,
	deleteImport,
};
