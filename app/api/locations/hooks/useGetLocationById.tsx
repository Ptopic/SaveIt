import { LOCATIONS } from '@/api/constants';
import { useQuery } from '@tanstack/react-query';
import locationRequests from '../requests';
import { ILocation } from '../types';

const useGetLocationById = (id: string) => {
	return useQuery<ILocation>({
		queryKey: [LOCATIONS, id],
		queryFn: () => locationRequests.getLocationById(id),
	});
};

export default useGetLocationById;
