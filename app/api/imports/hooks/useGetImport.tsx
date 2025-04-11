import { IMPORTS } from '@/api/constants';
import { useQuery } from '@tanstack/react-query';
import importRequests from '../requests';
import { IImport } from '../types';

const useGetImport = (id: string) => {
	return useQuery<IImport>({
		queryKey: [IMPORTS, id],
		queryFn: () => importRequests.getImport(id),
	});
};

export default useGetImport;
