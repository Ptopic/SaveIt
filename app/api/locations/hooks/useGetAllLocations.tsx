import { LOCATIONS } from '@/api/constants';
import { useQuery } from '@tanstack/react-query';
import locationRequests from '../requests';
import { ILocation } from '../types';

interface IProps {
	searchQuery?: string;
}

const useGetAllLocations = ({ searchQuery }: IProps) => {
	return useQuery<ILocation[]>({
		queryKey: [LOCATIONS, searchQuery],
		queryFn: () => locationRequests.getAllLocations(searchQuery),
	});
};

export default useGetAllLocations;
