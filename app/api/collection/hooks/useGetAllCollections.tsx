import { COLLECTIONS } from '@/api/constants';
import { PaginatedResults } from '@/api/types';
import { useQuery } from '@tanstack/react-query';
import collectionRequests from '../requests';
import { ICollection } from '../types';

const useGetAllCollections = ({
	page,
	searchQuery,
	pageSize,
}: {
	page: string;
	searchQuery: string;
	pageSize: string;
}) => {
	return useQuery<PaginatedResults<ICollection>>({
		queryKey: [COLLECTIONS, page, searchQuery, pageSize],
		queryFn: () =>
			collectionRequests.getCollections(page, searchQuery, pageSize),
	});
};

export default useGetAllCollections;
