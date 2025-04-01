import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import collectionRequests from '../requests';
import { IUpdateCollectionRequest } from '../types';

const useUpdateCollection = (
	id: string,
	options?: UseMutationOptions<IUpdateCollectionRequest, Error, any, unknown>
) => {
	return useMutation({
		mutationFn: (data: IUpdateCollectionRequest) =>
			collectionRequests.updateCollection(id, data),
		...options,
	});
};

export default useUpdateCollection;
