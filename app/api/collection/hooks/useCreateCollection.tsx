import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import collectionRequests from '../requests';
import { ICreateCollectionRequest } from '../types';

const useCreateCollection = (
	options?: UseMutationOptions<ICreateCollectionRequest, Error, any, unknown>
) => {
	return useMutation({
		mutationFn: (data: ICreateCollectionRequest) =>
			collectionRequests.createCollection(data),
		...options,
	});
};

export default useCreateCollection;
