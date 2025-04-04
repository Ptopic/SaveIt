import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import collectionRequests from '../requests';

const useUpdateCollection = (
	id: string,
	options?: UseMutationOptions<any, Error, any, unknown>
) => {
	return useMutation({
		mutationFn: () => collectionRequests.deleteCollection(id),
		...options,
	});
};

export default useUpdateCollection;
