import { IMPORTS } from '@/api/constants';
import { useQuery } from '@tanstack/react-query';
import importRequests from '../requests';

const useGetImport = (id: string) => {
	return useQuery({
		queryKey: [IMPORTS, id],
		queryFn: () => importRequests.getImport(id),
	});
};

export default useGetImport;
