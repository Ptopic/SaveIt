import { config } from '@/shared/config';
import authenticatedRequest from '../authenticatedRequest';
import { IUpdateProfilePictureRequest } from './types';

const updateProfilePicture = async (data: IUpdateProfilePictureRequest) => {
	return await authenticatedRequest(`${config.apiUrl}/users/profilePicture`, {
		method: 'PATCH',
		body: JSON.stringify(data),
	});
};

export default {
	updateProfilePicture,
};
