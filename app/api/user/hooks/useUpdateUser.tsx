import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import userRequests from '../requests';
import { IUpdateUserRequest } from '../types';

const useUpdateUser = (
	options?: UseMutationOptions<IUpdateUserRequest, Error, any, unknown>
) => {
	return useMutation({
		mutationFn: (data: IUpdateUserRequest) => userRequests.updateUser(data),
		...options,
	});
};

export default useUpdateUser;
