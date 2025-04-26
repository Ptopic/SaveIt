import { config } from '@/shared/config';
import authenticatedRequest from '../authenticatedRequest';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../constants';

const getAllLocations = async (
	page = DEFAULT_PAGE,
	searchQuery = '',
	pageSize = DEFAULT_PAGE_SIZE
) => {
	const url = new URL(`${config.apiUrl}/locations`);

	url.searchParams.set('page', page);
	url.searchParams.set('searchQuery', searchQuery);
	url.searchParams.set('pageSize', pageSize);

	return await authenticatedRequest(url.toString(), {
		method: 'GET',
	});
};

const getLocationById = async (id: string) => {
	return await authenticatedRequest(`${config.apiUrl}/locations/${id}`, {
		method: 'GET',
	});
};

const getLocationsByImportId = async (importId: string) => {
	return await authenticatedRequest(
		`${config.apiUrl}/locations/import/${importId}`,
		{
			method: 'GET',
		}
	);
};

export default {
	getAllLocations,
	getLocationById,
	getLocationsByImportId,
};
