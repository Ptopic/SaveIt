import importRequest from '@/api/imports/requests';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

const useDeleteImport = (
	options?: UseMutationOptions<string, Error, any, unknown>
) => {
	return useMutation({
		mutationFn: (id: string) => importRequest.deleteImport(id),
		...options,
	});
};

export default useDeleteImport;
