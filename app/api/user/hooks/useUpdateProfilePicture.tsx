import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import userRequests from '../requests';
import { IUpdateProfilePictureRequest } from '../types';

const useUpdateProfilePicture = (
	options?: UseMutationOptions<
		IUpdateProfilePictureRequest,
		Error,
		any,
		unknown
	>
) => {
	return useMutation({
		mutationFn: (data: IUpdateProfilePictureRequest) =>
			userRequests.updateProfilePicture(data),
		...options,
	});
};

export default useUpdateProfilePicture;
