import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import collectionRequests from '../requests';
const useCreateCollection = (
	options?: UseMutationOptions<any, Error, any, unknown>
) => {
	return useMutation({
		mutationFn: ({
			name,
			description,
		}: {
			name: string;
			description: string;
		}) => collectionRequests.createCollection(name, description),
		...options,
	});
};

export default useCreateCollection;
