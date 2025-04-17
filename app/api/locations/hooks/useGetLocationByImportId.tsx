import { LOCATIONS } from '@/api/constants';
import { useQuery } from '@tanstack/react-query';
import locationRequests from '../requests';
import { ILocation } from '../types';

const useGetLocationByImportId = (importId: string) => {
	return useQuery<ILocation[]>({
		queryKey: [LOCATIONS, importId],
		queryFn: () => locationRequests.getLocationsByImportId(importId),
	});
};

export default useGetLocationByImportId;
