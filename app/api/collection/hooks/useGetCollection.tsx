import { COLLECTIONS } from '@/api/constants';
import { useQuery } from '@tanstack/react-query';
import collectionRequests from '../requests';
import { ICollection } from '../types';

const useGetCollection = (id: string) => {
	return useQuery<ICollection>({
		queryKey: [COLLECTIONS, id],
		queryFn: () => collectionRequests.getCollection(id),
	});
};

export default useGetCollection;
