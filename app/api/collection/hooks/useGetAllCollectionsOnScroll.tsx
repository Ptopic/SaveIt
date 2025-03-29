import collectionRequests from '@/api/collection/requests';
import { DEFAULT_PAGE } from '@/api/constants';
import { useInfiniteQuery } from '@tanstack/react-query';

interface UseGetAllCollectionsOnScrollProps {
	pageSize?: string;
	searchQuery?: string;
}

const useGetAllCollectionsOnScroll = ({
	pageSize = '6',
	searchQuery = '',
}: UseGetAllCollectionsOnScrollProps = {}) => {
	const {
		data,
		isLoading,
		isFetchingNextPage,
		hasNextPage,
		fetchNextPage,
		error,
		refetch,
	} = useInfiniteQuery({
		queryKey: ['collections', pageSize, searchQuery],
		queryFn: async ({ pageParam = DEFAULT_PAGE }) => {
			const response = await collectionRequests.getCollections(
				pageParam,
				searchQuery,
				pageSize
			);

			return {
				...response,
				current_page: Number(pageParam),
				per_page: Number(pageSize),
				last_page: Math.ceil(response.totalCollections / Number(pageSize)),
			};
		},
		getNextPageParam: (lastPage) => {
			if (lastPage.current_page < lastPage.last_page) {
				const nextPage = lastPage.current_page + 1;
				return nextPage;
			}

			return undefined;
		},
		initialPageParam: DEFAULT_PAGE,
	});

	const collections =
		data?.pages
			.flatMap((page) => page.data || [])
			.filter((item) => item != null) || [];

	return {
		collections,
		isLoading,
		isFetchingNextPage,
		hasNextPage,
		fetchNextPage,
		error,
		refetch,
	};
};

export default useGetAllCollectionsOnScroll;
