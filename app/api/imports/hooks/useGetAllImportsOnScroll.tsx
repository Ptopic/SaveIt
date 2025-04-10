import { DEFAULT_PAGE, IMPORTS } from '@/api/constants';
import { useInfiniteQuery } from '@tanstack/react-query';
import importRequests from '../requests';

interface UseGetAllImportsOnScrollProps {
	pageSize?: string;
	searchQuery?: string;
	type?: string;
}

const useGetAllImportsOnScroll = ({
	pageSize = '6',
	searchQuery = '',
	type = '',
}: UseGetAllImportsOnScrollProps = {}) => {
	const {
		data,
		isLoading,
		isFetchingNextPage,
		hasNextPage,
		fetchNextPage,
		error,
		refetch,
	} = useInfiniteQuery({
		queryKey: [IMPORTS, pageSize, searchQuery, type],
		queryFn: async ({ pageParam = DEFAULT_PAGE }) => {
			const response = await importRequests.getAllImports(
				pageParam,
				searchQuery,
				pageSize,
				type
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

	const imports =
		data?.pages
			.flatMap((page) => page.data || [])
			.filter((item) => item != null) || [];

	return {
		imports,
		isLoading,
		isFetchingNextPage,
		hasNextPage,
		fetchNextPage,
		error,
		refetch,
	};
};

export default useGetAllImportsOnScroll;
