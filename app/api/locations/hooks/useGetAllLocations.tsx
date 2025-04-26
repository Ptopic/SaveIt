import { DEFAULT_PAGE, LOCATIONS } from '@/api/constants';
import { useInfiniteQuery } from '@tanstack/react-query';
import locationRequests from '../requests';
interface IProps {
	pageSize?: string;
	searchQuery?: string;
}

const useGetAllLocationsOnScroll = ({
	pageSize = '6',
	searchQuery = '',
}: IProps) => {
	const {
		data,
		isLoading,
		isFetchingNextPage,
		hasNextPage,
		fetchNextPage,
		error,
		refetch,
	} = useInfiniteQuery({
		queryKey: [LOCATIONS, pageSize, searchQuery],
		queryFn: async ({ pageParam = DEFAULT_PAGE }) => {
			const response = await locationRequests.getAllLocations(
				pageParam,
				searchQuery,
				pageSize
			);

			return {
				...response,
				current_page: Number(pageParam),
				per_page: Number(pageSize),
				last_page: Math.ceil(response.totalCount / Number(pageSize)),
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

	const locations =
		data?.pages
			.flatMap((page) => page.data || [])
			.filter((item) => item != null) || [];

	return {
		locations,
		isLoading,
		isFetchingNextPage,
		hasNextPage,
		fetchNextPage,
		error,
		refetch,
	};
};

export default useGetAllLocationsOnScroll;
