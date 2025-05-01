import { LOCATIONS } from '@/api/constants';
import { useQuery } from '@tanstack/react-query';
import locationRequests from '../requests';
import { ILocation } from '../types';

const useGetLocationByImportIdAndCoordinates = (
	importId: string,
	latitude: string,
	longitude: string
) => {
	return useQuery<ILocation>({
		queryKey: [LOCATIONS, importId, latitude, longitude],
		queryFn: () =>
			locationRequests.getLocationsByImportIdAndCoordinates(
				importId,
				latitude,
				longitude
			),
	});
};

export default useGetLocationByImportIdAndCoordinates;
