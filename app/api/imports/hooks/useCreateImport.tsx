import { IMPORTS } from '@/api/constants';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import requests from '../requests';
import { ICreateImportRequest } from '../types';

const useCreateImport = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: ICreateImportRequest) => requests.createImport(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [IMPORTS] });
		},
	});
};

export default useCreateImport;
