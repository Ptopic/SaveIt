import { config } from '@/shared/config';
import authenticatedRequest from '../authenticatedRequest';

const getAllLocations = async (searchQuery: string = '') => {
	const url = new URL(`${config.apiUrl}/locations`);

	url.searchParams.set('searchQuery', searchQuery);

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
