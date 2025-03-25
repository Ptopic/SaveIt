import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import collectionRequests from '../requests';
const useCreateCollection = (
	options?: UseMutationOptions<any, Error, any, unknown>
) => {
	return useMutation({
		mutationFn: ({
			name,
			description,
			image,
		}: {
			name: string;
			description?: string;
			image?: string;
		}) => collectionRequests.createCollection(name, description, image),
		...options,
	});
};

export default useCreateCollection;
