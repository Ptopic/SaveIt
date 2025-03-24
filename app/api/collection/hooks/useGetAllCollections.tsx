import { COLLECTIONS } from '@/api/constants';
import { useQuery } from '@tanstack/react-query';
import collectionRequests from '../requests';

const useGetAllCollections = ({
	page,
	searchQuery,
	pageSize,
}: {
	page: string;
	searchQuery: string;
	pageSize: string;
}) => {
	return useQuery({
		queryKey: [COLLECTIONS],
		queryFn: () =>
			collectionRequests.getCollections(page, searchQuery, pageSize),
	});
};

export default useGetAllCollections;
